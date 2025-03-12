import React from 'react'

import type { BaseSelection, LexicalEditor } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection.js'
import { mergeRegister } from '@lexical/utils'
import classNames from 'classnames'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical'
import { disableVideoResize$, disableVideoSettingsButton$, videoPreviewHandler$, openEditVideoDialog$ } from '.'
import styles from '../../styles/ui.module.css'
import { iconComponentFor$, readOnly$, useTranslation } from '@mdxeditor/editor'
import { $isVideoNode } from './VideoNode'
import { useCellValue, useCellValues, usePublisher } from '@mdxeditor/gurx'
import { MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx'
import { MdxVideo } from '../../components/mdx/Video'

export interface VideoEditorProps {
  nodeKey: string
  src: string
  alt?: string
  title?: string
  width: number | 'inherit'
  height: number | 'inherit'
  rest: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]
}

const videoCache = new Set()

function useSuspenseVideo(src: string) {
  if (!videoCache.has(src)) {
    throw new Promise((resolve) => {
        const video = document.createElement('video')
        video.src = src
        video.onloadeddata = () => {
            videoCache.add(src)
            resolve(null)
        }
        video.onerror = video.onload = () => {
            videoCache.add(src)
            resolve(null)
      }
    })
  }
}

function LazyVideo({
  title,
  alt,
  className,
  videoRef,
  src,
  width,
  height
}: {
  title: string
  alt: string
  className: string | null
  videoRef: { current: null | HTMLImageElement }
  src: string
  width: number | 'inherit'
  height: number | 'inherit'
}): JSX.Element {
  useSuspenseVideo(src)
  return (<MdxVideo src={src}></MdxVideo>)
}

export function VideoEditor({ src, title, alt, nodeKey, width, height, rest }: VideoEditorProps): JSX.Element | null {
  const [disableVideoResize, disableVideoSettingsButton, videoPreviewHandler, iconComponentFor, readOnlyVideo] = useCellValues(
    disableVideoResize$,
    disableVideoSettingsButton$,
    videoPreviewHandler$,
    iconComponentFor$,
    readOnly$
  )

  const openEditVideoDialog = usePublisher(openEditVideoDialog$)
  const videoRef = React.useRef<null | HTMLImageElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)
  const [editor] = useLexicalComposerContext()
  const [selection, setSelection] = React.useState<BaseSelection | null>(null)
  const activeEditorRef = React.useRef<LexicalEditor | null>(null)
  const [isResizing, setIsResizing] = React.useState<boolean>(false)
  const [videoSource, setVideoSource] = React.useState<string | null>(null)
  const [initialVideoPath, setInitialVideoPath] = React.useState<string | null>(null)
  const t = useTranslation()

  const onDelete = React.useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        const node = $getNodeByKey(nodeKey)
        if ($isVideoNode(node)) {
          node.remove()
        }
      }
      return false
    },
    [isSelected, nodeKey]
  )

  const onEnter = React.useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection()
      const buttonElem = buttonRef.current
      if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
        if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault()
          buttonElem.focus()
          return true
        }
      }
      return false
    },
    [isSelected]
  )

  const onEscape = React.useCallback(
    (event: KeyboardEvent) => {
      if (buttonRef.current === event.target) {
        $setSelection(null)
        editor.update(() => {
          setSelected(true)
          const parentRootElement = editor.getRootElement()
          if (parentRootElement !== null) {
            parentRootElement.focus()
          }
        })
        return true
      }
      return false
    },
    [editor, setSelected]
  )

  React.useEffect(() => {
    if (videoPreviewHandler) {
      const callPreviewHandler = async () => {
        if (!initialVideoPath) setInitialVideoPath(src)
        const updatedSrc = await videoPreviewHandler(src)
        setVideoSource(updatedSrc)
      }
      callPreviewHandler().catch((e: unknown) => {
        console.error(e)
      })
    } else {
      setVideoSource(src)
    }
  }, [src, videoPreviewHandler, initialVideoPath])

  React.useEffect(() => {
    let isMounted = true
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()))
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload

          if (isResizing) {
            return true
          }
          if (event.target === videoRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected)
            } else {
              clearSelection()
              setSelected(true)
            }
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === videoRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
    )
    return () => {
      isMounted = false
      unregister()
    }
  }, [clearSelection, editor, isResizing, isSelected, nodeKey, onDelete, onEnter, onEscape, setSelected])

  const onResizeEnd = (nextWidth: 'inherit' | number, nextHeight: 'inherit' | number) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false)
    }, 200)

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isVideoNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight)
      }
    })
  }

  const onResizeStart = () => {
    // setIsResizing(true)
    setIsResizing(false) // Don't allow resizing for video
  }

  const draggable = $isNodeSelection(selection)
  const isFocused = isSelected

  const passedClassName = React.useMemo(() => {
    if (rest.length === 0) {
      return null
    }
    const className = rest.find((attr) => attr.type === 'mdxJsxAttribute' && (attr.name === 'class' || attr.name === 'className'))
    if (className) {
      return className.value as string
    }
    return null
  }, [rest])

  return videoSource !== null ? (
    <React.Suspense fallback={null}>
      <div className={styles.imageWrapper} data-editor-block-type="image">
        <div draggable={draggable}>
          <LazyVideo
            width={width}
            height={height}
            className={classNames(
              {
                [styles.focusedImage]: isFocused
              },
              passedClassName
            )}
            src={videoSource}
            title={title ?? ''}
            alt={alt ?? ''}
            videoRef={videoRef}
          />
        </div>
        {readOnlyVideo ? null : (
          <div className={styles.editImageToolbar}>
            <button
              className={styles.iconButton}
              type="button"
              title={t('imageEditor.deleteImage', 'Delete image')}
              disabled={readOnlyVideo ? true : false}
              onClick={(e) => {
                e.preventDefault()
                editor.update(() => {
                  $getNodeByKey(nodeKey)?.remove()
                })
              }}
            >
              {iconComponentFor('delete_small')}
            </button>
            {!disableVideoSettingsButton && (
              <button
                type="button"
                className={classNames(styles.iconButton, styles.editImageButton)}
                title={t('imageEditor.editImage', 'Edit image')}
                disabled={readOnlyVideo ? true : false}
                onClick={() => {
                  openEditVideoDialog({
                    nodeKey: nodeKey,
                    initialValues: {
                      src: !initialVideoPath ? videoSource : initialVideoPath,
                      title: title ?? '',
                      altText: alt ?? ''
                    }
                  })
                }}
              >
                {iconComponentFor('settings')}
              </button>
            )}
          </div>
        )}
      </div>
    </React.Suspense>
  ) : null
}
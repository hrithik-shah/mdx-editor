import {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxExpressionAttribute,
} from 'mdast-util-mdx-jsx'
import React from 'react'
import { useMdastNodeUpdater } from '@mdxeditor/editor'
import { PropertyPopover } from '@mdxeditor/editor'
import { JsxEditorProps } from '@mdxeditor/editor'

import { MdxImage } from '../mdx/Image'

const isExpressionValue = (value: string | MdxJsxAttributeValueExpression | null | undefined): value is MdxJsxAttributeValueExpression => {
  if (value !== null && typeof value === 'object' && 'type' in value && 'value' in value && typeof value.value === 'string') {
    return true
  }

  return false
}

const isStringValue = (value: string | MdxJsxAttributeValueExpression | null | undefined): value is string => typeof value === 'string'

const isMdxJsxAttribute = (value: MdxJsxAttribute | MdxJsxExpressionAttribute): value is MdxJsxAttribute => {
  if (value.type === 'mdxJsxAttribute' && typeof value.name === 'string') {
    return true
  }

  return false
}

/**
 * A component capable of editing JSX properties
 */
type PropertyEditorType = typeof PropertyPopover

/**
 * Properties for the Generic Jsx Editor
 */
export interface ImageEditorProps extends JsxEditorProps {
  /**
   * A custom property editor component {@link PropertyEditorType}
   */
  PropertyEditor?: PropertyEditorType
}

/**
 * A image editor that can be used as an universal UI for any JSX element.
 * Allows editing of the element content and properties.
 * Use this editor for the {@link JsxComponentDescriptor} Editor option.
 * @group JSX
 */
export const ImageEditor: React.FC<ImageEditorProps> = ({ mdastNode, descriptor, PropertyEditor }) => {
  const updateMdastNode = useMdastNodeUpdater()

  const properties = React.useMemo(
      () =>
          descriptor.props.reduce<Record<string, string>>((acc, { name }) => {
            const attribute = mdastNode.attributes.find((attr) => (isMdxJsxAttribute(attr) ? attr.name === name : false))

            if (attribute) {
              if (isExpressionValue(attribute.value)) {
                acc[name] = attribute.value.value
                return acc
              }

              if (isStringValue(attribute.value)) {
                acc[name] = attribute.value
                return acc
              }
            }

            acc[name] = ''
            return acc
          }, {}),
      [mdastNode, descriptor]
  )

  const onChange = React.useCallback(
      (values: Record<string, string>) => {
        const updatedAttributes = Object.entries(values).reduce<typeof mdastNode.attributes>((acc, [name, value]) => {
          if (value === '') {
            return acc
          }

          const property = descriptor.props.find((prop) => prop.name === name)

          acc.push({
            type: 'mdxJsxAttribute',
            name,
            value
          })

          return acc
        }, [])

        updateMdastNode({ attributes: updatedAttributes })
      },
      [mdastNode, updateMdastNode, descriptor]
  )

  const PropertyEditorComponent = PropertyEditor ?? PropertyPopover

  return (
      <div className={"jsxElement"}>
          <MdxImage
              img={properties['src']}
              alt='https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg'
          />
      </div>
  )
}
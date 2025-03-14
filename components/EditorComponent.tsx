'use client'

import {useEffect, useRef, useState} from "react";
import {
  BoldItalicUnderlineToggles,
  Separator,
  CreateLink,
  BlockTypeSelect,
  toolbarPlugin,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  quotePlugin,
  listsPlugin,
  diffSourcePlugin,
  MDXEditor,
  MDXEditorMethods,
  DiffSourceToggleWrapper,
  jsxPlugin,
  UndoRedo,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  InsertAdmonition,
  tablePlugin,
  InsertTable,
  codeMirrorPlugin,
  codeBlockPlugin
} from '@mdxeditor/editor';

import { jsxComponentDescriptors, InsertVideo, InsertImage, InsertMath } from "./mdx_editors/JsxComponents"

const HomepageEditor: React.FC = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const markdownRef = useRef([]);

  useEffect(() => {
    const savedMarkdown = localStorage.getItem("markdown");
    if (savedMarkdown) {
      editorRef.current?.setMarkdown(savedMarkdown);
    }
  }, []);

  const downloadMarkdown = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getMarkdown();
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = "markdown.md";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  };

  const handleChange = () => {
      localStorage.setItem("markdown", editorRef.current?.getMarkdown() || "");
  }

  return (
    <div className="max-h-[226px]">
      <MDXEditor
        ref={editorRef}
        contentEditableClassName="prose min-w-full"
        markdown={editorRef.current?.getMarkdown() || ""} // Initial markdown can still be set here
        onChange={handleChange} // This can still log changes or be removed if unnecessary
        plugins={[
            headingsPlugin(),
            codeBlockPlugin(),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'javascript', ts: 'typescript' } }),
            linkPlugin(),
            linkDialogPlugin(),
            quotePlugin(),
            listsPlugin(),
            tablePlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                    <>
                      <DiffSourceToggleWrapper>
                        <UndoRedo />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <CreateLink />
                        <BlockTypeSelect />
                        <InsertAdmonition />
                        <InsertTable />
                        {/* <button onClick={downloadMarkdown} style={{ marginLeft: '10px' }}>
                        Download Markdown
                      </button>
                        */}
                        <InsertVideo />
                        <InsertImage />
                        <InsertMath />
                      </DiffSourceToggleWrapper>
                    </>
                ),
              }),
          diffSourcePlugin(),
          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
          jsxPlugin({ jsxComponentDescriptors }),
        ]}
      />
    </div>
  );
}

export default HomepageEditor;

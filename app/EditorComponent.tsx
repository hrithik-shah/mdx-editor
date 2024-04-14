'use client'
import React, { useRef } from 'react';
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
  codeBlockPlugin,
  codeMirrorPlugin,
  MDXEditor,
  MDXEditorMethods
} from '@mdxeditor/editor';

const HomepageEditor: React.FC = () => {
  const editorRef = useRef<MDXEditorMethods>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result?.toString();
        if (text && editorRef.current) {
          editorRef.current.setMarkdown(text);
        }
      };
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        reader.abort();
      };
      reader.readAsText(file);
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className="overflow-y-auto max-h-[226px]">
      <MDXEditor
        ref={editorRef}
        markdown="hello, world" // Initial markdown can still be set here
        onChange={console.log} // This can still log changes or be removed if unnecessary
        contentEditableClassName="prose"
        plugins={[
          headingsPlugin(),
          codeBlockPlugin(),
          codeMirrorPlugin({ codeBlockLanguages: { js: 'javascript', ts: 'typescript' } }),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          listsPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <BoldItalicUnderlineToggles />
                <Separator />
                <CreateLink />
                <BlockTypeSelect />
                <button onClick={downloadMarkdown} style={{ marginLeft: '10px' }}>
                  Download Markdown
                </button>
                <input
                  type="file"
                  accept=".md,text/plain"
                  onChange={handleFileUpload}
                  style={{ marginLeft: '10px' }}
                />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}

export default HomepageEditor;

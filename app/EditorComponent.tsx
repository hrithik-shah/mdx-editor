'use client'
import React, { useState } from 'react';
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
} from '@mdxeditor/editor';

const HomepageEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`
Click here to start editing this text.

Here's the familiar **bold**, *italic*, and <u>underline</u> formatting. 

You can also have links, like this link to the [awesome React virtualization library](https://virtuoso.dev).

* This is a list;
* With some items.

And a code block:

\`\`\`js
console.log("A javascript code block")
\`\`\`

There's a lot more you can find in [live demo](editor/demo).
`);

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "markdown.md"; // or any other filename you want
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type === "text/markdown") {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result;
        setMarkdown(text?.toString() || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="overflow-y-auto max-h-[226px]">
      <MDXEditor
        markdown={markdown}
        onChange={handleMarkdownChange}
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
                  accept=".md"
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

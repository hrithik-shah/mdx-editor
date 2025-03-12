import { MDXEditor } from '@mdxeditor/editor'
import { jsxPlugin } from '@mdxeditor/editor'
import { toolbarPlugin } from '@mdxeditor/editor'
import { Button } from '@mdxeditor/editor'
import { usePublisher, insertJsx$ } from '@mdxeditor/editor'
import { GenericJsxEditor } from '@mdxeditor/editor'
import { NestedLexicalEditor } from '@mdxeditor/editor'
import type { JsxComponentDescriptor } from '@mdxeditor/editor'

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    {
      name: 'MyLeaf',
      kind: 'text', // 'text' for inline, 'flow' for block
      // the source field is used to construct the import statement at the top of the markdown document.
      // it won't be actually sourced.
      source: './external',
      // Used to construct the property popover of the generic editor
      props: [
        { name: 'foo', type: 'string' },
        { name: 'bar', type: 'string' },
      ],
      // whether the component has children or not
      hasChildren: true,
      Editor: GenericJsxEditor
    },
    {
      name: 'Marker',
      kind: 'text',
      source: './external',
      props: [{ name: 'type', type: 'string' }],
      hasChildren: false,
      Editor: () => {
        return (
          <div style={{ border: '1px solid red', padding: 8, margin: 8, display: 'inline-block' }}>
            <NestedLexicalEditor<any>
              getContent={(node) => node.children}
              getUpdatedMdastNode={(mdastNode, children: any) => {
                return { ...mdastNode, children }
              }}
            />
          </div>
        )
      }
    },
    {
      name: 'BlockNode',
      kind: 'flow',
      source: './external',
      props: [],
      hasChildren: true,
      Editor: GenericJsxEditor
    }
  ]
  
  // a toolbar button that will insert a JSX element into the editor.
  const InsertMyLeaf = () => {
    const insertJsx = usePublisher(insertJsx$)
    return (
      <Button
        onClick={() =>
          insertJsx({
            name: 'MyLeaf',
            kind: 'text',
            props: { foo: 'bar', bar: 'baz', onClick: '() => console.log("Clicked")' }
          })
        }
      >
        Leaf
      </Button>
    )
  }

  const jsxMarkdown = "Hello, world!"
  
  export const Example = () => {
    return (
      <MDXEditor
        markdown={jsxMarkdown} // the contents of the file  below
        onChange={console.log}
        plugins={[
          jsxPlugin({ jsxComponentDescriptors }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <InsertMyLeaf />
              </>
            )
          })
        ]}
      />
    )
  }
import { createElement, JSX } from 'react'
import { twMerge } from 'tailwind-merge'

import dynamic from 'next/dynamic'

function twElement<T extends keyof JSX.IntrinsicElements>(elemTagName: T, className: string) {
  const Component = ({ className: classNameProp, ...props }: JSX.IntrinsicElements[T]) => {
    return createElement(elemTagName, { ...props, className: twMerge(className, classNameProp) })
  }
  Component.displayName = `twElement(${elemTagName})`;
  return Component;
}

const HomepageEditor = dynamic(() => import('./EditorComponent'), { ssr: false })

const ActionLinkButton = twElement(
  'a',
  'border-solid border-[1px] rounded-md border-neutral-textContrast px-8 py-3 bg-white font-mono text-sm'
)
const ActionLink = twElement('a', 'block mt-5 text-accent-text  [&_svg]:inline')

const codeSample1 = `
<MdxEditor
  markdown={markdown}
  className={className}
  contentEditableClassName="my-prose-class"
/>
`.trim()

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 xl:gap-y-16 [&>div]:p-3 [&>div]:py-5 md:[&>div]:p-4 md:[&>div]:py-6 mb-8 xl:mb-16">
        {/* stage 0 */}
        <div className="p-4 mx-4">
        </div>
        <div>
          <h2 className="font-mono text-2xl font-normal mb-4">app.mdxeditor is in preview.</h2>

          <p className="text-lg">Edit, commit and push markdown in your GitHub repositories from your browser. No local setup necessary.</p>

          <div className="py-4 flex gap-8">
            <ActionLinkButton href="https://app.mdxeditor.dev/sandbox" className="border-accent-text bg-accent-text text-neutral-base">
              Try the app sandbox
            </ActionLinkButton>
          </div>
        </div>

        <div>
          <h2 className="font-mono text-2xl font-normal mb-4">
            <span className="underline">Markdown</span> editing can be <br />
            even{' '}
            <span className="bg-accent-bg after:border-r-accent-solidHover after:border-solid after:border-r-2 after:inline-block after:h-[2.1rem] after:translate-y-[0.5rem]">
              more
            </span>{' '}
            delightful.
          </h2>

          <p className="text-lg">
            MDXEditor is an open-source React component that allows <br />
            users to author markdown documents naturally.
            <br /> Just like in Google docs or Notion.
          </p>

          <div className="py-4 flex gap-8">
            <ActionLinkButton href="/editor/demo">Try it live</ActionLinkButton>
            <ActionLinkButton href="/editor/docs/getting-started" className="border-accent-text bg-accent-text text-neutral-base">
              Get started
            </ActionLinkButton>
          </div>
        </div>
        <div className="p-4 mx-4">
          <HomepageEditor />
        </div>
      </div>
         
    </>
  )
}
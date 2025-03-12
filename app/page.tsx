"use client"

import dynamic from 'next/dynamic'

const HomepageEditor = dynamic(() => import('../components/EditorComponent'), { ssr: false })

export default function Home() {
    return (
        <HomepageEditor />
    )
}
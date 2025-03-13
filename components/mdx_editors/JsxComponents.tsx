"use client";

import React, { useState } from 'react';

import {
    JsxComponentDescriptor,
    usePublisher,
    insertJsx$,
    Button
} from "@mdxeditor/editor"

import { VideoEditor } from './/VideoEditor';
import { ImageEditor } from './/ImageEditor';
import { MathEditor } from './/MathEditor';

export const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    {
        name: 'Video',
        kind: 'text',
        source: './external',
        props: [{name: 'src', type: 'string'}],
        hasChildren: false,
        Editor: VideoEditor
    },
    {
        name: 'Image',
        kind: 'text',
        source: './external',
        props: [
            {name: 'img', type: 'string'},
            {name: 'alt', type: 'string'}
        ],
        hasChildren: false,
        Editor: ImageEditor
    },
    {
        name: 'Math',
        kind: 'text',
        source: './external',
        props: [
            {name: 'latex', type: 'string'}
        ],
        hasChildren: false,
        Editor: MathEditor
    }
]

// a toolbar button that will insert a JSX element into the editor.
export const InsertVideo = () => {
    const insertJsx = usePublisher(insertJsx$)
    const [videoUrl, setVideoUrl] = useState("")
    const [showInput, setShowInput] = useState(false)

    const formatYoutubeUrl = (url: string) => {
        if (!url) return "";

        // If it's already an embed URL, return as is
        if (url.includes('/embed/')) return url;

        // Convert watch URL to embed URL
        const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/|user\/\S+|attribution_link\/\S+))([^?&"'>]+)/);

        if (videoIdMatch && videoIdMatch[1]) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        }

        // Return original if we couldn't parse it
        return url;
    }

    const handleInsert = () => {
        const formattedUrl = formatYoutubeUrl(videoUrl);
        insertJsx({
            name: 'Video',
            kind: 'text',
            props: { src: formattedUrl }
        });

        setShowInput(false);
    }

    return (
        <div className="flex flex-col gap-2">
            {showInput ? (
                <>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="Paste YouTube URL here"
                            className="px-3 py-2 border rounded-md flex-grow"
                        />
                        <Button onClick={handleInsert}>Insert</Button>
                        <Button
                            onClick={() => {
                                setShowInput(false)
                                setVideoUrl("")
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            ) : (
                <Button onClick={() => setShowInput(true)}>
                    Insert Video
                </Button>
            )}
        </div>
    )
}

// a toolbar button that will insert a JSX element into the editor.
export const InsertImage = () => {
    const insertJsx = usePublisher(insertJsx$)
    const [imageUrl, setImageUrl] = useState("")
    const [showInput, setShowInput] = useState(false)

    const handleInsert = () => {
        insertJsx({
            name: 'Image',
            kind: 'text',
            props: { img: imageUrl, alt: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" }
        });

        setShowInput(false);
    }

    return (
        <div className="flex flex-col gap-2">
            {showInput ? (
                <>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Paste image URL here"
                            className="px-3 py-2 border rounded-md flex-grow"
                        />
                        <Button onClick={handleInsert}>Insert</Button>
                        <Button
                            onClick={() => {
                                setShowInput(false)
                                setImageUrl("")
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            ) : (
                <Button onClick={() => setShowInput(true)}>
                    Insert Image
                </Button>
            )}
        </div>
    )
}

// a toolbar button that will insert a JSX element into the editor.
export const InsertMath = () => {
    const insertJsx = usePublisher(insertJsx$)
    const [latex, setLatex] = useState("")
    const [showInput, setShowInput] = useState(false)

    const handleInsert = () => {
        insertJsx({
            name: 'Math',
            kind: 'text',
            props: { latex: "$$" + latex + "$$" }
        });

        setLatex("")
        setShowInput(false);
    }

    return (
        <div className="flex flex-col gap-2">
            {showInput ? (
                <>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="Paste latex here"
                            className="px-3 py-2 border rounded-md flex-grow"
                        />
                        <Button onClick={handleInsert}>Insert</Button>
                        <Button
                            onClick={() => {
                                setShowInput(false)
                                setLatex("")
                                console.log(latex)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            ) : (
                <Button onClick={() => setShowInput(true)}>
                    Insert Latex
                </Button>
            )}
        </div>
    )
}

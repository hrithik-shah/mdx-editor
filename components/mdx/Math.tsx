"use client";

import React, { useEffect, useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

export const MdxMath = ({ latex }: { latex: string }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Render a fallback on the server
        return <div>{latex}</div>;
    }

    // Render MathJax on the client
    return (
        <MathJaxContext>
            <MathJax>{latex}</MathJax>
        </MathJaxContext>
    );
};
import React, { useEffect, useRef } from "react";
import "./docx-viewer.css";

const DocxViewer = ({ src }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        let aborted = false;
        async function load() {
            try {
                const res = await fetch(src, { cache: "no-store" });
                const blob = await res.blob();
                if (aborted) return;
                const { renderAsync } = await import("docx-preview");
                await renderAsync(blob, containerRef.current, undefined, {
                    inWrapper: true,
                    className: "docx",
                    trimXmlDeclaration: true,
                });
            } catch (_) {}
        }
        load();
        return () => {
            aborted = true;
            if (containerRef.current) containerRef.current.innerHTML = "";
        };
    }, [src]);

    return (
        <div className="docx-viewer">
            <div className="docx-page" ref={containerRef} />
        </div>
    );
};

export default DocxViewer;

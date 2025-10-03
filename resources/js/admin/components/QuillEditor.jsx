import React, { useEffect, useRef } from "react";
import Quill from "quill";
import * as ImageDropNS from "quill-image-drop-module";
import BlotFormatter from "quill-blot-formatter";
import "quill/dist/quill.snow.css";

// Editor Quill native (tanpa react-quill) agar kompatibel dengan React 19
// Props: value (html), onChange(html), modules, formats, placeholder, style, readOnly
export default function QuillEditor({
    value = "",
    onChange,
    modules,
    formats,
    placeholder,
    style,
    readOnly = false,
}) {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const initialHtmlRef = useRef(value);

    useEffect(() => {
        if (!containerRef.current) return;

        // Buat container untuk toolbar + editor
        const editorWrapper = document.createElement("div");
        const editorEl = document.createElement("div");
        editorWrapper.appendChild(editorEl);
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(editorWrapper);

        // Register modules once
        const ResolvedImageDrop =
            ImageDropNS && ImageDropNS.default
                ? ImageDropNS.default
                : ImageDropNS.ImageDrop || ImageDropNS;

        // Register BlotFormatter (resize/align/resize handles) - Quill v2 compatible
        if (!Quill.imports["modules/blotFormatter"]) {
            Quill.register("modules/blotFormatter", BlotFormatter);
        }
        if (!Quill.imports["modules/imageDrop"]) {
            Quill.register("modules/imageDrop", ResolvedImageDrop);
        }

        const quill = new Quill(editorEl, {
            theme: "snow",
            modules: {
                ...modules,
                blotFormatter: modules?.blotFormatter ?? {},
                imageDrop: modules?.imageDrop ?? true,
            },
            formats,
            placeholder,
            readOnly,
        });
        quillRef.current = quill;

        // Set nilai awal jika ada
        if (initialHtmlRef.current) {
            quill.clipboard.dangerouslyPasteHTML(initialHtmlRef.current);
        }

        // Listener perubahan konten
        const handler = () => {
            if (!onChange) return;
            const html = editorEl.querySelector(".ql-editor")?.innerHTML ?? "";
            onChange(html);
        };
        quill.on("text-change", handler);

        return () => {
            quill.off("text-change", handler);
            quillRef.current = null;
            containerRef.current && (containerRef.current.innerHTML = "");
        };
    }, []);

    // Sinkronkan value eksternal (misal reset form)
    useEffect(() => {
        if (!quillRef.current) return;
        const editorEl = containerRef.current?.querySelector(".ql-editor");
        if (!editorEl) return;
        const current = editorEl.innerHTML;
        if (value !== current) {
            const sel = quillRef.current.getSelection();
            quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
            if (sel) quillRef.current.setSelection(sel);
        }
    }, [value]);

    return <div ref={containerRef} style={style} />;
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// PDF Image Viewer Component
const PDFImageViewer = ({
    pdfUrl,
    title,
    onPageChange,
    currentPage,
    totalPages,
    onTotalPagesChange,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Wait for PDF.js library to be available
                let attempts = 0;
                while (!window.pdfjsLib && attempts < 50) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    attempts++;
                }

                const pdfjsLib = window.pdfjsLib;
                if (!pdfjsLib) {
                    throw new Error("PDF.js library not loaded");
                }

                // Set worker
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

                // Load PDF
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;

                // Convert all pages to images
                const pageImages = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });

                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d", {
                        willReadFrequently: true,
                    });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };

                    await page.render(renderContext).promise;
                    pageImages.push(canvas.toDataURL("image/png"));
                }

                setImages(pageImages);
                if (onTotalPagesChange) {
                    onTotalPagesChange(pdf.numPages);
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Error loading PDF:", err);
                setError("Gagal memuat PDF. Pastikan file PDF valid.");
                setIsLoading(false);
            }
        };

        loadPDF();
    }, [pdfUrl]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat PDF...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                </p>
            </div>
            <div className="h-96 flex items-center justify-center bg-gray-100">
                {images[currentPage - 1] && (
                    <img
                        src={images[currentPage - 1]}
                        alt={`Page ${currentPage}`}
                        className="max-w-full max-h-full object-contain shadow-lg"
                    />
                )}
            </div>
        </div>
    );
};

const TinjauanPustaka = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [pdfContent, setPdfContent] = useState(null);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [pdfPages, setPdfPages] = useState([]);
    const [currentPdfPage, setCurrentPdfPage] = useState(1);
    const [totalPdfPages, setTotalPdfPages] = useState(0);
    const readerRef = useRef(null);

    const formatCode = (code) => {
        const base = (code || "KODE PRODUKSI").trim();
        return base.endsWith("/") ? base : `${base}/`;
    };
    const codeWithoutSlash = (code) => {
        const base = (code || "KODE PRODUKSI").trim();
        return base.replace(/\/+$/g, "");
    };

    const totalPages = chapters.length > 0 ? chapters.length : 1;
    const pageLabel = useMemo(() => {
        if (showPdfViewer && pdfContent) {
            return `${currentPdfPage}/${totalPdfPages}`;
        }
        return `${activeChapterIndex + 1}/${totalPages}`;
    }, [
        showPdfViewer,
        pdfContent,
        currentPdfPage,
        totalPdfPages,
        activeChapterIndex,
        totalPages,
    ]);

    // Load PDF.js library
    useEffect(() => {
        const loadPDFJS = () => {
            if (window.pdfjsLib) return;

            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => {
                console.log("PDF.js loaded successfully");
            };
            document.head.appendChild(script);
        };

        loadPDFJS();
    }, []);

    useEffect(() => {
        let mounted = true;
        const fetchBook = async () => {
            try {
                if (!id) return;
                const res = await fetch(`/books/${encodeURIComponent(id)}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (mounted) setBook(data);
            } catch (_) {
                // ignore
            }
        };
        fetchBook();
        return () => {
            mounted = false;
        };
    }, [id]);

    useEffect(() => {
        let mounted = true;
        const fetchChapters = async () => {
            try {
                if (!id) return;
                const res = await fetch(
                    `/book-contents?book_id=${encodeURIComponent(id)}`
                );
                if (!res.ok) throw new Error("Failed to fetch chapters");
                const data = await res.json();
                // Expecting array of { id, chapter_number, chapter_title, content, content_type, pdf_path }
                const sorted = Array.isArray(data)
                    ? [...data].sort((a, b) => {
                          const an = Number(a.chapter_number) || 0;
                          const bn = Number(b.chapter_number) || 0;
                          return an - bn;
                      })
                    : [];

                if (mounted) {
                    setChapters(sorted);
                    setActiveChapterIndex(0);

                    // Check if there's PDF content
                    const pdfChapter = sorted.find(
                        (ch) => ch.content_type === "pdf" && ch.pdf_path
                    );
                    if (pdfChapter) {
                        setPdfContent({
                            url: `/storage/${pdfChapter.pdf_path}`,
                            title: pdfChapter.chapter_title,
                            path: pdfChapter.pdf_path,
                        });
                        setShowPdfViewer(true);
                    }
                }
            } catch (_) {
                if (mounted) {
                    setChapters([]);
                    setActiveChapterIndex(0);
                }
            }
        };
        fetchChapters();
        return () => {
            mounted = false;
        };
    }, [id]);

    const goPrev = () => {
        if (showPdfViewer && pdfContent) {
            // Navigate PDF pages
            setCurrentPdfPage((page) => Math.max(1, page - 1));
        } else {
            // Navigate chapters
            setActiveChapterIndex((idx) => Math.max(0, idx - 1));
        }
        if (readerRef.current) {
            readerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goNext = () => {
        if (showPdfViewer && pdfContent) {
            // Navigate PDF pages
            setCurrentPdfPage((page) => Math.min(totalPdfPages, page + 1));
        } else {
            // Navigate chapters
            setActiveChapterIndex((idx) => Math.min(totalPages - 1, idx + 1));
        }
        if (readerRef.current) {
            readerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const togglePdfViewer = () => {
        setShowPdfViewer(!showPdfViewer);
    };

    const closePdfViewer = () => {
        setShowPdfViewer(false);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <main className="relative">
                {/* Sidebar kiri full height */}
                <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#113939] text-white overflow-y-auto z-30">
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-start space-x-3">
                            <img
                                src={book?.cover || "/images/Cover Buku.svg"}
                                alt="Cover"
                                className="w-24 h-32"
                                onError={(e) =>
                                    (e.currentTarget.src =
                                        "/images/Cover Buku.svg")
                                }
                            />
                            <div>
                                <p className="text-xs opacity-80">
                                    {codeWithoutSlash(book?.code)}
                                </p>
                                <p className="text-sm font-semibold leading-tight">
                                    {book?.title || "Nama Buku"}
                                </p>
                                <p className="text-[11px] opacity-90 mt-1">
                                    {book?.author || "Nama Penyusun"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="text-sm">
                        <button className="w-full px-4 py-3 hover:bg-white/10 border-b border-white/10 flex items-center text-left">
                            <img
                                src="/images/Icon list.svg"
                                alt="List"
                                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-2 flex-shrink-0"
                            />
                            <span>Daftar Isi</span>
                        </button>

                        {pdfContent && (
                            <button
                                onClick={togglePdfViewer}
                                className={`w-full px-4 py-3 hover:bg-white/10 border-b border-white/10 flex items-center text-left ${
                                    showPdfViewer ? "bg-white/20" : ""
                                }`}
                            >
                                <img
                                    src="/images/FileText.svg"
                                    alt="PDF"
                                    className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-2 flex-shrink-0"
                                />
                                <span>PDF Viewer</span>
                            </button>
                        )}
                        {showPdfViewer && pdfContent ? (
                            // PDF Pages in sidebar
                            Array.from(
                                { length: totalPdfPages },
                                (_, i) => i + 1
                            ).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    className={`w-full text-left px-4 py-3 border-b border-white/10 hover:bg-white/10 ${
                                        pageNum === currentPdfPage
                                            ? "bg-white/10"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setCurrentPdfPage(pageNum);
                                        if (readerRef.current)
                                            readerRef.current.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });
                                    }}
                                >
                                    Halaman {String(pageNum).padStart(2, "0")}
                                </button>
                            ))
                        ) : (
                            // Regular chapters
                            <>
                                {chapters.length === 0 && (
                                    <div className="px-4 py-3 text-white/80 border-b border-white/10">
                                        Belum ada konten.
                                    </div>
                                )}
                                {chapters.map((ch, idx) => {
                                    const labelNum = String(
                                        Number(ch.chapter_number) || idx + 1
                                    ).padStart(2, "0");
                                    return (
                                        <button
                                            key={ch.id || idx}
                                            className={`w-full text-left px-4 py-3 border-b border-white/10 hover:bg-white/10 ${
                                                idx === activeChapterIndex
                                                    ? "bg-white/10"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setActiveChapterIndex(idx);
                                                if (readerRef.current)
                                                    readerRef.current.scrollTo({
                                                        top: 0,
                                                        behavior: "smooth",
                                                    });
                                            }}
                                        >
                                            {labelNum}{" "}
                                            {ch.chapter_title || "Untitled"}
                                        </button>
                                    );
                                })}
                            </>
                        )}
                    </nav>
                </aside>

                {/* Area kanan */}
                <section className="ml-64 min-h-screen flex flex-col relative">
                    {/* Header di kanan, full width area konten */}
                    <div className="bg-[#EAD6A8] text-[#113939] top-0 w-full fixed toolbar-shadow">
                        <div className="flex items-center justify-between px-4 py-2">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/10"
                                >
                                    <span className="text-xl">&#x276E;</span>
                                </button>
                                <h1 className="font-semibold tracking-wide">
                                    {chapters.length > 0
                                        ? chapters[activeChapterIndex]
                                              ?.chapter_title || ""
                                        : "TINJAUAN PUSTAKA"}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Viewer utama (only this area scrolls) */}
                    <div
                        ref={readerRef}
                        className="w-full flex items-center justify-center mt-12"
                    >
                        <div className="bg-white w-full md:w-[70%] lg:w-[45%] xl:w-[40%] min-h-[80vh] pb-16">
                            {/* Konten chapter aktif */}
                            {showPdfViewer && pdfContent ? (
                                <div className="h-full">
                                    <PDFImageViewer
                                        pdfUrl={pdfContent.url}
                                        title={pdfContent.title}
                                        currentPage={currentPdfPage}
                                        totalPages={totalPdfPages}
                                        onPageChange={setCurrentPdfPage}
                                        onTotalPagesChange={setTotalPdfPages}
                                    />
                                </div>
                            ) : chapters.length > 0 ? (
                                <div className="p-4 prose max-w-none">
                                    <div
                                        className="prose-content"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                chapters[activeChapterIndex]
                                                    ?.content || "",
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="p-4">
                                    <img
                                        src={
                                            book?.cover ||
                                            "/images/Image-Cover Buku.svg"
                                        }
                                        alt="Halaman Buku"
                                        className="w-full h-full object-cover"
                                        onError={(e) =>
                                            (e.currentTarget.src =
                                                "/images/Image-Cover Buku.svg")
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Toolbar bawah di kanan, full width area konten */}
                    <div className="fixed bottom-0 left-64 right-0 bg-[#EAD6A8] toolbar-shadow">
                        <div className="flex items-center px-4 py-1">
                            {/* cluster kiri: Sebelumnya */}
                            <div className="flex-1 flex items-center">
                                <button
                                    onClick={goPrev}
                                    className="flex items-center space-x-2 px-3 py-0.5 rounded hover:bg-black/10 text-[#113939]"
                                >
                                    <img
                                        src="/images/Polygon 2.svg"
                                        alt="Prev"
                                        className="w-3 h-3 rotate-180"
                                    />
                                    <span>Sebelumnya</span>
                                </button>
                            </div>

                            {/* ikon tengah */}
                            <div className="flex items-center justify-center space-x-8">
                                <button
                                    className="w-10 h-10 flex items-center justify-center hover:scale-110 transition"
                                    title="Cari"
                                >
                                    <img
                                        src="/images/Buttton_Search_Field.svg"
                                        className="w-10 h-10"
                                        alt="Search"
                                    />
                                </button>
                                <button
                                    className="w-9 h-9 flex items-center justify-center hover:scale-110 transition"
                                    title="Catatan"
                                >
                                    <img
                                        src="/images/Icon Notes.svg"
                                        className="w-7 h-7"
                                        alt="Notes"
                                    />
                                </button>
                                <button
                                    className="w-9 h-9 flex items-center justify-center hover:scale-110 transition"
                                    title="Highlight"
                                >
                                    <img
                                        src="/images/Icon Highlight.svg"
                                        className="w-7 h-7"
                                        alt="Highlight"
                                    />
                                </button>
                            </div>

                            {/* cluster kanan */}
                            <div className="flex-1 flex items-center justify-end space-x-3 text-[#113939]">
                                <span className="text-sm font-semibold">
                                    {pageLabel}
                                </span>
                                <button
                                    onClick={goNext}
                                    className="flex items-center space-x-2 px-3 py-0.5 rounded hover:bg-black/10"
                                >
                                    <span>Selanjutnya</span>
                                    <img
                                        src="/images/Polygon 2.svg"
                                        alt="Next"
                                        className="w-3 h-3"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TinjauanPustaka;

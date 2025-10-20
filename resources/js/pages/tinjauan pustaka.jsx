import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PDFImageViewer = ({
    pdfUrl,
    title,
    onPageChange,
    currentPage,
    totalPages,
    onTotalPagesChange,
    pdfCache,
    onCacheUpdate,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                if (pdfCache.has(pdfUrl)) {
                    const cachedData = pdfCache.get(pdfUrl);
                    setImages(cachedData.images);
                    if (onTotalPagesChange) {
                        onTotalPagesChange(cachedData.totalPages);
                    }
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                setError(null);

                let attempts = 0;
                while (!window.pdfjsLib && attempts < 50) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    attempts++;
                }

                const pdfjsLib = window.pdfjsLib;
                if (!pdfjsLib) {
                    throw new Error("PDF.js library not loaded");
                }

                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;

                const pageImages = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });

                    const canvas = document.createElement("canvas");
                    canvas.setAttribute("willReadFrequently", "true");
                    const context = canvas.getContext("2d", {
                        willReadFrequently: true,
                        alpha: false,
                        desynchronized: true,
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

                const cacheData = {
                    images: pageImages,
                    totalPages: pdf.numPages,
                    timestamp: Date.now(),
                };
                const newCache = new Map(pdfCache);
                newCache.set(pdfUrl, cacheData);
                onCacheUpdate(newCache);

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
            <div className="h-full flex items-center justify-center bg-white">
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
    const [pdfChapters, setPdfChapters] = useState([]);
    const [activePdfIndex, setActivePdfIndex] = useState(0);
    const [expandedPdfIndex, setExpandedPdfIndex] = useState(null);
    const [pdfCache, setPdfCache] = useState(new Map());
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

    const activePdf = pdfChapters[activePdfIndex];
    const activePdfTotalPages = useMemo(() => {
        if (activePdf && pdfCache.has(activePdf.url)) {
            const c = pdfCache.get(activePdf.url);
            return c?.totalPages || 0;
        }
        return totalPdfPages;
    }, [activePdfIndex, pdfChapters, pdfCache, totalPdfPages]);

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
            } catch (_) {}
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

                    const allPdfChapters = (Array.isArray(data) ? data : [])
                        .filter(
                            (ch) =>
                                ch.content_type === "pdf" &&
                                (ch.pdf_url || ch.pdf_path)
                        )
                        .map((ch) => ({
                            id: ch.id,
                            title: ch.chapter_title,
                            url: ch.pdf_url || `/storage/${ch.pdf_path}`,
                            path: ch.pdf_path,
                        }));
                    setPdfChapters(allPdfChapters);

                    if (allPdfChapters.length > 0) {
                        setActivePdfIndex(0);
                        const first = allPdfChapters[0];
                        setPdfContent({
                            url: first.url,
                            title: first.title,
                            path: first.path,
                        });
                        setShowPdfViewer(true);
                        setExpandedPdfIndex(0);
                    }
                }
            } catch (_) {
                if (mounted) {
                    setChapters([]);
                    setActiveChapterIndex(0);
                    setPdfChapters([]);
                    setActivePdfIndex(0);
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
            setCurrentPdfPage((page) => {
                const total = activePdfTotalPages || totalPdfPages || page;
                if (!total || page >= total) return page;
                const next = page + 1;
                return next > total ? total : next;
            });
        } else {
            // Navigate chapters
            setActiveChapterIndex((idx) => Math.min(totalPages - 1, idx + 1));
        }
        if (readerRef.current) {
            readerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleChapterClick = (idx) => {
        setActiveChapterIndex(idx);
        setShowPdfViewer(false);
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
                <aside className="hidden md:block fixed top-0 left-0 bottom-0 w-64 bg-[#113939] text-white overflow-y-auto z-30">
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

                        {/* Daftar semua PDF sebagai dropdown */}
                        {pdfChapters.map((pdf, idx) => (
                            <div
                                key={pdf.id || idx}
                                className="border-b border-white/10"
                            >
                                <button
                                    onClick={() => {
                                        if (activePdfIndex === idx) {
                                            setExpandedPdfIndex((cur) =>
                                                cur === idx ? null : idx
                                            );
                                        } else {
                                            setActivePdfIndex(idx);
                                            setPdfContent({
                                                url: pdf.url,
                                                title: pdf.title,
                                                path: pdf.path,
                                            });
                                            setCurrentPdfPage(1);
                                            setTotalPdfPages(0);
                                            setShowPdfViewer(true);
                                            setExpandedPdfIndex(idx);
                                        }
                                    }}
                                    className={`w-full px-4 py-3 hover:bg-white/10 flex items-center justify-between text-left ${
                                        expandedPdfIndex === idx
                                            ? "bg-white/20"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <span>{pdf.title}</span>
                                    </div>
                                    <span
                                        className={`transform transition-transform ${
                                            expandedPdfIndex === idx
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    >
                                        ▼
                                    </span>
                                </button>
                                {expandedPdfIndex === idx && (
                                    <div className="bg-white/5">
                                        {Array.from(
                                            {
                                                length:
                                                    activePdfTotalPages || 0,
                                            },
                                            (_, i) => i + 1
                                        ).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                className={`w-full text-left px-6 py-2 hover:bg-white/10 border-b border-white/5 flex items-center ${
                                                    pageNum === currentPdfPage
                                                        ? "bg-white/10"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    setCurrentPdfPage(pageNum);
                                                    if (readerRef.current)
                                                        readerRef.current.scrollTo(
                                                            {
                                                                top: 0,
                                                                behavior:
                                                                    "smooth",
                                                            }
                                                        );
                                                }}
                                            >
                                                <span className="text-xs opacity-70 mr-2">
                                                    {String(pageNum).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>
                                                <span className="text-sm">
                                                    Halaman {pageNum}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {chapters.length === 0 && pdfChapters.length === 0 && (
                            <div className="px-4 py-3 text-white/80 border-b border-white/10">
                                Belum ada konten.
                            </div>
                        )}
                    </nav>
                </aside>

                <section className="md:ml-64 ml-0 min-h-screen flex flex-col relative">
                    <div className="bg-[#EAD6A8] text-[#113939] top-0 left-0 md:left-64 w-full fixed z-20 toolbar-shadow">
                        <div className="flex items-center justify-between px-4 py-2">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/10"
                                >
                                    <span className="text-xl">&#x276E;</span>
                                </button>
                                <h1 className="font-semibold tracking-wide text-sm sm:text-base md:text-lg">
                                    {showPdfViewer && pdfContent
                                        ? pdfContent.title || "PDF VIEWER"
                                        : chapters.length > 0
                                        ? chapters[activeChapterIndex]
                                              ?.chapter_title ||
                                          "TINJAUAN PUSTAKA"
                                        : "TINJAUAN PUSTAKA"}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={readerRef}
                        className="w-full flex items-center justify-center mt-12"
                    >
                        <div className="bg-white w-full min-h-[70vh] pb-16 md:pb-12 md:w-[70%] lg:w-[55%] xl:w-[45%] 2xl:w-[40%]">
                            {showPdfViewer && pdfContent ? (
                                <div className="h-full">
                                    <PDFImageViewer
                                        pdfUrl={pdfContent.url}
                                        title={pdfContent.title}
                                        currentPage={currentPdfPage}
                                        totalPages={totalPdfPages}
                                        onPageChange={setCurrentPdfPage}
                                        onTotalPagesChange={setTotalPdfPages}
                                        pdfCache={pdfCache}
                                        onCacheUpdate={setPdfCache}
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
                    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-[#EAD6A8] toolbar-shadow">
                        <div className="flex items-center px-2 sm:px-4 py-1">
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
                            <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                                <button
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:scale-110 transition"
                                    title="Cari"
                                >
                                    <img
                                        src="/images/Buttton_Search_Field.svg"
                                        className="w-9 h-9 sm:w-10 sm:h-10"
                                        alt="Search"
                                    />
                                </button>
                                <button
                                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:scale-110 transition"
                                    title="Catatan"
                                >
                                    <img
                                        src="/images/Icon Notes.svg"
                                        className="w-6 h-6 sm:w-7 sm:h-7"
                                        alt="Notes"
                                    />
                                </button>
                                <button
                                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:scale-110 transition"
                                    title="Highlight"
                                >
                                    <img
                                        src="/images/Icon Highlight.svg"
                                        className="w-6 h-6 sm:w-7 sm:h-7"
                                        alt="Highlight"
                                    />
                                </button>
                            </div>

                            {/* cluster kanan */}
                            <div className="flex-1 flex items-center justify-end space-x-3 text-[#113939]">
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

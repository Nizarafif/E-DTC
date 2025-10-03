import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TinjauanPustaka = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [book, setBook] = useState(null);
    const readerRef = useRef(null);

    const formatCode = (code) => {
        const base = (code || "KODE PRODUKSI").trim();
        return base.endsWith("/") ? base : `${base}/`;
    };
    const codeWithoutSlash = (code) => {
        const base = (code || "KODE PRODUKSI").trim();
        return base.replace(/\/+$/g, "");
    };

    const totalPages = book?.totalPages || 18;
    const pageLabel = useMemo(
        () => `${currentPage}/${totalPages}`,
        [currentPage, totalPages]
    );

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

    const goPrev = () => {
        setCurrentPage((p) => Math.max(1, p - 1));
        if (readerRef.current) {
            readerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goNext = () => {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
        if (readerRef.current) {
            readerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
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

                        <button className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/10">
                            01 PENGANTAR
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/10">
                            02 Mindszet & Kiat
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/10">
                            03 Daftar Isi
                        </button>

                        {/* Dropdown Bab 1 */}
                        <div className="border-b border-white/10">
                            <button
                                className="w-full text-left px-4 py-3 hover:bg-white/10 flex justify-between items-center"
                                onClick={() => setDropdownOpen((v) => !v)}
                            >
                                <span>04 Bab 1 • PENDAHULUAN</span>
                                <span
                                    className={`transition-transform ${
                                        dropdownOpen ? "rotate-180" : ""
                                    }`}
                                >
                                    ▼
                                </span>
                            </button>

                            {dropdownOpen && (
                                <div className="pl-8 pb-2">
                                    <button className="w-full text-left py-2 hover:bg-white/10 border-b border-gray-600">
                                        1.1 Latar Belakang
                                    </button>
                                    <button className="w-full text-left py-2 hover:bg-white/10 border-b border-gray-600">
                                        1.2 Tujuan
                                    </button>
                                    <button className="w-full text-left py-2 hover:bg-white/10 border-b border-gray-600">
                                        1.3 Manfaat
                                    </button>
                                </div>
                            )}
                        </div>
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
                                    TINJAUAN PUSTAKA
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Viewer utama (only this area scrolls) */}
                    <div
                        ref={readerRef}
                        className="w-full flex items-center justify-center mt-12"
                    >
                        <div className="bg-white w-full md:w-[70%] lg:w-[45%] xl:w-[40%]">
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
                            <div className="px-4 py-3 border-t border-gray-200">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold mr-1">
                                        {codeWithoutSlash(book?.code)}
                                    </span>
                                    • {book?.title || "Nama Buku"} •{" "}
                                    {book?.author || "Nama Penyusun"}
                                </p>
                            </div>
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

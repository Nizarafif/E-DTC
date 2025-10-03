import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const SidebarLink = ({ icon, label, active, as = "a" }) => {
    const className = `w-full flex items-center px-4 py-3 rounded-lg font-medium ${
        active
            ? "text-[#113939]"
            : [
                  "text-white",
                  "hover:text-[#113939]",
                  "hover:bg-gradient-to-br",
                  "hover:from-white",
                  "hover:via-[#F5E7C5]",
                  "hover:to-[#EBCF8A]",
                  "active:text-[#113939]",
                  "active:bg-gradient-to-br",
                  "active:from-white",
                  "active:via-[#F5E7C5]",
                  "active:to-[#EBCF8A]",
                  "focus:text-[#113939]",
                  "focus:bg-gradient-to-br",
                  "focus:from-white",
                  "focus:via-[#F5E7C5]",
                  "focus:to-[#EBCF8A]",
              ].join(" ")
    }`;
    const style = active
        ? {
              background:
                  "linear-gradient(135deg,#FFFFFF 0%,#F5E7C5 25%,#F0DBA7 50%,#EBCF8A 100%)",
          }
        : { background: "transparent" };
    const content = (
        <>
            <img
                src={icon}
                alt={label}
                className="w-5 h-5 mr-3 flex-shrink-0"
                style={active ? { filter: "brightness(0)" } : {}}
            />
            {label}
        </>
    );
    if (as === "div")
        return (
            <div className={className} style={style}>
                {content}
            </div>
        );
    return (
        <a href="#" className={className} style={style}>
            {content}
        </a>
    );
};

const Favorite = () => {
    const [favorites, setFavorites] = useState([]); // array of book ids
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);

    useEffect(() => {
        try {
            const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
            setFavorites(Array.isArray(fav) ? fav : []);
        } catch (_) {
            setFavorites([]);
        }

        const fetchBooks = async () => {
            try {
                setLoading(true);
                const res = await fetch("/books");
                if (res.ok) {
                    const data = await res.json();
                    setBooks(Array.isArray(data) ? data : []);
                } else {
                    setBooks([]);
                }
            } catch (_) {
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const favoritesBooks = useMemo(() => {
        if (!favorites || favorites.length === 0) return [];
        const idSet = new Set(favorites.map(String));
        return books.filter((b) => idSet.has(String(b.id)));
    }, [favorites, books]);
    const hasFavorites = favoritesBooks.length > 0;

    const removeFavorite = (id) => {
        try {
            const current = JSON.parse(
                localStorage.getItem("favorites") || "[]"
            );
            const next = current.filter((x) => x !== id);
            localStorage.setItem("favorites", JSON.stringify(next));
            setFavorites(next);
        } catch (_) {}
    };

    const openModal = (book) => {
        setCurrentBook(book);
        setModalOpen(true);
    };

    const formatCode = (code) => {
        const base = (code || "KODE PRODUKSI").trim();
        return base.endsWith("/") ? base : `${base}/`;
    };
    const codeWithoutSlash = (code) => {
        const base = (code || "KODE PRODUKSI").trim();
        return base.replace(/\/+$/g, "");
    };
    const getLanguageLabel = (lang) => {
        if (!lang) return "Bahasa Indonesia";
        const map = { id: "Bahasa Indonesia", en: "English" };
        return map[lang] || lang;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-[#113939] hidden lg:flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-500 flex-shrink-0">
                                <img
                                    src="/images/Profil.png"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-white">
                                <h3 className="font-bold text-lg">NAMA</h3>
                                <p className="text-white text-sm">
                                    email@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-6 mt-4">
                        <ul className="space-y-4">
                            <li>
                                <Link to="/">
                                    <SidebarLink
                                        icon="/images/Icon Home.svg"
                                        label="Home"
                                        as="div"
                                    />
                                </Link>
                            </li>
                            <li>
                                <SidebarLink
                                    icon="/images/heart 2.svg"
                                    label="Favorit"
                                    active
                                />
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Main content */}
                <div className="flex-1 bg-white w-full">
                    <div className="flex justify-between items-center p-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[#113939]">
                                Favorit Buku
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2 text-[#113939]">
                            <img
                                src="/images/logo.png"
                                alt="DTC Academy"
                                className="h-20"
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        {!hasFavorites && (
                            <div className="text-gray-600">
                                Belum ada buku favorit.
                            </div>
                        )}
                        {hasFavorites && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                                {favoritesBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        className="book-card bg-white rounded-lg p-3 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                                        style={{
                                            width: 190,
                                            height: 320,
                                            boxShadow:
                                                "0 0 20px rgba(0,0,0,0.15), 0 0 40px rgba(0,0,0,0.1)",
                                        }}
                                        onClick={() => openModal(book)}
                                    >
                                        <div className="relative mb-4 flex items-center justify-center">
                                            <img
                                                src={
                                                    book.cover ||
                                                    "/images/Image-Cover Buku.svg"
                                                }
                                                alt="Book Cover"
                                                className="object-cover rounded-lg"
                                                style={{
                                                    width: 170,
                                                    height: 250,
                                                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))",
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/images/Image-Cover Buku.svg";
                                                }}
                                            />
                                        </div>
                                        <div className="px-2 -mt-4 pb-4">
                                            <p
                                                className="text-base font-bold text-black"
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {formatCode(book.code)}
                                            </p>
                                            <div className="flex items-baseline justify-between">
                                                <p
                                                    className="text-base font-bold text-black"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow: "hidden",
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {book.title || "Nama Buku"}
                                                </p>
                                                <button
                                                    className="ml-2 -mt-1"
                                                    title="Hapus dari Favorit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFavorite(book.id);
                                                    }}
                                                >
                                                    <img
                                                        src="/images/red love.svg"
                                                        alt="Favorit"
                                                        className="w-5 h-5"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Overlay (same as Home) */}
            {modalOpen && currentBook && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={() => {
                        setModalOpen(false);
                        setCurrentBook(null);
                    }}
                >
                    <div
                        className="relative bg-white shadow-2xl"
                        style={{ width: 520, height: 520 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="flex items-center justify-center relative"
                            style={{
                                width: 520,
                                height: 42,
                                background: "#113939",
                            }}
                        >
                            <h3 className="text-white font-bold text-lg">
                                {codeWithoutSlash(currentBook?.code)}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="group absolute right-0 top-0 w-11 h-10 flex items-center justify-center transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
                                style={{ background: "#113939" }}
                            >
                                <img
                                    src="/images/out.svg"
                                    alt="Tutup"
                                    className="w-6 h-6 transition-transform group-hover:rotate-90"
                                />
                            </button>
                        </div>
                        <div
                            className="relative flex items-center"
                            style={{
                                width: 520,
                                height: 200,
                                background: "#E3CD98",
                            }}
                        >
                            <div
                                className="ml-8"
                                style={{ width: 133, height: 187 }}
                            >
                                <img
                                    src={
                                        currentBook?.cover ||
                                        "/images/Image-Cover Buku.svg"
                                    }
                                    alt="Book Cover"
                                    className="w-full h-full object-cover rounded-lg"
                                    style={{
                                        filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))",
                                    }}
                                    onError={(e) =>
                                        (e.currentTarget.src =
                                            "/images/Image-Cover Buku.svg")
                                    }
                                />
                            </div>
                            <div className="ml-6 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="ml-1">
                                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                                            {codeWithoutSlash(
                                                currentBook?.code
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {currentBook?.author ||
                                                "Tim Penyusun"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeWidth="2"
                                            d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                                        />
                                        <path
                                            strokeWidth="2"
                                            d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"
                                        />
                                    </svg>
                                    {getLanguageLabel(currentBook?.language)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {currentBook?.pages || 235}
                                </div>
                                <Link
                                    to={`/tinjauan-pustaka/${String(
                                        currentBook?.id || ""
                                    )}`}
                                    className="inline-flex items-center text-white font-semibold rounded px-6 py-1 w-auto"
                                    style={{ background: "#113939" }}
                                    onClick={() => {
                                        setModalOpen(false);
                                        setCurrentBook(null);
                                    }}
                                >
                                    Baca
                                </Link>
                            </div>
                        </div>
                        <div
                            className="flex p-4"
                            style={{
                                width: 520,
                                height: 278,
                                background: "white",
                            }}
                        >
                            <div className="w-1/3 pr-3">
                                <h5 className="text-sm font-bold text-gray-800 mb-2">
                                    Detail Buku
                                </h5>
                                <div className="space-y-0.5 text-xs text-gray-600">
                                    <p>
                                        Tanggal Terbit :{" "}
                                        {currentBook?.publish_date ||
                                            "2024-05-12"}
                                    </p>
                                    <p>Terakhir Diperbarui 2025-09-19</p>
                                    <p>Penerbit : [Nama Penerbit]</p>
                                    <p>
                                        Hak cipta :{" "}
                                        {currentBook?.author || "Nama Penulis"}
                                    </p>
                                    <p>
                                        ISBN :{" "}
                                        {currentBook?.isbn ||
                                            "978-xxx-xxxx-xxxx"}
                                    </p>
                                </div>
                            </div>
                            <div className="w-2/3 pl-3">
                                <h5 className="text-sm font-bold text-gray-800 mb-1">
                                    Ringkasan
                                </h5>
                                <p
                                    className="text-xs text-gray-600 leading-relaxed text-justify"
                                    style={{ color: "#113939" }}
                                >
                                    {currentBook?.description ||
                                        "Ringkasan isi buku akan ditampilkan di sini. Teks ini hanya contoh (dummy text) dan akan diganti setelah ringkasan resmi tersedia."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorite;

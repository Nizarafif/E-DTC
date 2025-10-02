import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const renderIcon = (name, className = "w-5 h-5") => {
    switch (name) {
        case "home":
            return (
                <svg
                    className={className}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10.5l9-7 9 7"
                    />
                    <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 10v9a2 2 0 002 2h10a2 2 0 002-2v-9"
                    />
                </svg>
            );
        case "favorite":
            return (
                <svg
                    className={className}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.995 21s-7.495-4.35-9.495-8.35c-1.36-2.72.64-6.15 3.74-6.15 1.85 0 3.13 1.07 3.93 2.23.8-1.16 2.08-2.23 3.93-2.23 3.1 0 5.1 3.43 3.74 6.15C19.49 16.65 11.995 21 11.995 21z"
                    />
                </svg>
            );
        case "logout":
            return (
                <svg
                    className={className}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                    />
                    <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 8v8a4 4 0 004 4h0a4 4 0 004-4V8a4 4 0 00-4-4h0a4 4 0 00-4 4z"
                    />
                </svg>
            );
        default:
            return null;
    }
};

const books = new Array(6).fill(null).map((_, i) => ({
    id: `book-${i + 1}`,
    title: "Nama Buku",
    code: "KODE PRODUKSI/",
    cover: "/images/Image-Cover Buku.svg",
}));

const SidebarLink = ({ icon, iconName, label, active, as = "a" }) => {
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
                  "linear-gradient(135deg, #FFFFFF 0%, #F5E7C5 25%, #F0DBA7 50%, #EBCF8A 100%)",
          }
        : { background: "transparent" };
    const content = (
        <>
            {iconName ? (
                <span className="mr-3">{renderIcon(iconName, "w-5 h-5")}</span>
            ) : (
                <img
                    src={icon}
                    alt={label}
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    style={active ? { filter: "brightness(0)" } : {}}
                />
            )}
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

const Home = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        try {
            const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
            setFavorites(Array.isArray(fav) ? fav : []);
        } catch (_) {
            setFavorites([]);
        }
    }, []);

    const openModal = (book) => {
        setCurrentBook(book);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
        setModalOpen(false);
        setCurrentBook(null);
        document.body.style.overflow = "auto";
    };

    const toggleFavorite = (bookId) => {
        setFavorites((prev) => {
            const exists = prev.includes(bookId);
            const next = exists
                ? prev.filter((id) => id !== bookId)
                : [...prev, bookId];
            localStorage.setItem("favorites", JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex min-h-screen">
                {/* Left Sidebar */}
                <div className="w-64 bg-[#113939] flex-col hidden lg:flex">
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
                                <SidebarLink
                                    icon="/images/Icon Home.svg"
                                    label="Home"
                                    active
                                />
                            </li>
                            <li>
                                <Link to="/favorite">
                                    <SidebarLink
                                        icon="/images/icon_suka.svg"
                                        label="Favorit"
                                        as="div"
                                    />
                                </Link>
                    </li>
                            <li>
                                <button
                                    onClick={() => {
                                        try {
                                            localStorage.removeItem(
                                                "auth_token"
                                            );
                                        } catch (_) {}
                                        window.location.reload();
                                    }}
                                    className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-white hover:text-[#113939] hover:bg-gradient-to-br hover:from-white hover:via-[#F5E7C5] hover:to-[#EBCF8A] transition-colors"
                                >
                                    <span className="mr-3">
                                        {renderIcon("logout")}
                                    </span>
                                    Keluar
                                </button>
                    </li>
                </ul>
            </nav>
        </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white w-full">
                    <div className="flex justify-between items-center p-6">
                <div>
                            <h1 className="text-2xl font-bold text-[#113939]">
                                Hai,
                            </h1>
                            <h2 className="text-2xl font-bold text-[#113939]">
                                DestinasiTerbaik
                            </h2>
                        </div>
                        <div>
                            <img
                                src="/images/logo.png"
                                alt="DTC Academy"
                                className="h-20"
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                            {books.map((book) => (
                                <button
                                    key={book.id}
                                    onClick={() => openModal(book)}
                                    className="book-card bg-white rounded-lg p-3 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                                    style={{
                                        width: 190,
                                        height: 320,
                                        boxShadow:
                                            "0 0 20px rgba(0,0,0,0.15), 0 0 40px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <div className="relative mb-4 flex items-center justify-center">
                                        <img
                                            src={book.cover}
                                            alt="Book Cover"
                                            className="object-cover rounded-lg"
                                            style={{
                                                width: 170,
                                                height: 250,
                                                filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))",
                                            }}
                                        />
                        </div>
                                    <div className="text-left -mt-4 ml-3">
                                        <p className="text-base font-bold text-black">
                                            {book.code}
                                        </p>
                                        <p className="text-base font-bold text-black">
                                            {book.title}
                                        </p>
                        </div>
                                </button>
                            ))}
                </div>
            </div>
        </div>
    </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={closeModal}
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
                                {(
                                    currentBook?.code || "KODE PRODUKSI/"
                                ).replace("/", "")}
                            </h3>
                            <button
                                onClick={closeModal}
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
                                />
                            </div>
                            <div className="ml-6 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="ml-1">
                                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                                            {(
                                                currentBook?.code ||
                                                "KODE PRODUKSI/"
                                            ).replace("/", "")}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            [Tim Penyusun]
                                        </p>
                                    </div>
                                    <button
                                        className="flex items-center justify-center w-8 h-8 mr-1"
                                        type="button"
                                        onClick={() =>
                                            toggleFavorite(currentBook?.id)
                                        }
                                        title={
                                            favorites.includes(currentBook?.id)
                                                ? "Hapus dari Favorit"
                                                : "Tambahkan ke Favorit"
                                        }
                                    >
                                        <img
                                            src="/images/red love.svg"
                                            alt="Favorit"
                                            className={`w-6 h-6 block object-contain ${
                                                favorites.includes(
                                                    currentBook?.id
                                                )
                                                    ? "filter-none"
                                                    : "grayscale"
                                            }`}
                                        />
                        </button>
                    </div>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        ></path>
                        </svg>
                        Bahasa Indonesia
                    </div>
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                        <path
                                            fillRule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clipRule="evenodd"
                                        ></path>
                        </svg>
                        235
                    </div>
                                <Link
                                    to={`/tinjauan-pustaka/${
                                        currentBook?.id || ""
                                    }`}
                                    className="inline-flex items-center text-white font-semibold rounded px-6 py-1 w-auto"
                                    style={{ background: "#113939" }}
                                    onClick={() => {
                                        setModalOpen(false);
                                        document.body.style.overflow = "auto";
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
                        <p>Tanggal Terbit : 2024-05-12</p>
                        <p>Terakhir Diperbarui 2025-09-19</p>
                        <p>Penerbit : [Nama Penerbit]</p>
                        <p>Hak cipta : [Nama Penulis]</p>
                        <p>ISBN : 978-xxx-xxxx-xxxx</p>
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
                                    Ringkasan isi buku akan ditampilkan di sini.
                                    Bagian ini berisi gambaran singkat mengenai
                                    isi buku, tujuan penulisan, serta
                                    pokok-pokok utama yang dibahas. Teks ini
                                    hanya contoh (dummy text) dan akan diganti
                                    setelah ringkasan resmi tersedia.
                    </p>
                </div>
            </div>
        </div>
    </div>
            )}
        </div>
    );
};

export default Home;

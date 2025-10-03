import React, { useState } from "react";
import { motion } from "framer-motion";

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const { email, password } = formData;
            // Simple hardcoded credential check
            if (email === "admin@gmail.com" && password === "admin123") {
                setIsLoading(false);
                onLogin({ role: "admin", email });
                return;
            }
            if (email === "user@gmail.com" && password === "user123") {
                setIsLoading(false);
                onLogin({ role: "user", email });
                return;
            }
            setIsLoading(false);
            alert(
                "Email atau password salah. Coba: user@gmail.com / user123 atau admin@gmail.com / admin123"
            );
        }, 700);
    };

    return (
        <div className="min-h-screen bg-[#E3CD98] flex flex-col lg:flex-row">
            {/* Left Panel */}
            <motion.div
                className="relative lg:w-2/5 flex items-center justify-center px-6 sm:px-8 py-16 sm:py-20 lg:py-0 min-h-[50vh] lg:min-h-screen overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Background Image from public/images */}
                <div className="absolute inset-0">
                    <img
                        src="/images/bg_rect.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                    {/* Removed green overlay */}
            </div>
            
                {/* Content */}
                <div className="relative z-10 text-center text-white">
                    <motion.h1
                        className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Halo, Selamat Datang di
                        <br />
                    Perpustakaan DTC
                    </motion.h1>
                    <motion.p
                        className="text-sm lg:text-base opacity-90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    ></motion.p>
            </div>
            </motion.div>

            {/* Right Panel */}
            <motion.div
                className="relative lg:w-3/5 bg-[#E3CD98] flex items-center justify-center px-6 sm:px-8 py-12 lg:py-0 min-h-[50vh] lg:min-h-screen"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="w-full max-w-sm relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <motion.h2
                        className="text-2xl lg:text-3xl font-bold text-black text-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                    Masuk
                    </motion.h2>

                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-3 sm:space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <motion.div
                            className="relative"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                    <path strokeWidth="2" d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
                                </svg>
                            </span>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email" 
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 px-3 py-2 sm:py-3 pr-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D5A5A] focus:border-transparent text-gray-700 placeholder-gray-500 text-sm transition-all duration-200"
                            />
                        </motion.div>

                        <motion.div
                            className="relative"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path strokeWidth="2" d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                                    <path strokeWidth="2" d="M22 6l-10 7L2 6" />
                                </svg>
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Sandi" 
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 px-3 py-2 sm:py-3 pr-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D5A5A] focus:border-transparent text-gray-700 placeholder-gray-500 text-sm transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                                title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                        <path strokeWidth="2" d="M3 3l18 18" />
                                        <path strokeWidth="2" d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-3.42M21 12s-3.8-7-9-7c-1.38 0-2.66.38-3.8 1.02M3 12s3.8 7 9 7c1.86 0 3.58-.74 5-1.9" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                        <path strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                        <circle cx="12" cy="12" r="3" strokeWidth="2" />
                                    </svg>
                                )}
                            </button>
                        </motion.div>

                        <div className="text-center">
                            <a
                                href="#"
                                className="text-sm text-black hover:underline transition-colors"
                            >
                            Lupa Sandi ?
                        </a>
                    </div>

                        <motion.button
                        type="submit" 
                            disabled={isLoading}
                            className="w-full bg-[#2D5A5A] text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                </svg>
                                    Memproses...
                        </div>
                            ) : (
                                "Masuk"
                            )}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;

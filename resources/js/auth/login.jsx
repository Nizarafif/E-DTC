import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, User } from "lucide-react";

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

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                onLogin({
                    role: data.user.role,
                    email: data.user.email,
                    name: data.user.name,
                    id: data.user.id,
                });
            } else {
                setIsLoading(false);
                alert(
                    data.message ||
                        "Login gagal. Periksa email dan password Anda."
                );
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Login error:", error);
            alert(
                "Terjadi kesalahan saat login. Pastikan backend Laravel berjalan."
            );
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-[#E3CD98]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Main Container */}
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left Panel - Dark Teal Background */}
                <div className="relative lg:w-2/5 flex items-center justify-center px-6 sm:px-8 py-16 sm:py-20 lg:py-0 min-h-[50vh] lg:min-h-screen">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/bg_rect.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center text-white">
                        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 leading-tight">
                            Halo, Selamat Datang di
                            <br />
                            Perpustakaan DTC
                        </h1>
                        <p className="text-sm lg:text-base opacity-90">
                            Belum punya akun?{" "}
                            <span className="underline cursor-pointer hover:opacity-80">
                                Daftar
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right Panel - Light Beige Background */}
                <div className="relative lg:w-3/5 bg-[#E3CD98] flex items-center justify-center px-6 sm:px-8 py-12 lg:py-0 min-h-[50vh] lg:min-h-screen">
                    {/* Curved Shape for Mobile */}
                    <div className="lg:hidden absolute top-0 left-0 w-full h-20 bg-[#E3CD98] rounded-br-full"></div>

                    {/* Login Form Container */}
                    <div className="w-full max-w-sm relative z-10">
                        {/* Login Title */}
                        <div className="text-center mb-6">
                            <img
                                src="/images/logo.png"
                                alt="DTC Logo"
                                className="h-12 lg:h-16 mx-auto object-contain"
                            />
                        </div>

                        {/* Login Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-3 sm:space-y-4"
                        >
                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Mail className="w-4 h-4 text-black" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-3 py-2 sm:py-3 bg-white rounded-lg border-2 border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A5A] focus:border-[#2D5A5A] focus:shadow-xl text-gray-700 placeholder-gray-500 text-sm transition-all duration-200"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <User className="w-4 h-4 text-black" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Sandi"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-10 py-2 sm:py-3 bg-white rounded-lg border-2 border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A5A] focus:border-[#2D5A5A] focus:shadow-xl text-gray-700 placeholder-gray-500 text-sm transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-center">
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-[#2D5A5A] hover:underline font-medium transition-all duration-200 hover:scale-105"
                                >
                                    Lupa Sandi?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#2D5A5A] text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? "Memproses..." : "Masuk"}
                            </button>

                            {/* Social Media Login */}
                            <div className="text-center mt-6">
                                <p className="text-xs text-black mb-4">
                                    Masuk dengan Sosial Media
                                </p>

                                {/* Social Media Buttons */}
                                <div className="flex justify-center space-x-2 sm:space-x-3">
                                    {/* Google Button */}
                                    <button
                                        type="button"
                                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-300 flex items-center justify-center hover:shadow-md transition-shadow duration-200"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                    </button>

                                    {/* Apple Button */}
                                    <button
                                        type="button"
                                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-300 flex items-center justify-center hover:shadow-md transition-shadow duration-200"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                    </button>

                                    {/* Windows Button */}
                                    <button
                                        type="button"
                                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-300 flex items-center justify-center hover:shadow-md transition-shadow duration-200"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91v-6.75l10 .15z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;

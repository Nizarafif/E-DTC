import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "../css/app.css";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./auth/login";
import Home from "./pages/home";
import Favorite from "./pages/favorite";
import TinjauanPustaka from "./pages/tinjauan pustaka";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    },
    fonts: {
        heading:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
        body: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === "dark" ? "gray.900" : "white",
                color: props.colorMode === "dark" ? "white" : "gray.800",
            },
        }),
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authInfo, setAuthInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            try {
                const parsed = JSON.parse(token);
                if (parsed && parsed.role) {
                    setAuthInfo(parsed);
                    setIsAuthenticated(true);
                }
            } catch (_) {
                setIsAuthenticated(true);
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (payload) => {
        localStorage.setItem("auth_token", JSON.stringify(payload));
        setAuthInfo(payload);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        setAuthInfo(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={<Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="*"
                            element={<Navigate to="/login" replace />}
                        />
                    </Routes>
                </BrowserRouter>
            </ChakraProvider>
        );
    }

    if (authInfo?.role === "user") {
        return (
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/favorite" element={<Favorite />} />
                        <Route
                            path="/tinjauan-pustaka/:id"
                            element={<TinjauanPustaka />}
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ChakraProvider>
        );
    }

    // Admin can access both user pages and admin dashboard
    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    {/* Admin Dashboard */}
                    <Route
                        path="/admin"
                        element={<AdminDashboard onLogout={handleLogout} />}
                    />
                    {/* User-facing pages accessible to admin for monitoring */}
                    <Route path="/" element={<Home />} />
                    <Route path="/favorite" element={<Favorite />} />
                    <Route
                        path="/tinjauan-pustaka/:id"
                        element={<TinjauanPustaka />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/admin" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);

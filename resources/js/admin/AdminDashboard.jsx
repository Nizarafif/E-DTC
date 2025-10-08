import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    useColorModeValue,
    HStack,
    VStack,
    Text,
    Button,
} from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import DashboardOverview from "./components/DashboardOverview";
import ErrorBoundary from "./components/ErrorBoundary";
import { BooksPage } from "./pages/books";
// import { CategoriesPage } from "./pages/categories"; // Disabled
import BookContentPage from "./pages/books/BookContentPage";
import BookContentsPage from "./pages/books/BookContentsPage";

const AdminDashboard = ({ onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("dashboard");

    const sidebarWidth = isCollapsed ? 80 : 240;
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBgColor = useColorModeValue("white", "gray.800");
    const cardBorderColor = useColorModeValue("gray.100", "gray.700");

    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleItemClick = (itemId) => {
        setActiveItem(itemId);
    };

    const getBreadcrumbs = () => {
        const breadcrumbMap = {
            dashboard: [{ label: "Dashboard", href: "#" }],
            books: [
                { label: "Dashboard", href: "#" },
                { label: "Kelola Buku", href: "#" },
            ],
            "books-add": [
                { label: "Dashboard", href: "#" },
                { label: "Kelola Buku", href: "#" },
                { label: "Tambah Buku", href: "#" },
            ],
            "books-content": [
                { label: "Dashboard", href: "#" },
                { label: "Kelola Buku", href: "#" },
                { label: "Tambah Isi Buku", href: "#" },
            ],
            "books-contents": [
                { label: "Dashboard", href: "#" },
                { label: "Kelola Buku", href: "#" },
                { label: "Kelola Isi Buku", href: "#" },
            ],
            // categories: [
            //     { label: "Dashboard", href: "#" },
            //     { label: "Kategori", href: "#" },
            // ], // Disabled
            users: [
                { label: "Dashboard", href: "#" },
                { label: "Pengguna", href: "#" },
            ],
            analytics: [
                { label: "Dashboard", href: "#" },
                { label: "Analitik", href: "#" },
            ],
            library: [
                { label: "Dashboard", href: "#" },
                { label: "Perpustakaan", href: "#" },
            ],
            settings: [
                { label: "Dashboard", href: "#" },
                { label: "Pengaturan", href: "#" },
            ],
        };
        return breadcrumbMap[activeItem] || [];
    };

    const getTitle = () => {
        const titleMap = {
            dashboard: "Dashboard",
            books: "Kelola Buku",
            "books-add": "Tambah Buku",
            "books-content": "Tambah Isi Buku",
            "books-contents": "Kelola Isi Buku",
            // categories: "Kategori", // Disabled
            users: "Pengguna",
            analytics: "Analitik",
            library: "Perpustakaan",
            settings: "Pengaturan",
        };
        return titleMap[activeItem] || "Dashboard";
    };

    const renderContent = () => {
        switch (activeItem) {
            case "dashboard":
                return <DashboardOverview />;
            case "books":
                return <BooksPage />;
            case "books-add":
                return <BooksPage showAddModal={true} />;
            case "books-content":
                return <BookContentPage />;
            case "books-contents":
                return <BookContentsPage />;
            // case "categories":
            //     return <CategoriesPage />; // Disabled
            case "users":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Box
                            bg={cardBgColor}
                            p={8}
                            borderRadius="2xl"
                            border="1px"
                            borderColor={cardBorderColor}
                            textAlign="center"
                            minH="400px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            >
                                <Box fontSize="6xl" mb={4}>
                                    👥
                                </Box>
                                <Box
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color="teal.600"
                                    mb={2}
                                >
                                    Pengguna
                                </Box>
                                <Box color="gray.500">
                                    Fitur kelola pengguna akan segera hadir
                                </Box>
                            </motion.div>
                        </Box>
                    </motion.div>
                );
            case "analytics":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Box
                            bg={cardBgColor}
                            p={8}
                            borderRadius="2xl"
                            border="1px"
                            borderColor={cardBorderColor}
                            textAlign="center"
                            minH="400px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            >
                                <Box fontSize="6xl" mb={4}>
                                    📊
                                </Box>
                                <Box
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color="teal.600"
                                    mb={2}
                                >
                                    Analitik
                                </Box>
                                <Box color="gray.500">
                                    Fitur analitik akan segera hadir
                                </Box>
                            </motion.div>
                        </Box>
                    </motion.div>
                );
            case "library":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Box
                            bg={cardBgColor}
                            p={8}
                            borderRadius="2xl"
                            border="1px"
                            borderColor={cardBorderColor}
                            textAlign="center"
                            minH="400px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            >
                                <Box fontSize="6xl" mb={4}>
                                    🏛️
                                </Box>
                                <Box
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color="teal.600"
                                    mb={2}
                                >
                                    Perpustakaan
                                </Box>
                                <Box color="gray.500">
                                    Fitur perpustakaan akan segera hadir
                                </Box>
                            </motion.div>
                        </Box>
                    </motion.div>
                );
            case "settings":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Box
                            bg={cardBgColor}
                            p={8}
                            borderRadius="2xl"
                            border="1px"
                            borderColor={cardBorderColor}
                            textAlign="center"
                            minH="400px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            >
                                <Box fontSize="6xl" mb={4}>
                                    ⚙️
                                </Box>
                                <Box
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color="teal.600"
                                    mb={2}
                                >
                                    Pengaturan
                                </Box>
                                <Box color="gray.500">
                                    Fitur pengaturan akan segera hadir
                                </Box>
                            </motion.div>
                        </Box>
                    </motion.div>
                );
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <ErrorBoundary>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box minH="100vh" bg={bgColor} position="relative">
                    {/* Sidebar */}
                    <Sidebar
                        isCollapsed={isCollapsed}
                        onToggle={handleToggleSidebar}
                        onLogout={onLogout}
                        activeItem={activeItem}
                        onItemClick={handleItemClick}
                    />

                    {/* Header */}
                    <Header
                        title={getTitle()}
                        breadcrumbs={getBreadcrumbs()}
                        onLogout={onLogout}
                        sidebarWidth={sidebarWidth}
                    />

                    {/* Main Content */}
                    <MainContent
                        sidebarWidth={sidebarWidth}
                        activeItem={activeItem}
                    >
                        {renderContent()}
                    </MainContent>

                    {/* Background Elements */}
                    <Box
                        position="fixed"
                        top="50%"
                        right="10%"
                        w="300px"
                        h="300px"
                        bg={useColorModeValue("teal.50", "teal.900")}
                        borderRadius="full"
                        opacity={useColorModeValue(0.03, 0.02)}
                        transform="translate(50%, -50%)"
                        pointerEvents="none"
                        zIndex={0}
                    />
                    <Box
                        position="fixed"
                        bottom="10%"
                        left="20%"
                        w="200px"
                        h="200px"
                        bg={useColorModeValue("blue.50", "blue.900")}
                        borderRadius="full"
                        opacity={useColorModeValue(0.03, 0.02)}
                        pointerEvents="none"
                        zIndex={0}
                    />
                </Box>
            </motion.div>
        </ErrorBoundary>
    );
};

export default AdminDashboard;

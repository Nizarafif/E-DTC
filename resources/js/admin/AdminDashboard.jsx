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
import BookContentPage from "./pages/books/BookContentPage";
import BookContentsPage from "./pages/books/BookContentsPage";
import UsersPage from "./pages/users/UsersPage";
import { AnalyticsPage } from "./pages/analytics";
import { SettingsPage } from "./pages/settings";

const AdminDashboard = ({ onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("dashboard");

    const handleDashboardNavigation = (itemId) => {
        setActiveItem(itemId);
    };

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
            users: [
                { label: "Dashboard", href: "#" },
                { label: "Pengguna", href: "#" },
            ],
            analytics: [
                { label: "Dashboard", href: "#" },
                { label: "Analitik", href: "#" },
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
            users: "Pengguna",
            analytics: "Analitik",
            settings: "Pengaturan",
        };
        return titleMap[activeItem] || "Dashboard";
    };

    const renderContent = () => {
        switch (activeItem) {
            case "dashboard":
                return (
                    <DashboardOverview onNavigate={handleDashboardNavigation} />
                );
            case "books":
                return <BooksPage />;
            case "books-add":
                return <BooksPage showAddModal={true} />;
            case "books-content":
                return <BookContentPage />;
            case "books-contents":
                return <BookContentsPage />;
            case "users":
                return <UsersPage />;
            case "analytics":
                return <AnalyticsPage />;
            case "settings":
                return <SettingsPage />;
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

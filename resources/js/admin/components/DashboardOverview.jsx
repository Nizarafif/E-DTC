import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    useToast,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Card,
    CardBody,
    CardHeader,
    IconButton,
    Badge,
    Progress,
    Divider,
    Flex,
    Spacer,
    Avatar,
    AvatarGroup,
    Tooltip,
    Link,
    Image,
} from "@chakra-ui/react";
import {
    BookOpen,
    FileText,
    Users,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Plus,
    Eye,
    Edit3,
    Trash2,
    Calendar,
    Clock,
    Activity,
    BarChart3,
    PieChart,
    Download,
    Star,
    Heart,
} from "lucide-react";
import RealtimeStats from "./RealtimeStats";
import RecentActivity from "./RecentActivity";

const DashboardOverview = ({ onNavigate }) => {
    const [dashboardData, setDashboardData] = useState({
        books: [],
        bookContents: [],
        users: [],
        stats: {
            totalBooks: 0,
            totalContents: 0,
            totalUsers: 0,
            editorContents: 0,
            pdfContents: 0,
            recentBooks: [],
            recentContents: [],
            popularBooks: [],
        },
    });
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const cardBg = useColorModeValue("gray.50", "gray.700");
    const toast = useToast();

    // Load data awal
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Helper function to safely parse JSON
    const safeJsonParse = async (response) => {
        if (!response.ok) {
            console.warn(
                "API request failed:",
                response.status,
                response.statusText
            );
            return [];
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.warn("Response is not JSON:", contentType);
            return [];
        }
        try {
            return await response.json();
        } catch (error) {
            console.warn("JSON parse error:", error);
            return [];
        }
    };

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);

            // Fetch semua data secara parallel dengan error handling
            const [booksResponse, contentsResponse, usersResponse] =
                await Promise.allSettled([
                    fetch("/books", {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }).catch(() => ({ ok: false })),
                    fetch("/book-contents", {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }).catch(() => ({ ok: false })),
                    fetch("/users", {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }).catch(() => ({ ok: false })),
                ]);

            const books =
                booksResponse.status === "fulfilled"
                    ? await safeJsonParse(booksResponse.value)
                    : [];
            const bookContents =
                contentsResponse.status === "fulfilled"
                    ? await safeJsonParse(contentsResponse.value)
                    : [];
            const users =
                usersResponse.status === "fulfilled"
                    ? await safeJsonParse(usersResponse.value)
                    : [];

            console.log("Dashboard data fetched:", {
                books: books.length,
                contents: bookContents.length,
                users: users.length,
            });

            // Calculate statistics dengan data yang lebih detail
            const stats = {
                totalBooks: books.length,
                totalContents: bookContents.length,
                totalUsers: users.length,
                editorContents: bookContents.filter(
                    (content) => content.content_type === "editor"
                ).length,
                pdfContents: bookContents.filter(
                    (content) => content.content_type === "pdf"
                ).length,
                recentBooks: books
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                    )
                    .slice(0, 5),
                recentContents: bookContents
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                    )
                    .slice(0, 5),
                popularBooks: books
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5),
                // Statistik tambahan
                totalPages: bookContents.reduce((sum, content) => {
                    if (content.content_type === "pdf") return sum + 1; // PDF = 1 halaman
                    return (
                        sum +
                        (content.content
                            ? content.content.split("</p>").length
                            : 0)
                    ); // Estimasi halaman dari HTML
                }, 0),
                avgContentPerBook:
                    books.length > 0
                        ? Math.round(
                              (bookContents.length / books.length) * 10
                          ) / 10
                        : 0,
                contentTypeDistribution: {
                    editor: bookContents.filter(
                        (c) => c.content_type === "editor"
                    ).length,
                    pdf: bookContents.filter((c) => c.content_type === "pdf")
                        .length,
                },
            };

            setDashboardData({
                books,
                bookContents,
                users,
                stats,
            });

            setLastUpdated(new Date());

            // Show success message only if we got some data
            if (books.length > 0 || bookContents.length > 0) {
                toast({
                    title: "Data Diperbarui",
                    description: "Dashboard berhasil di-refresh",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);

            // Set fallback data instead of showing error
            setDashboardData({
                books: [],
                bookContents: [],
                users: [],
                stats: {
                    totalBooks: 0,
                    totalContents: 0,
                    totalUsers: 0,
                    editorContents: 0,
                    pdfContents: 0,
                    recentBooks: [],
                    recentContents: [],
                    popularBooks: [],
                    totalPages: 0,
                    avgContentPerBook: 0,
                    contentTypeDistribution: { editor: 0, pdf: 0 },
                },
            });

            toast({
                title: "Backend API Tidak Tersedia",
                description:
                    "Dashboard menggunakan data offline. Pastikan Laravel backend berjalan dan API routes tersedia di /books, /book-contents, /users",
                status: "warning",
                duration: 6000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualRefresh = () => {
        fetchDashboardData();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "-";
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
        return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    };

    const getBookTitle = (bookId) => {
        const book = dashboardData.books.find((b) => b.id === bookId);
        return book ? book.title : "Buku Tidak Ditemukan";
    };

    const getContentTypeIcon = (contentType) => {
        return contentType === "pdf" ? (
            <Download size={14} />
        ) : (
            <FileText size={14} />
        );
    };

    const getContentTypeColor = (contentType) => {
        return contentType === "pdf" ? "red" : "blue";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <VStack spacing={6} align="stretch">
                {/* Header Section */}
                <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="2xl"
                    border="1px"
                    borderColor={borderColor}
                    shadow="sm"
                >
                    <Flex align="center" justify="space-between">
                        <HStack spacing={4}>
                            <Box
                                p={3}
                                bg="blue.100"
                                borderRadius="xl"
                                color="blue.600"
                            >
                                <BarChart3 size={24} />
                            </Box>
                            <VStack align="start" spacing={1}>
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    Dashboard Overview
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Statistik real-time sistem E-DTC
                                </Text>
                            </VStack>
                        </HStack>

                        <HStack spacing={3}>
                            <Button
                                leftIcon={<RefreshCw size={16} />}
                                variant="outline"
                                onClick={handleManualRefresh}
                                isLoading={isLoading}
                            >
                                Refresh
                            </Button>
                        </HStack>
                    </Flex>

                    <HStack spacing={4} mt={4} fontSize="sm" color="gray.500">
                        <HStack spacing={1}>
                            <Clock size={14} />
                            <Text>
                                Terakhir update: {formatTimeAgo(lastUpdated)}
                            </Text>
                        </HStack>
                    </HStack>
                </Box>

                {/* Realtime Stats */}
                <RealtimeStats
                    data={dashboardData}
                    isLoading={isLoading}
                    onRefresh={fetchDashboardData}
                />

                {/* Recent Activity */}
                <RecentActivity data={dashboardData} onNavigate={onNavigate} />

                {/* No Data Message */}
                {!isLoading &&
                    dashboardData.stats.totalBooks === 0 &&
                    dashboardData.stats.totalContents === 0 && (
                        <Box
                            bg={bgColor}
                            p={8}
                            borderRadius="2xl"
                            border="1px"
                            borderColor={borderColor}
                            shadow="sm"
                            textAlign="center"
                        >
                            <VStack spacing={4}>
                                <Box
                                    p={4}
                                    bg="blue.100"
                                    borderRadius="full"
                                    color="blue.600"
                                >
                                    <BookOpen size={32} />
                                </Box>
                                <VStack spacing={2}>
                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                        color={textColor}
                                    >
                                        Belum Ada Data
                                    </Text>
                                    <Text color="gray.500" maxW="500px">
                                        Dashboard akan menampilkan data setelah
                                        Anda menambahkan buku dan konten
                                        pertama. Pastikan Laravel backend
                                        berjalan dan API routes tersedia di
                                        /api/books, /api/book-contents,
                                        /api/users
                                    </Text>
                                </VStack>
                                <HStack spacing={3}>
                                    <Button
                                        colorScheme="blue"
                                        onClick={() =>
                                            onNavigate &&
                                            onNavigate("books-add")
                                        }
                                    >
                                        Tambah Buku Pertama
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={fetchDashboardData}
                                    >
                                        Refresh Data
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>
                    )}

                {/* Quick Actions */}
                <Card bg={bgColor} border="1px" borderColor={borderColor}>
                    <CardHeader>
                        <HStack spacing={3}>
                            <Box
                                p={2}
                                bg="green.100"
                                borderRadius="lg"
                                color="green.600"
                            >
                                <Plus size={16} />
                            </Box>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Quick Actions
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                            <Button
                                leftIcon={<Plus size={16} />}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() =>
                                    onNavigate && onNavigate("books-add")
                                }
                                _hover={{ transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                Tambah Buku Baru
                            </Button>
                            <Button
                                leftIcon={<FileText size={16} />}
                                colorScheme="purple"
                                variant="outline"
                                onClick={() =>
                                    onNavigate && onNavigate("books-content")
                                }
                                _hover={{ transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                Tambah Konten
                            </Button>
                            <Button
                                leftIcon={<Edit3 size={16} />}
                                colorScheme="orange"
                                variant="outline"
                                onClick={() =>
                                    onNavigate && onNavigate("books-contents")
                                }
                                _hover={{ transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                Kelola Konten
                            </Button>
                        </SimpleGrid>
                    </CardBody>
                </Card>
            </VStack>
        </motion.div>
    );
};

export default DashboardOverview;

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
    Card,
    CardBody,
    Flex,
    Spinner,
    Center,
    Progress,
    Badge,
    Avatar,
    Select,
} from "@chakra-ui/react";
import {
    Users,
    BookOpen,
    FileText,
    Eye,
    TrendingUp,
    Activity,
    RefreshCw,
} from "lucide-react";

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState({
        overview: {
            totalUsers: 0,
            totalBooks: 0,
            totalContent: 0,
            totalViews: 0,
            activeUsers: 0,
            newUsers: 0,
        },
        trends: {
            userGrowth: [],
            contentGrowth: [],
            viewGrowth: [],
        },
        topContent: [],
        userActivity: [],
        contentStats: {
            byType: {},
            byBook: {},
        },
    });
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [timeRange, setTimeRange] = useState("7d");

    const toast = useToast();

    // Auto-refresh data
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchAnalytics();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, timeRange]);

    // Initial load
    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);

            // Fetch analytics data from the new endpoint
            const response = await fetch(`/analytics?range=${timeRange}`);

            if (!response.ok) {
                throw new Error("Failed to fetch analytics data");
            }

            const data = await response.json();

            // Use data from the analytics API
            setAnalytics({
                overview: {
                    totalUsers: data.overview.total_users,
                    totalBooks: data.overview.total_books,
                    totalContent: data.overview.total_content,
                    totalViews: data.overview.total_views,
                    activeUsers: data.overview.active_users,
                    newUsers: data.overview.new_users,
                },
                trends: {
                    userGrowth: data.trends.user_growth,
                    contentGrowth: data.trends.content_growth,
                    viewGrowth: data.trends.book_growth, // Using book growth as view growth
                },
                topContent: data.recent_activity.slice(0, 5).map((item) => ({
                    id: item.id,
                    title: item.title,
                    type: item.content_type,
                    book: item.book,
                    views: Math.floor(Math.random() * 100),
                    created_at: item.created_at,
                })),
                userActivity: data.user_activity.slice(0, 10).map((user) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    lastActive: user.last_active,
                    activity: user.activity_score,
                    status: user.status,
                })),
                contentStats: {
                    byType: data.content_stats.by_type,
                    byBook: data.content_stats.by_book.reduce((acc, item) => {
                        acc[item.book_title] = item.count;
                        return acc;
                    }, {}),
                },
            });

            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error fetching analytics:", error);
            toast({
                title: "Error",
                description: "Gagal memuat data analitik",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatTimeAgo = (dateString) => {
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

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "green";
            case "inactive":
                return "gray";
            default:
                return "blue";
        }
    };

    const getContentTypeColor = (type) => {
        switch (type) {
            case "pdf":
                return "red";
            case "editor":
                return "blue";
            default:
                return "gray";
        }
    };

    const StatCard = ({ title, value, icon, color = "blue" }) => (
        <Card
            bg="white"
            shadow="sm"
            borderRadius="lg"
            border="1px"
            borderColor="gray.100"
        >
            <CardBody p={6}>
                <Flex align="center" justify="space-between">
                    <VStack align="start" spacing={2}>
                        <Text fontSize="sm" color="gray.600" fontWeight="500">
                            {title}
                        </Text>
                        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                            {formatNumber(value)}
                        </Text>
                    </VStack>
                    <Box
                        p={3}
                        bg={`${color}.50`}
                        borderRadius="full"
                        color={`${color}.600`}
                    >
                        {icon}
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );

    const SimpleChart = ({ title, data, color = "blue" }) => (
        <Card
            bg="white"
            shadow="sm"
            borderRadius="lg"
            border="1px"
            borderColor="gray.100"
        >
            <CardBody p={6}>
                <Text fontSize="lg" fontWeight="600" color="gray.800" mb={4}>
                    {title}
                </Text>
                <VStack spacing={3} align="stretch">
                    {data.slice(0, 5).map((item, index) => (
                        <Box key={index}>
                            <HStack justify="space-between" mb={1}>
                                <Text fontSize="sm" color="gray.600">
                                    {formatDate(item.date)}
                                </Text>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="gray.800"
                                >
                                    {formatNumber(item.value)}
                                </Text>
                            </HStack>
                            <Progress
                                value={
                                    (item.value /
                                        Math.max(...data.map((d) => d.value))) *
                                    100
                                }
                                colorScheme={color}
                                size="sm"
                                borderRadius="full"
                                bg="gray.100"
                            />
                        </Box>
                    ))}
                </VStack>
            </CardBody>
        </Card>
    );

    return (
        <Box bg="gray.50" minH="100vh" p={6}>
            <VStack spacing={8} align="stretch" maxW="1200px" mx="auto">
                {/* Header */}
                <Flex justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            Analitik
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Statistik sistem dan performa
                        </Text>
                    </VStack>

                    <HStack spacing={3}>
                        <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            size="sm"
                            w="120px"
                            bg="white"
                        >
                            <option value="24h">24 Jam</option>
                            <option value="7d">7 Hari</option>
                            <option value="30d">30 Hari</option>
                        </Select>

                        <Button
                            size="sm"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={fetchAnalytics}
                            isLoading={isLoading}
                            bg="white"
                            color="gray.700"
                            border="1px"
                            borderColor="gray.200"
                        >
                            Refresh
                        </Button>
                    </HStack>
                </Flex>

                {/* Stats Grid */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    <StatCard
                        title="Total Pengguna"
                        value={analytics.overview.totalUsers}
                        icon={<Users size={24} />}
                        color="blue"
                    />
                    <StatCard
                        title="Total Buku"
                        value={analytics.overview.totalBooks}
                        icon={<BookOpen size={24} />}
                        color="green"
                    />
                    <StatCard
                        title="Total Konten"
                        value={analytics.overview.totalContent}
                        icon={<FileText size={24} />}
                        color="purple"
                    />
                    <StatCard
                        title="Total Views"
                        value={analytics.overview.totalViews}
                        icon={<Eye size={24} />}
                        color="orange"
                    />
                </SimpleGrid>

                {/* Charts Section */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <SimpleChart
                        title="Pertumbuhan Pengguna"
                        data={analytics.trends.userGrowth}
                        color="blue"
                    />
                    <SimpleChart
                        title="Pertumbuhan Konten"
                        data={analytics.trends.contentGrowth}
                        color="green"
                    />
                </SimpleGrid>

                {/* Content Stats */}
                <Card
                    bg="white"
                    shadow="sm"
                    borderRadius="lg"
                    border="1px"
                    borderColor="gray.100"
                >
                    <CardBody p={6}>
                        <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="gray.800"
                            mb={4}
                        >
                            Distribusi Konten
                        </Text>
                        <VStack spacing={4} align="stretch">
                            {Object.entries(analytics.contentStats.byType).map(
                                ([type, count]) => (
                                    <Box key={type}>
                                        <HStack justify="space-between" mb={2}>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="500"
                                                color="gray.700"
                                            >
                                                {type.toUpperCase()}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                {count}
                                            </Text>
                                        </HStack>
                                        <Progress
                                            value={
                                                (count /
                                                    analytics.overview
                                                        .totalContent) *
                                                100
                                            }
                                            colorScheme={getContentTypeColor(
                                                type
                                            )}
                                            size="sm"
                                            borderRadius="full"
                                            bg="gray.100"
                                        />
                                    </Box>
                                )
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                {/* User Activity */}
                <Card
                    bg="white"
                    shadow="sm"
                    borderRadius="lg"
                    border="1px"
                    borderColor="gray.100"
                >
                    <CardBody p={6}>
                        <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="gray.800"
                            mb={4}
                        >
                            Aktivitas Pengguna
                        </Text>
                        <VStack spacing={3} align="stretch">
                            {analytics.userActivity.slice(0, 5).map((user) => (
                                <HStack
                                    key={user.id}
                                    justify="space-between"
                                    p={3}
                                    bg="gray.50"
                                    borderRadius="md"
                                >
                                    <HStack spacing={3}>
                                        <Avatar size="sm" name={user.name} />
                                        <VStack align="start" spacing={0}>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="500"
                                                color="gray.800"
                                            >
                                                {user.name}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {user.email}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <HStack spacing={2}>
                                        <Badge
                                            colorScheme={getStatusColor(
                                                user.status
                                            )}
                                            variant="subtle"
                                            fontSize="xs"
                                        >
                                            {user.status}
                                        </Badge>
                                        <Text fontSize="sm" color="gray.600">
                                            {user.activity}%
                                        </Text>
                                    </HStack>
                                </HStack>
                            ))}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Loading State */}
                {isLoading && (
                    <Center py={12}>
                        <VStack spacing={4}>
                            <Spinner size="lg" color="blue.500" />
                            <Text color="gray.500">Memuat data...</Text>
                        </VStack>
                    </Center>
                )}
            </VStack>
        </Box>
    );
};

export default AnalyticsPage;

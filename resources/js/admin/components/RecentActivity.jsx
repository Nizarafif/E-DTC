import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Card,
    CardBody,
    CardHeader,
    Badge,
    Avatar,
    Flex,
    Spacer,
    Button,
    useColorModeValue,
    Tooltip,
    Divider,
} from "@chakra-ui/react";
import {
    BookOpen,
    FileText,
    Download,
    Edit3,
    Calendar,
    Clock,
    Eye,
    Plus,
    Activity,
} from "lucide-react";

const RecentActivity = ({ data, onNavigate }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const dividerColor = useColorModeValue("gray.100", "gray.700");

    const stats = data?.stats || {};
    const books = data?.books || [];
    const bookContents = data?.bookContents || [];

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
        const book = books.find((b) => b.id === bookId);
        return book ? book.title : "Buku Tidak Ditemukan";
    };

    const getContentTypeIcon = (contentType) => {
        switch (contentType) {
            case "pdf":
                return <Download size={14} />;
            default:
                return <Edit3 size={14} />;
        }
    };

    const getContentTypeColor = (contentType) => {
        switch (contentType) {
            case "pdf":
                return "red";
            default:
                return "blue";
        }
    };

    const getContentTypeLabel = (contentType) => {
        switch (contentType) {
            case "pdf":
                return "PDF";
            default:
                return "Editor";
        }
    };

    // Gabungkan aktivitas terbaru dari buku dan konten
    const recentActivities = [
        ...(stats.recentBooks?.map((book) => ({
            id: `book-${book.id}`,
            type: "book",
            title: book.title,
            subtitle: `Buku baru ditambahkan`,
            time: book.created_at,
            icon: <BookOpen size={16} />,
            color: "blue",
        })) || []),
        ...(stats.recentContents?.map((content) => ({
            id: `content-${content.id}`,
            type: "content",
            title: content.chapter_title || "Konten Baru",
            subtitle: `${getContentTypeLabel(
                content.content_type
            )} - ${getBookTitle(content.book_id)}`,
            time: content.created_at,
            icon: getContentTypeIcon(content.content_type),
            color: getContentTypeColor(content.content_type),
        })) || []),
    ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8);

    const ActivityItem = ({ activity }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ x: 5 }}
        >
            <HStack
                spacing={3}
                p={3}
                borderRadius="lg"
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
            >
                <Avatar
                    size="sm"
                    bg={`${activity.color}.100`}
                    color={`${activity.color}.600`}
                    icon={activity.icon}
                />
                <VStack align="start" spacing={0} flex={1}>
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={textColor}
                        noOfLines={1}
                    >
                        {activity.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {activity.subtitle}
                    </Text>
                </VStack>
                <VStack align="end" spacing={0}>
                    <Text fontSize="xs" color="gray.400">
                        {formatTimeAgo(activity.time)}
                    </Text>
                    <Badge
                        size="sm"
                        colorScheme={activity.color}
                        variant="subtle"
                    >
                        {activity.type === "book" ? "Buku" : "Konten"}
                    </Badge>
                </VStack>
            </HStack>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
            >
                <CardHeader>
                    <Flex align="center" justify="space-between">
                        <HStack spacing={3}>
                            <Box
                                p={2}
                                bg="teal.100"
                                borderRadius="lg"
                                color="teal.600"
                            >
                                <Activity size={16} />
                            </Box>
                            <VStack align="start" spacing={0}>
                                <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    Aktivitas Terbaru
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Update real-time dari sistem
                                </Text>
                            </VStack>
                        </HStack>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                onNavigate && onNavigate("books-contents")
                            }
                            leftIcon={<Eye size={14} />}
                        >
                            Lihat Semua
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody pt={0}>
                    {recentActivities.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <Box fontSize="4xl" mb={3}>
                                📚
                            </Box>
                            <Text fontSize="sm" color="gray.500" mb={4}>
                                Belum ada aktivitas terbaru
                            </Text>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() =>
                                    onNavigate && onNavigate("books-add")
                                }
                                leftIcon={<Plus size={14} />}
                            >
                                Tambah Buku Pertama
                            </Button>
                        </Box>
                    ) : (
                        <VStack spacing={0} align="stretch">
                            {recentActivities.map((activity, index) => (
                                <Box key={activity.id}>
                                    <ActivityItem activity={activity} />
                                    {index < recentActivities.length - 1 && (
                                        <Divider borderColor={dividerColor} />
                                    )}
                                </Box>
                            ))}
                        </VStack>
                    )}
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default RecentActivity;

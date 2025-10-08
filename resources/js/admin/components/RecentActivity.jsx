import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    Badge,
    IconButton,
    Tooltip,
    Avatar,
    AvatarGroup,
    Flex,
    Spacer,
    Divider,
    SimpleGrid,
} from "@chakra-ui/react";
import {
    BookOpen,
    FileText,
    Download,
    Edit3,
    Eye,
    Calendar,
    Clock,
    User,
    Plus,
    Trash2,
    Activity,
} from "lucide-react";

const RecentActivity = ({ data, onNavigate }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const cardBg = useColorModeValue("gray.50", "gray.700");

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

    const getBookTitle = (bookId) => {
        const book = data?.books?.find((b) => b.id === bookId);
        return book ? book.title : "Buku Tidak Ditemukan";
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "book_created":
                return <BookOpen size={14} />;
            case "content_created":
                return <FileText size={14} />;
            case "content_updated":
                return <Edit3 size={14} />;
            case "content_deleted":
                return <Trash2 size={14} />;
            default:
                return <Activity size={14} />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case "book_created":
                return "blue";
            case "content_created":
                return "green";
            case "content_updated":
                return "orange";
            case "content_deleted":
                return "red";
            default:
                return "gray";
        }
    };

    const getActivityText = (type, data) => {
        switch (type) {
            case "book_created":
                return `Buku "${data.title}" ditambahkan`;
            case "content_created":
                return `Konten "${
                    data.chapter_title || "Untitled"
                }" ditambahkan`;
            case "content_updated":
                return `Konten "${
                    data.chapter_title || "Untitled"
                }" diperbarui`;
            case "content_deleted":
                return `Konten "${data.chapter_title || "Untitled"}" dihapus`;
            default:
                return "Aktivitas tidak diketahui";
        }
    };

    // Simulasi aktivitas terbaru (dalam implementasi nyata, ini akan datang dari backend)
    const recentActivities = [
        ...(data?.stats?.recentBooks?.slice(0, 3).map((book) => ({
            id: `book-${book.id}`,
            type: "book_created",
            data: book,
            timestamp: book.created_at,
        })) || []),
        ...(data?.stats?.recentContents?.slice(0, 3).map((content) => ({
            id: `content-${content.id}`,
            type: "content_created",
            data: content,
            timestamp: content.created_at,
        })) || []),
    ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 6);

    return (
        <Box
            bg={bgColor}
            p={6}
            borderRadius="2xl"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
        >
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <Flex align="center" justify="space-between">
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            bg="purple.100"
                            borderRadius="lg"
                            color="purple.600"
                        >
                            <Clock size={16} />
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
                        onClick={() => onNavigate && onNavigate("books")}
                    >
                        Lihat Semua
                    </Button>
                </Flex>

                {/* Activity List */}
                <VStack spacing={3} align="stretch">
                    {recentActivities.length > 0 ? (
                        recentActivities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Box
                                    p={4}
                                    bg={cardBg}
                                    borderRadius="lg"
                                    border="1px"
                                    borderColor={borderColor}
                                    _hover={{
                                        shadow: "md",
                                        borderColor: `${getActivityColor(
                                            activity.type
                                        )}.300`,
                                    }}
                                    transition="all 0.2s"
                                >
                                    <HStack
                                        justify="space-between"
                                        align="start"
                                    >
                                        <HStack spacing={3} flex={1}>
                                            <Box
                                                p={2}
                                                bg={`${getActivityColor(
                                                    activity.type
                                                )}.100`}
                                                borderRadius="lg"
                                                color={`${getActivityColor(
                                                    activity.type
                                                )}.600`}
                                            >
                                                {getActivityIcon(activity.type)}
                                            </Box>

                                            <VStack
                                                align="start"
                                                spacing={1}
                                                flex={1}
                                            >
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="bold"
                                                    color={textColor}
                                                    noOfLines={1}
                                                >
                                                    {getActivityText(
                                                        activity.type,
                                                        activity.data
                                                    )}
                                                </Text>

                                                <HStack
                                                    spacing={2}
                                                    fontSize="xs"
                                                    color="gray.500"
                                                >
                                                    <HStack spacing={1}>
                                                        <Clock size={10} />
                                                        <Text>
                                                            {formatTimeAgo(
                                                                activity.timestamp
                                                            )}
                                                        </Text>
                                                    </HStack>
                                                    <HStack spacing={1}>
                                                        <Calendar size={10} />
                                                        <Text>
                                                            {formatDate(
                                                                activity.timestamp
                                                            )}
                                                        </Text>
                                                    </HStack>
                                                </HStack>

                                                {activity.type ===
                                                    "content_created" && (
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.400"
                                                        noOfLines={1}
                                                    >
                                                        Buku:{" "}
                                                        {getBookTitle(
                                                            activity.data
                                                                .book_id
                                                        )}
                                                    </Text>
                                                )}
                                            </VStack>
                                        </HStack>

                                        <HStack spacing={1}>
                                            <Badge
                                                colorScheme={getActivityColor(
                                                    activity.type
                                                )}
                                                variant="subtle"
                                                fontSize="xs"
                                            >
                                                {activity.type ===
                                                "book_created"
                                                    ? "Buku"
                                                    : "Konten"}
                                            </Badge>
                                        </HStack>
                                    </HStack>
                                </Box>
                            </motion.div>
                        ))
                    ) : (
                        <Box p={8} textAlign="center" color="gray.500">
                            <VStack spacing={3}>
                                <Box
                                    p={4}
                                    bg="gray.100"
                                    borderRadius="full"
                                    color="gray.400"
                                >
                                    <Clock size={24} />
                                </Box>
                                <VStack spacing={1}>
                                    <Text fontSize="sm" fontWeight="bold">
                                        Belum ada aktivitas
                                    </Text>
                                    <Text fontSize="xs">
                                        Aktivitas akan muncul di sini saat ada
                                        perubahan
                                    </Text>
                                </VStack>
                            </VStack>
                        </Box>
                    )}
                </VStack>

                {/* Quick Stats */}
                <Box>
                    <Divider mb={4} />
                    <SimpleGrid columns={3} spacing={4}>
                        <VStack spacing={1}>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="blue.600"
                            >
                                {data?.stats?.recentBooks?.length || 0}
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                textAlign="center"
                            >
                                Buku Terbaru
                            </Text>
                        </VStack>
                        <VStack spacing={1}>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="green.600"
                            >
                                {data?.stats?.recentContents?.length || 0}
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                textAlign="center"
                            >
                                Konten Terbaru
                            </Text>
                        </VStack>
                        <VStack spacing={1}>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="purple.600"
                            >
                                {recentActivities.length}
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                textAlign="center"
                            >
                                Total Aktivitas
                            </Text>
                        </VStack>
                    </SimpleGrid>
                </Box>
            </VStack>
        </Box>
    );
};

export default RecentActivity;

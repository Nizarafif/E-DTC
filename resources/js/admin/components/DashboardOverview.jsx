import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    Grid,
    VStack,
    HStack,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Avatar,
    Badge,
    useColorModeValue,
    Progress,
    Divider,
} from "@chakra-ui/react";
import { TrendingUp, Calendar, Clock, Users } from "lucide-react";
import DashboardStats from "./DashboardStats";

const DashboardOverview = () => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.700", "gray.200");

    // Mock data
    const recentBooks = [
        {
            id: 1,
            title: "Panduan React Advanced",
            author: "John Doe",
            status: "published",
            downloads: 1234,
            rating: 4.8,
        },
        {
            id: 2,
            title: "Machine Learning Basics",
            author: "Jane Smith",
            status: "draft",
            downloads: 856,
            rating: 4.6,
        },
        {
            id: 3,
            title: "Web Development 2024",
            author: "Bob Johnson",
            status: "published",
            downloads: 2341,
            rating: 4.9,
        },
        {
            id: 4,
            title: "Data Science Guide",
            author: "Alice Brown",
            status: "review",
            downloads: 567,
            rating: 4.5,
        },
    ];

    const topCategories = [
        { name: "Teknologi", books: 45, percentage: 85 },
        { name: "Bisnis", books: 32, percentage: 70 },
        { name: "Pendidikan", books: 28, percentage: 60 },
        { name: "Kesehatan", books: 15, percentage: 35 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return "green";
            case "draft":
                return "yellow";
            case "review":
                return "blue";
            default:
                return "gray";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "published":
                return "Terbit";
            case "draft":
                return "Draft";
            case "review":
                return "Review";
            default:
                return "Unknown";
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <VStack spacing={8} align="stretch">
                {/* Stats Cards */}
                <DashboardStats />

                {/* Main Content Grid */}
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                    {/* Recent Books Table */}
                    <motion.div variants={itemVariants}>
                        <Box
                            bg={bgColor}
                            borderRadius="2xl"
                            border="1px"
                            borderColor={borderColor}
                            overflow="hidden"
                            shadow="sm"
                        >
                            <VStack align="stretch" spacing={0}>
                                <HStack justify="space-between" p={6} pb={4}>
                                    <HStack spacing={3}>
                                        <Box
                                            p={2}
                                            bg="teal.100"
                                            borderRadius="lg"
                                            color="teal.600"
                                        >
                                            <TrendingUp size={20} />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="bold"
                                                color={textColor}
                                            >
                                                Buku Terbaru
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                            >
                                                Aktivitas terkini
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </HStack>

                                <Divider borderColor={borderColor} />

                                <Box overflowX="auto">
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th
                                                    border="none"
                                                    color="gray.500"
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                >
                                                    BUKU
                                                </Th>
                                                <Th
                                                    border="none"
                                                    color="gray.500"
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                >
                                                    STATUS
                                                </Th>
                                                <Th
                                                    border="none"
                                                    color="gray.500"
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                    isNumeric
                                                >
                                                    UNDUHAN
                                                </Th>
                                                <Th
                                                    border="none"
                                                    color="gray.500"
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                    isNumeric
                                                >
                                                    RATING
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {recentBooks.map((book, index) => (
                                                <motion.tr
                                                    key={book.id}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.1,
                                                        duration: 0.3,
                                                    }}
                                                    whileHover={{
                                                        backgroundColor:
                                                            useColorModeValue(
                                                                "#F9FAFB",
                                                                "#374151"
                                                            ),
                                                    }}
                                                >
                                                    <Td border="none" py={4}>
                                                        <HStack spacing={3}>
                                                            <Avatar
                                                                size="sm"
                                                                name={
                                                                    book.title
                                                                }
                                                                bg="teal.500"
                                                                color="white"
                                                            />
                                                            <VStack
                                                                align="start"
                                                                spacing={0}
                                                            >
                                                                <Text
                                                                    fontSize="sm"
                                                                    fontWeight="600"
                                                                    color={
                                                                        textColor
                                                                    }
                                                                >
                                                                    {book.title}
                                                                </Text>
                                                                <Text
                                                                    fontSize="xs"
                                                                    color="gray.500"
                                                                >
                                                                    {
                                                                        book.author
                                                                    }
                                                                </Text>
                                                            </VStack>
                                                        </HStack>
                                                    </Td>
                                                    <Td border="none">
                                                        <Badge
                                                            colorScheme={getStatusColor(
                                                                book.status
                                                            )}
                                                            borderRadius="full"
                                                            px={3}
                                                            py={1}
                                                            fontSize="xs"
                                                        >
                                                            {getStatusText(
                                                                book.status
                                                            )}
                                                        </Badge>
                                                    </Td>
                                                    <Td border="none" isNumeric>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="600"
                                                            color={textColor}
                                                        >
                                                            {book.downloads.toLocaleString()}
                                                        </Text>
                                                    </Td>
                                                    <Td border="none" isNumeric>
                                                        <HStack
                                                            justify="end"
                                                            spacing={1}
                                                        >
                                                            <Text
                                                                fontSize="sm"
                                                                fontWeight="600"
                                                                color="yellow.500"
                                                            >
                                                                ★
                                                            </Text>
                                                            <Text
                                                                fontSize="sm"
                                                                fontWeight="600"
                                                                color={
                                                                    textColor
                                                                }
                                                            >
                                                                {book.rating}
                                                            </Text>
                                                        </HStack>
                                                    </Td>
                                                </motion.tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            </VStack>
                        </Box>
                    </motion.div>

                    {/* Right Sidebar */}
                    <VStack spacing={6} align="stretch">
                        {/* Top Categories */}
                        <motion.div variants={itemVariants}>
                            <Box
                                bg={bgColor}
                                p={6}
                                borderRadius="2xl"
                                border="1px"
                                borderColor={borderColor}
                                shadow="sm"
                            >
                                <HStack spacing={3} mb={6}>
                                    <Box
                                        p={2}
                                        bg="blue.100"
                                        borderRadius="lg"
                                        color="blue.600"
                                    >
                                        <Users size={20} />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="bold"
                                            color={textColor}
                                        >
                                            Kategori Populer
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Berdasarkan jumlah buku
                                        </Text>
                                    </VStack>
                                </HStack>

                                <VStack spacing={4} align="stretch">
                                    {topCategories.map((category, index) => (
                                        <motion.div
                                            key={category.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: index * 0.1,
                                                duration: 0.3,
                                            }}
                                        >
                                            <VStack align="stretch" spacing={2}>
                                                <HStack justify="space-between">
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                        color={textColor}
                                                    >
                                                        {category.name}
                                                    </Text>
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.500"
                                                    >
                                                        {category.books} buku
                                                    </Text>
                                                </HStack>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{
                                                        delay:
                                                            0.5 + index * 0.1,
                                                        duration: 0.8,
                                                    }}
                                                >
                                                    <Progress
                                                        value={
                                                            category.percentage
                                                        }
                                                        size="sm"
                                                        colorScheme="teal"
                                                        borderRadius="full"
                                                        bg="gray.100"
                                                    />
                                                </motion.div>
                                            </VStack>
                                        </motion.div>
                                    ))}
                                </VStack>
                            </Box>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div variants={itemVariants}>
                            <Box
                                bg={bgColor}
                                p={6}
                                borderRadius="2xl"
                                border="1px"
                                borderColor={borderColor}
                                shadow="sm"
                            >
                                <HStack spacing={3} mb={6}>
                                    <Box
                                        p={2}
                                        bg="green.100"
                                        borderRadius="lg"
                                        color="green.600"
                                    >
                                        <Calendar size={20} />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="bold"
                                            color={textColor}
                                        >
                                            Aktivitas Hari Ini
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Ringkasan aktivitas
                                        </Text>
                                    </VStack>
                                </HStack>

                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between">
                                        <HStack spacing={2}>
                                            <Clock size={16} color="gray.500" />
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                Buku baru diterbitkan
                                            </Text>
                                        </HStack>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="teal.600"
                                        >
                                            12
                                        </Text>
                                    </HStack>

                                    <HStack justify="space-between">
                                        <HStack spacing={2}>
                                            <Users size={16} color="gray.500" />
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                Pengguna baru
                                            </Text>
                                        </HStack>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="blue.600"
                                        >
                                            28
                                        </Text>
                                    </HStack>

                                    <HStack justify="space-between">
                                        <HStack spacing={2}>
                                            <TrendingUp
                                                size={16}
                                                color="gray.500"
                                            />
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                Total unduhan
                                            </Text>
                                        </HStack>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="green.600"
                                        >
                                            1,456
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>
                        </motion.div>
                    </VStack>
                </Grid>
            </VStack>
        </motion.div>
    );
};

export default DashboardOverview;

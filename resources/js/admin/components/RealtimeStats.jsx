import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    Progress,
    CircularProgress,
    CircularProgressLabel,
    Badge,
    IconButton,
    Tooltip,
    Flex,
    Spacer,
    Divider,
} from "@chakra-ui/react";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    RefreshCw,
    Eye,
    BookOpen,
    FileText,
    Download,
    Edit3,
} from "lucide-react";

const RealtimeStats = ({ data, isLoading, onRefresh }) => {
    const [animationKey, setAnimationKey] = useState(0);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");

    // Trigger animation saat data berubah
    useEffect(() => {
        setAnimationKey((prev) => prev + 1);
    }, [data]);

    const stats = [
        {
            label: "Total Buku",
            value: data?.stats?.totalBooks || 0,
            icon: BookOpen,
            color: "blue",
            trend: "+12%",
            trendType: "increase",
        },
        {
            label: "Total Konten",
            value: data?.stats?.totalContents || 0,
            icon: FileText,
            color: "purple",
            trend: "+8%",
            trendType: "increase",
        },
        {
            label: "Editor Content",
            value: data?.stats?.editorContents || 0,
            icon: Edit3,
            color: "green",
            trend: "+15%",
            trendType: "increase",
        },
        {
            label: "PDF Content",
            value: data?.stats?.pdfContents || 0,
            icon: Download,
            color: "red",
            trend: "+5%",
            trendType: "increase",
        },
    ];

    const StatCard = ({ stat, index }) => (
        <motion.div
            key={`${stat.label}-${animationKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
        >
            <Box
                p={4}
                bg={useColorModeValue(`${stat.color}.50`, `${stat.color}.900`)}
                borderRadius="xl"
                border="1px"
                borderColor={useColorModeValue(
                    `${stat.color}.200`,
                    `${stat.color}.700`
                )}
                _hover={{
                    shadow: "lg",
                    transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
            >
                <VStack spacing={3} align="stretch">
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="xs"
                                fontWeight="bold"
                                color={`${stat.color}.600`}
                                textTransform="uppercase"
                                letterSpacing="wide"
                            >
                                {stat.label}
                            </Text>
                            <motion.div
                                key={stat.value}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Text
                                    fontSize="3xl"
                                    fontWeight="bold"
                                    color={`${stat.color}.600`}
                                >
                                    {stat.value}
                                </Text>
                            </motion.div>
                        </VStack>
                        <Box
                            p={2}
                            bg={`${stat.color}.100`}
                            borderRadius="lg"
                            color={`${stat.color}.600`}
                        >
                            <stat.icon size={20} />
                        </Box>
                    </HStack>

                    <HStack spacing={2}>
                        <Badge
                            colorScheme={
                                stat.trendType === "increase" ? "green" : "red"
                            }
                            variant="subtle"
                            fontSize="xs"
                        >
                            {stat.trendType === "increase" ? (
                                <TrendingUp size={12} />
                            ) : (
                                <TrendingDown size={12} />
                            )}
                            {stat.trend}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                            vs bulan lalu
                        </Text>
                    </HStack>
                </VStack>
            </Box>
        </motion.div>
    );

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
                            bg="blue.100"
                            borderRadius="lg"
                            color="blue.600"
                        >
                            <Activity size={16} />
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Statistik Real-time
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Update otomatis setiap 30 detik
                            </Text>
                        </VStack>
                    </HStack>

                    <HStack spacing={2}>
                        <Tooltip label="Refresh Manual">
                            <IconButton
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                                icon={<RefreshCw size={14} />}
                                onClick={onRefresh}
                                isLoading={isLoading}
                            />
                        </Tooltip>
                    </HStack>
                </Flex>

                {/* Stats Grid */}
                <Box>
                    <VStack spacing={4} align="stretch">
                        {stats.map((stat, index) => (
                            <StatCard
                                key={stat.label}
                                stat={stat}
                                index={index}
                            />
                        ))}
                    </VStack>
                </Box>

                {/* Progress Indicators */}
                <Box>
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                            Progress Konten
                        </Text>

                        <VStack spacing={3} align="stretch">
                            {/* Editor vs PDF Ratio */}
                            <Box>
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" color="gray.600">
                                        Editor Content
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="bold"
                                        color="green.600"
                                    >
                                        {data?.stats?.editorContents || 0}
                                    </Text>
                                </HStack>
                                <Progress
                                    value={
                                        data?.stats?.totalContents > 0
                                            ? (data.stats.editorContents /
                                                  data.stats.totalContents) *
                                              100
                                            : 0
                                    }
                                    colorScheme="green"
                                    borderRadius="full"
                                    height="8px"
                                />
                            </Box>

                            <Box>
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" color="gray.600">
                                        PDF Content
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="bold"
                                        color="red.600"
                                    >
                                        {data?.stats?.pdfContents || 0}
                                    </Text>
                                </HStack>
                                <Progress
                                    value={
                                        data?.stats?.totalContents > 0
                                            ? (data.stats.pdfContents /
                                                  data.stats.totalContents) *
                                              100
                                            : 0
                                    }
                                    colorScheme="red"
                                    borderRadius="full"
                                    height="8px"
                                />
                            </Box>
                        </VStack>
                    </VStack>
                </Box>

                {/* Circular Progress */}
                <Box>
                    <HStack justify="center" spacing={8}>
                        <VStack spacing={2}>
                            <CircularProgress
                                value={
                                    data?.stats?.totalContents > 0
                                        ? (data.stats.editorContents /
                                              data.stats.totalContents) *
                                          100
                                        : 0
                                }
                                color="green.500"
                                size="80px"
                                thickness="8px"
                            >
                                <CircularProgressLabel
                                    fontSize="sm"
                                    fontWeight="bold"
                                >
                                    {data?.stats?.totalContents > 0
                                        ? Math.round(
                                              (data.stats.editorContents /
                                                  data.stats.totalContents) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </CircularProgressLabel>
                            </CircularProgress>
                            <Text
                                fontSize="xs"
                                color="green.600"
                                fontWeight="bold"
                            >
                                Editor
                            </Text>
                        </VStack>

                        <VStack spacing={2}>
                            <CircularProgress
                                value={
                                    data?.stats?.totalContents > 0
                                        ? (data.stats.pdfContents /
                                              data.stats.totalContents) *
                                          100
                                        : 0
                                }
                                color="red.500"
                                size="80px"
                                thickness="8px"
                            >
                                <CircularProgressLabel
                                    fontSize="sm"
                                    fontWeight="bold"
                                >
                                    {data?.stats?.totalContents > 0
                                        ? Math.round(
                                              (data.stats.pdfContents /
                                                  data.stats.totalContents) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </CircularProgressLabel>
                            </CircularProgress>
                            <Text
                                fontSize="xs"
                                color="red.600"
                                fontWeight="bold"
                            >
                                PDF
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default RealtimeStats;

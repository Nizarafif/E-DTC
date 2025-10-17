import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Card,
    CardBody,
    CardHeader,
    Progress,
    Badge,
    Flex,
    Icon,
    useColorModeValue,
    Tooltip,
} from "@chakra-ui/react";
import {
    BookOpen,
    FileText,
    Users,
    TrendingUp,
    Download,
    Edit3,
    BarChart3,
    PieChart,
    Activity,
    Clock,
} from "lucide-react";

const RealtimeStats = ({ data, isLoading, onRefresh }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const cardBg = useColorModeValue("gray.50", "gray.700");

    const stats = data?.stats || {};
    const books = data?.books || [];
    const bookContents = data?.bookContents || [];

    // Hitung persentase distribusi konten
    const totalContent = stats.totalContents || 1;
    const editorPercent = Math.round(
        (stats.editorContents / totalContent) * 100
    );
    const pdfPercent = Math.round((stats.pdfContents / totalContent) * 100);

    // Statistik dengan animasi
    const StatCard = ({
        title,
        value,
        icon,
        color,
        trend,
        subtitle,
        tooltip,
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
            >
                <CardBody p={4}>
                    <Flex align="center" justify="space-between">
                        <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                            <Text
                                    fontSize="sm"
                                    color="gray.500"
                                    fontWeight="medium"
                                >
                                    {title}
                            </Text>
                                {tooltip && (
                                    <Tooltip label={tooltip} fontSize="sm">
                                        <Icon
                                            as={Activity}
                                            boxSize={3}
                                            color="gray.400"
                                        />
                                    </Tooltip>
                                )}
                            </HStack>
                                <Text
                                fontSize="2xl"
                                    fontWeight="bold"
                                color={textColor}
                            >
                                {isLoading ? "..." : value}
                            </Text>
                            {subtitle && (
                                <Text fontSize="xs" color="gray.500">
                                    {subtitle}
                                </Text>
                            )}
                            {trend && (
                                <HStack spacing={1}>
                                    <StatArrow
                                        type={
                                            trend > 0 ? "increase" : "decrease"
                                        }
                                    />
                                    <Text
                            fontSize="xs"
                                        color={
                                            trend > 0 ? "green.500" : "red.500"
                                        }
                                    >
                                        {Math.abs(trend)}%
                        </Text>
                    </HStack>
                            )}
                </VStack>
                        <Box
                            p={3}
                            bg={`${color}.100`}
                            borderRadius="xl"
                            color={`${color}.600`}
                        >
                            {icon}
            </Box>
                    </Flex>
                </CardBody>
            </Card>
        </motion.div>
    );

    // Progress bar untuk distribusi konten
    const ContentDistributionCard = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <Card
            bg={bgColor}
            border="1px"
            borderColor={borderColor}
            shadow="sm"
        >
                <CardHeader pb={2}>
                    <HStack spacing={2}>
                        <Box
                            p={2}
                            bg="purple.100"
                            borderRadius="lg"
                            color="purple.600"
                        >
                            <PieChart size={16} />
                        </Box>
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                            Distribusi Konten
                            </Text>
                    </HStack>
                </CardHeader>
                <CardBody pt={0}>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Flex justify="space-between" mb={1}>
                    <HStack spacing={2}>
                                    <Icon
                                        as={Edit3}
                                        boxSize={3}
                                        color="blue.500"
                                    />
                                    <Text fontSize="sm" fontWeight="medium">
                                        Editor
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" fontWeight="bold">
                                    {stats.editorContents}
                                </Text>
                            </Flex>
                                <Progress
                                value={editorPercent}
                                colorScheme="blue"
                                size="sm"
                                borderRadius="md"
                            />
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                {editorPercent}%
                            </Text>
                            </Box>

                            <Box>
                            <Flex justify="space-between" mb={1}>
                                <HStack spacing={2}>
                                    <Icon
                                        as={Download}
                                        boxSize={3}
                                        color="red.500"
                                    />
                                    <Text fontSize="sm" fontWeight="medium">
                                        PDF
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" fontWeight="bold">
                                    {stats.pdfContents}
                                </Text>
                            </Flex>
                                <Progress
                                value={pdfPercent}
                                    colorScheme="red"
                                size="sm"
                                borderRadius="md"
                                />
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                {pdfPercent}%
                            </Text>
                            </Box>
                        </VStack>
                </CardBody>
            </Card>
        </motion.div>
    );

    // Card untuk statistik tambahan
    const AdditionalStatsCard = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
            >
                <CardHeader pb={2}>
                    <HStack spacing={2}>
                        <Box
                            p={2}
                            bg="orange.100"
                            borderRadius="lg"
                            color="orange.600"
                        >
                            <BarChart3 size={16} />
                        </Box>
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                            Statistik Tambahan
                        </Text>
                    </HStack>
                </CardHeader>
                <CardBody pt={0}>
                    <VStack spacing={3} align="stretch">
                        <Flex justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.600">
                                Total Halaman
                            </Text>
                            <Badge colorScheme="blue" fontSize="sm">
                                {stats.totalPages || 0}
                            </Badge>
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.600">
                                Rata-rata Konten/Buku
                            </Text>
                            <Badge colorScheme="green" fontSize="sm">
                                {stats.avgContentPerBook || 0}
                            </Badge>
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.600">
                                Buku dengan Konten
                            </Text>
                            <Badge colorScheme="purple" fontSize="sm">
                                {
                                    books.filter((book) =>
                                        bookContents.some(
                                            (content) =>
                                                content.book_id === book.id
                                        )
                                    ).length
                                }
                            </Badge>
                        </Flex>
                        </VStack>
                </CardBody>
            </Card>
        </motion.div>
    );

    return (
        <VStack spacing={6} align="stretch">
            {/* Statistik Utama */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                <StatCard
                    title="Total Buku"
                    value={stats.totalBooks || 0}
                    icon={<BookOpen size={20} />}
                    color="blue"
                    subtitle="Buku terdaftar"
                    tooltip="Jumlah total buku dalam sistem"
                />
                <StatCard
                    title="Total Konten"
                    value={stats.totalContents || 0}
                    icon={<FileText size={20} />}
                    color="green"
                    subtitle="Chapter & dokumen"
                    tooltip="Jumlah total konten (editor, PDF)"
                />
                <StatCard
                    title="Pengguna"
                    value={stats.totalUsers || 0}
                    icon={<Users size={20} />}
                    color="purple"
                    subtitle="User terdaftar"
                    tooltip="Jumlah pengguna sistem"
                />
                <StatCard
                    title="PDF Upload"
                    value={stats.pdfContents || 0}
                    icon={<Download size={20} />}
                    color="red"
                    subtitle="File PDF"
                    tooltip="Jumlah file PDF yang diupload"
                />
            </SimpleGrid>

            {/* Statistik Detail */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <ContentDistributionCard />
                <AdditionalStatsCard />
            </SimpleGrid>
            </VStack>
    );
};

export default RealtimeStats;

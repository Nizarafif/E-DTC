import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    Grid,
    useColorModeValue,
    Icon,
    HStack,
    VStack,
    Text,
    Progress,
} from "@chakra-ui/react";
import {
    BookOpen,
    Users,
    TrendingUp,
    Eye,
    Download,
    Star,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

const DashboardStats = () => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");

    const stats = [
        {
            id: 1,
            label: "Total Buku",
            value: "1,234",
            change: "+12%",
            changeType: "increase",
            icon: BookOpen,
            color: "teal",
            description: "dari bulan lalu",
        },
        {
            id: 2,
            label: "Pengguna Aktif",
            value: "5,678",
            change: "+8%",
            changeType: "increase",
            icon: Users,
            color: "blue",
            description: "pengguna terdaftar",
        },
        {
            id: 3,
            label: "Total Unduhan",
            value: "23,456",
            change: "+15%",
            changeType: "increase",
            icon: Download,
            color: "green",
            description: "unduhan bulan ini",
        },
        {
            id: 4,
            label: "Rating Rata-rata",
            value: "4.8",
            change: "+0.2",
            changeType: "increase",
            icon: Star,
            color: "yellow",
            description: "dari 5 bintang",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        hover: {
            y: -5,
            scale: 1.02,
            transition: {
                duration: 0.2,
                ease: "easeOut",
            },
        },
    };

    const iconVariants = {
        hover: {
            rotate: 360,
            scale: 1.1,
            transition: {
                duration: 0.6,
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Grid
                templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                }}
                gap={6}
                mb={8}
            >
                {stats.map((stat) => (
                    <motion.div
                        key={stat.id}
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                    >
                        <Box
                            bg={bgColor}
                            p={6}
                            borderRadius="2xl"
                            border="1px"
                            borderColor={borderColor}
                            shadow="sm"
                            position="relative"
                            overflow="hidden"
                            cursor="pointer"
                            _hover={{
                                shadow: "lg",
                                borderColor: `${stat.color}.200`,
                            }}
                            transition="all 0.3s ease"
                        >
                            {/* Background Gradient */}
                            <Box
                                position="absolute"
                                top={0}
                                right={0}
                                w="100px"
                                h="100px"
                                bg={`linear-gradient(135deg, ${stat.color}.50, transparent)`}
                                borderRadius="full"
                                transform="translate(30px, -30px)"
                                opacity={0.3}
                            />

                            <VStack
                                align="start"
                                spacing={4}
                                position="relative"
                                zIndex={1}
                            >
                                <HStack justify="space-between" w="full">
                                    <motion.div
                                        variants={iconVariants}
                                        whileHover="hover"
                                    >
                                        <Box
                                            p={3}
                                            bg={`${stat.color}.100`}
                                            borderRadius="xl"
                                            color={`${stat.color}.600`}
                                        >
                                            <Icon as={stat.icon} boxSize={6} />
                                        </Box>
                                    </motion.div>

                                    <HStack
                                        spacing={1}
                                        color={
                                            stat.changeType === "increase"
                                                ? "green.500"
                                                : "red.500"
                                        }
                                    >
                                        <Icon
                                            as={
                                                stat.changeType === "increase"
                                                    ? ArrowUp
                                                    : ArrowDown
                                            }
                                            boxSize={3}
                                        />
                                        <Text fontSize="sm" fontWeight="600">
                                            {stat.change}
                                        </Text>
                                    </HStack>
                                </HStack>

                                <VStack align="start" spacing={1} w="full">
                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        fontWeight="500"
                                    >
                                        {stat.label}
                                    </Text>
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Text
                                            fontSize="3xl"
                                            fontWeight="bold"
                                            color={`${stat.color}.600`}
                                        >
                                            {stat.value}
                                        </Text>
                                    </motion.div>
                                    <Text fontSize="xs" color="gray.400">
                                        {stat.description}
                                    </Text>
                                </VStack>

                                {/* Progress bar animation */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    style={{ width: "100%" }}
                                >
                                    <Progress
                                        value={Math.random() * 100}
                                        size="sm"
                                        colorScheme={stat.color}
                                        borderRadius="full"
                                        bg={`${stat.color}.50`}
                                    />
                                </motion.div>
                            </VStack>
                        </Box>
                    </motion.div>
                ))}
            </Grid>
        </motion.div>
    );
};

export default DashboardStats;

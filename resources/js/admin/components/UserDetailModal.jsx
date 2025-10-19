import React from "react";
import { motion } from "framer-motion";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Box,
    Avatar,
    Badge,
    Divider,
    useColorModeValue,
    SimpleGrid,
    Card,
    CardBody,
    Icon,
    Flex,
} from "@chakra-ui/react";
import {
    User,
    Mail,
    Calendar,
    Clock,
    Activity,
    Shield,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

const UserDetailModal = ({ isOpen, onClose, user }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const cardBg = useColorModeValue("gray.50", "gray.700");

    if (!user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
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

    const getStatusColor = (user) => {
        const now = new Date();
        const lastLogin = new Date(user.last_login_at || user.created_at);
        const diffInDays = Math.floor(
            (now - lastLogin) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays <= 1) return "green";
        if (diffInDays <= 7) return "yellow";
        return "red";
    };

    const getStatusText = (user) => {
        const now = new Date();
        const lastLogin = new Date(user.last_login_at || user.created_at);
        const diffInDays = Math.floor(
            (now - lastLogin) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays <= 1) return "Aktif";
        if (diffInDays <= 7) return "Kurang Aktif";
        return "Tidak Aktif";
    };

    const getStatusIcon = (user) => {
        const now = new Date();
        const lastLogin = new Date(user.last_login_at || user.created_at);
        const diffInDays = Math.floor(
            (now - lastLogin) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays <= 1) return <CheckCircle size={16} />;
        if (diffInDays <= 7) return <AlertCircle size={16} />;
        return <XCircle size={16} />;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent bg={bgColor} border="1px" borderColor={borderColor}>
                <ModalHeader>
                    <HStack spacing={3}>
                        <Avatar
                            size="md"
                            name={user.name}
                            bg="blue.500"
                            color="white"
                        />
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Detail Pengguna
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Informasi lengkap pengguna
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Status Card */}
                        <Card
                            bg={cardBg}
                            border="1px"
                            borderColor={borderColor}
                        >
                            <CardBody>
                                <HStack spacing={4} align="center">
                                    <Box
                                        p={3}
                                        bg={`${getStatusColor(user)}.100`}
                                        borderRadius="xl"
                                        color={`${getStatusColor(user)}.600`}
                                    >
                                        {getStatusIcon(user)}
                                    </Box>
                                    <VStack align="start" spacing={1}>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="bold"
                                            color={textColor}
                                        >
                                            Status: {getStatusText(user)}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Terakhir aktif:{" "}
                                            {formatTimeAgo(
                                                user.last_login_at ||
                                                    user.created_at
                                            )}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </CardBody>
                        </Card>

                        {/* User Information */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Card
                                bg={cardBg}
                                border="1px"
                                borderColor={borderColor}
                            >
                                <CardBody>
                                    <VStack align="start" spacing={3}>
                                        <HStack spacing={3}>
                                            <Box
                                                p={2}
                                                bg="blue.100"
                                                borderRadius="lg"
                                                color="blue.600"
                                            >
                                                <User size={16} />
                                            </Box>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="bold"
                                                color={textColor}
                                            >
                                                Informasi Pribadi
                                            </Text>
                                        </HStack>
                                        <VStack
                                            align="start"
                                            spacing={2}
                                            w="full"
                                        >
                                            <Box w="full">
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Nama Lengkap
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color={textColor}
                                                    fontWeight="medium"
                                                >
                                                    {user.name}
                                                </Text>
                                            </Box>
                                            <Box w="full">
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Email
                                                </Text>
                                                <HStack spacing={2}>
                                                    <Mail
                                                        size={14}
                                                        color="gray.400"
                                                    />
                                                    <Text
                                                        fontSize="sm"
                                                        color={textColor}
                                                    >
                                                        {user.email}
                                                    </Text>
                                                </HStack>
                                            </Box>
                                            <Box w="full">
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    ID Pengguna
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color={textColor}
                                                    fontFamily="mono"
                                                >
                                                    #{user.id}
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </VStack>
                                </CardBody>
                            </Card>

                            <Card
                                bg={cardBg}
                                border="1px"
                                borderColor={borderColor}
                            >
                                <CardBody>
                                    <VStack align="start" spacing={3}>
                                        <HStack spacing={3}>
                                            <Box
                                                p={2}
                                                bg="green.100"
                                                borderRadius="lg"
                                                color="green.600"
                                            >
                                                <Calendar size={16} />
                                            </Box>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="bold"
                                                color={textColor}
                                            >
                                                Informasi Akun
                                            </Text>
                                        </HStack>
                                        <VStack
                                            align="start"
                                            spacing={2}
                                            w="full"
                                        >
                                            <Box w="full">
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Tanggal Daftar
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color={textColor}
                                                >
                                                    {formatDate(
                                                        user.created_at
                                                    )}
                                                </Text>
                                            </Box>
                                            <Box w="full">
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Terakhir Update
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color={textColor}
                                                >
                                                    {formatDate(
                                                        user.updated_at
                                                    )}
                                                </Text>
                                            </Box>
                                            <Box w="full">
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    mb={1}
                                                >
                                                    Role
                                                </Text>
                                                <Badge
                                                    colorScheme="blue"
                                                    variant="subtle"
                                                    fontSize="xs"
                                                >
                                                    {user.role || "User"}
                                                </Badge>
                                            </Box>
                                        </VStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </SimpleGrid>

                        {/* Activity Information */}
                        <Card
                            bg={cardBg}
                            border="1px"
                            borderColor={borderColor}
                        >
                            <CardBody>
                                <VStack align="start" spacing={3}>
                                    <HStack spacing={3}>
                                        <Box
                                            p={2}
                                            bg="purple.100"
                                            borderRadius="lg"
                                            color="purple.600"
                                        >
                                            <Activity size={16} />
                                        </Box>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color={textColor}
                                        >
                                            Aktivitas Terakhir
                                        </Text>
                                    </HStack>
                                    <SimpleGrid
                                        columns={{ base: 1, md: 2 }}
                                        spacing={4}
                                        w="full"
                                    >
                                        <Box>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                mb={1}
                                            >
                                                Terakhir Login
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color={textColor}
                                            >
                                                {user.last_login_at
                                                    ? formatDate(
                                                          user.last_login_at
                                                      )
                                                    : "Belum pernah login"}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                mb={1}
                                            >
                                                Status Akun
                                            </Text>
                                            <Badge
                                                colorScheme={
                                                    user.status === "active"
                                                        ? "green"
                                                        : "red"
                                                }
                                                variant="subtle"
                                                fontSize="xs"
                                            >
                                                {user.status === "active"
                                                    ? "Aktif"
                                                    : "Tidak Aktif"}
                                            </Badge>
                                        </Box>
                                    </SimpleGrid>
                                </VStack>
                            </CardBody>
                        </Card>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UserDetailModal;

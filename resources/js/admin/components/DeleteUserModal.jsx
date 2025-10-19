import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    useToast,
    Box,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Avatar,
    Badge,
    Divider,
} from "@chakra-ui/react";
import { Trash2, X, AlertTriangle, User, Mail, Calendar } from "lucide-react";

const DeleteUserModal = ({ isOpen, onClose, user, onUserDeleted }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const toast = useToast();

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDelete = async () => {
        if (confirmText !== "HAPUS") {
            toast({
                title: "Konfirmasi Gagal",
                description: "Silakan ketik 'HAPUS' untuk mengkonfirmasi",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);

        try {
            // API call untuk menghapus pengguna
            const response = await fetch(`/users/${user.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                toast({
                    title: "Pengguna Berhasil Dihapus",
                    description: `${user.name} telah dihapus dari sistem`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });

                // Callback untuk update data di parent component
                if (onUserDeleted) {
                    onUserDeleted(user);
                }

                handleClose();
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Gagal menghapus pengguna"
                );
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                title: "Error",
                description: error.message || "Gagal menghapus pengguna",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setConfirmText("");
            onClose();
        }
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg={bgColor} border="1px" borderColor={borderColor}>
                <ModalHeader>
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            bg="red.100"
                            borderRadius="lg"
                            color="red.600"
                        >
                            <Trash2 size={20} />
                        </Box>
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Hapus Pengguna
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Tindakan ini tidak dapat dibatalkan
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        {/* Warning Alert */}
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle fontSize="sm">
                                    Peringatan!
                                </AlertTitle>
                                <AlertDescription fontSize="xs">
                                    Tindakan ini akan menghapus pengguna secara
                                    permanen. Semua data terkait pengguna ini
                                    akan hilang.
                                </AlertDescription>
                            </Box>
                        </Alert>

                        {/* User Information */}
                        <Box
                            p={4}
                            bg="red.50"
                            borderRadius="md"
                            border="1px"
                            borderColor="red.200"
                        >
                            <VStack align="start" spacing={3}>
                                <HStack spacing={3}>
                                    <Avatar
                                        size="md"
                                        name={user.name}
                                        bg="red.500"
                                        color="white"
                                    />
                                    <VStack align="start" spacing={1}>
                                        <Text
                                            fontSize="md"
                                            fontWeight="bold"
                                            color="red.700"
                                        >
                                            {user.name}
                                        </Text>
                                        <Text fontSize="sm" color="red.600">
                                            {user.email}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <Divider />

                                <VStack align="start" spacing={2} w="full">
                                    <HStack
                                        spacing={4}
                                        fontSize="sm"
                                        color="red.600"
                                    >
                                        <HStack spacing={1}>
                                            <User size={14} />
                                            <Text>ID: #{user.id}</Text>
                                        </HStack>
                                        <HStack spacing={1}>
                                            <Mail size={14} />
                                            <Text>
                                                Role: {user.role || "User"}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                    <HStack
                                        spacing={1}
                                        fontSize="sm"
                                        color="red.600"
                                    >
                                        <Calendar size={14} />
                                        <Text>
                                            Bergabung:{" "}
                                            {formatDate(user.created_at)}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>

                        {/* Confirmation Input */}
                        <Box
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                            border="1px"
                            borderColor="gray.200"
                        >
                            <VStack align="start" spacing={2}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={textColor}
                                >
                                    Untuk mengkonfirmasi, ketik{" "}
                                    <strong>HAPUS</strong> di bawah ini:
                                </Text>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) =>
                                        setConfirmText(e.target.value)
                                    }
                                    placeholder="Ketik HAPUS"
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        backgroundColor: "white",
                                    }}
                                />
                            </VStack>
                        </Box>

                        {/* Impact Information */}
                        <Box
                            p={3}
                            bg="orange.50"
                            borderRadius="md"
                            border="1px"
                            borderColor="orange.200"
                        >
                            <VStack align="start" spacing={2}>
                                <Text
                                    fontSize="xs"
                                    color="orange.700"
                                    fontWeight="medium"
                                >
                                    Dampak Penghapusan:
                                </Text>
                                <VStack
                                    align="start"
                                    spacing={1}
                                    fontSize="xs"
                                    color="orange.600"
                                >
                                    <Text>
                                        • Akun pengguna akan dihapus permanen
                                    </Text>
                                    <Text>
                                        • Semua data pribadi akan hilang
                                    </Text>
                                    <Text>• Tidak dapat diakses lagi</Text>
                                </VStack>
                            </VStack>
                        </Box>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3}>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            isDisabled={isLoading}
                            leftIcon={<X size={16} />}
                            size="sm"
                        >
                            Batal
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleDelete}
                            isLoading={isLoading}
                            loadingText="Menghapus..."
                            leftIcon={<Trash2 size={16} />}
                            size="sm"
                            isDisabled={confirmText !== "HAPUS"}
                        >
                            Hapus Pengguna
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteUserModal;

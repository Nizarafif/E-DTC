import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    HStack,
    Text,
    useColorModeValue,
    useToast,
    Box,
    Badge,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Divider,
} from "@chakra-ui/react";
import { Tag, Trash2, AlertTriangle, BookOpen } from "lucide-react";

const DeleteCategoryModal = ({
    isOpen,
    onClose,
    category,
    onCategoryDeleted,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const toast = useToast();

    const handleDelete = async () => {
        if (!category) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/categories/${category.id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Gagal menghapus kategori"
                );
            }

            onCategoryDeleted(category.id);
            onClose();

            toast({
                title: "Berhasil",
                description: "Kategori berhasil dihapus",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!category) return null;

    const hasBooks = category.books_count && category.books_count > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg={bgColor} borderRadius="2xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
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
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                        Hapus Kategori
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Konfirmasi penghapusan kategori
                                    </Text>
                                </VStack>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />

                    <ModalBody pb={6}>
                            <VStack spacing={6} align="stretch">
                                {/* Warning Alert */}
                            <Alert status="warning" borderRadius="lg">
                                <AlertIcon />
                                    <Box>
                                    <AlertTitle fontSize="sm">
                                        Peringatan!
                                        </AlertTitle>
                                    <AlertDescription fontSize="sm">
                                        Tindakan ini tidak dapat dibatalkan.
                                        Kategori akan dihapus secara permanen.
                                        </AlertDescription>
                                    </Box>
                                </Alert>

                                {/* Category Info */}
                                <Box
                                    p={4}
                                bg={`${category.color || "blue"}.50`}
                                borderRadius="xl"
                                    border="1px"
                                borderColor={`${category.color || "blue"}.200`}
                            >
                                <HStack spacing={3}>
                                    <Box
                                        p={3}
                                        bg={`${category.color || "blue"}.100`}
                                        borderRadius="xl"
                                        color={`${
                                            category.color || "blue"
                                        }.600`}
                                            >
                                                <Tag size={24} />
                                            </Box>
                                    <VStack align="start" spacing={1} flex={1}>
                                                <Text
                                                    fontWeight="bold"
                                                    color={textColor}
                                            fontSize="lg"
                                                >
                                                    {category.name}
                                                </Text>
                                            {category.description && (
                                                <Text
                                                    fontSize="sm"
                                                color="gray.600"
                                                    noOfLines={2}
                                                >
                                                    {category.description}
                                                </Text>
                                            )}
                                        <HStack spacing={2}>
                                            <Badge
                                                colorScheme={
                                                    category.color || "blue"
                                                }
                                                variant="subtle"
                                                fontSize="xs"
                                            >
                                                {category.color || "blue"}
                                            </Badge>
                                                <Badge
                                                colorScheme={
                                                    category.status === "active"
                                                        ? "green"
                                                        : "gray"
                                                }
                                                    variant="subtle"
                                                    fontSize="xs"
                                                >
                                                {category.status === "active"
                                                    ? "Aktif"
                                                    : "Tidak Aktif"}
                                                </Badge>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </Box>

                            {/* Books Count Warning */}
                            {hasBooks && (
                                <Alert status="error" borderRadius="lg">
                                    <AlertIcon />
                                    <Box>
                                        <AlertTitle fontSize="sm">
                                            Tidak Dapat Dihapus!
                                        </AlertTitle>
                                        <AlertDescription fontSize="sm">
                                            Kategori ini memiliki{" "}
                                            {category.books_count} buku. Hapus
                                            atau pindahkan semua buku terlebih
                                            dahulu sebelum menghapus kategori.
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            )}

                                {/* Confirmation Text */}
                            <Box textAlign="center">
                                <Text fontSize="sm" color="gray.600">
                                    Apakah Anda yakin ingin menghapus kategori{" "}
                                            <Text
                                        as="span"
                                        fontWeight="bold"
                                                color={textColor}
                                            >
                                        "{category.name}"
                                    </Text>{" "}
                                    ?
                                            </Text>
                                    </Box>
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <HStack spacing={3}>
                                <Button
                                variant="outline"
                                    onClick={onClose}
                                isDisabled={isLoading}
                                >
                                Batal
                                </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={handleDelete}
                                        isLoading={isLoading}
                                        loadingText="Menghapus..."
                                        leftIcon={<Trash2 size={16} />}
                                isDisabled={hasBooks}
                                    >
                                {hasBooks
                                    ? "Tidak Dapat Dihapus"
                                    : "Hapus Kategori"}
                                    </Button>
                            </HStack>
                        </ModalFooter>
                </motion.div>
                    </ModalContent>
                </Modal>
    );
};

export default DeleteCategoryModal;

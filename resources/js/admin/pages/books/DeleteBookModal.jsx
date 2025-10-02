import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Box,
    Text,
    Image,
    useColorModeValue,
    useToast,
    Divider,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { Trash2, AlertTriangle, BookOpen } from "lucide-react";

const DeleteBookModal = ({ isOpen, onClose, book, onBookDeleted }) => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const alertBgColor = useColorModeValue("orange.50", "orange.900");
    const alertBorderColor = useColorModeValue("orange.200", "orange.700");
    const bookInfoBgColor = useColorModeValue("gray.50", "gray.700");

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            // Send delete request to API
            const response = await fetch(`/books/${book.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal menghapus buku");
            }

            toast({
                title: "Berhasil",
                description: "Buku berhasil dihapus dari database",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Callback to parent component
            if (onBookDeleted) {
                onBookDeleted(book.id);
            }

            onClose();
        } catch (error) {
            console.error("Error deleting book:", error);
            toast({
                title: "Error",
                description: error.message || "Gagal menghapus buku",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && book && (
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    size="md"
                    closeOnOverlayClick={false}
                >
                    <ModalOverlay
                        bg="blackAlpha.600"
                        backdropFilter="blur(10px)"
                    />
                    <ModalContent
                        as={motion.div}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        bg={bgColor}
                        borderRadius="2xl"
                        border="1px"
                        borderColor={borderColor}
                        shadow="2xl"
                    >
                        <ModalHeader pb={2}>
                            <HStack spacing={3}>
                                <Box
                                    p={2}
                                    bg="red.100"
                                    borderRadius="lg"
                                    color="red.600"
                                >
                                    <Trash2 size={20} />
                                </Box>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="xl" fontWeight="bold">
                                        Hapus Buku
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Konfirmasi penghapusan buku
                                    </Text>
                                </VStack>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />

                        <Divider />

                        <ModalBody py={6}>
                            <VStack spacing={6} align="stretch">
                                {/* Warning Alert */}
                                <Alert
                                    status="warning"
                                    borderRadius="lg"
                                    bg={alertBgColor}
                                    border="1px"
                                    borderColor={alertBorderColor}
                                >
                                    <AlertIcon color="orange.500" />
                                    <Box>
                                        <AlertTitle
                                            fontSize="sm"
                                            color="orange.700"
                                        >
                                            Peringatan!
                                        </AlertTitle>
                                        <AlertDescription
                                            fontSize="sm"
                                            color="orange.600"
                                        >
                                            Tindakan ini tidak dapat dibatalkan.
                                            Semua data buku akan hilang secara
                                            permanen.
                                        </AlertDescription>
                                    </Box>
                                </Alert>

                                {/* Book Info */}
                                <Box
                                    p={4}
                                    bg={bookInfoBgColor}
                                    borderRadius="lg"
                                    border="1px"
                                    borderColor={borderColor}
                                >
                                    <HStack spacing={4}>
                                        {book.cover &&
                                        book.cover !==
                                            "/images/Image-Cover Buku.svg" ? (
                                            <Image
                                                src={book.cover}
                                                alt={book.title}
                                                w="60px"
                                                h="80px"
                                                objectFit="cover"
                                                borderRadius="md"
                                                shadow="sm"
                                            />
                                        ) : (
                                            <Box
                                                w="60px"
                                                h="80px"
                                                bg="gray.200"
                                                borderRadius="md"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <BookOpen
                                                    size={24}
                                                    color="gray.400"
                                                />
                                            </Box>
                                        )}
                                        <VStack
                                            align="start"
                                            spacing={1}
                                            flex={1}
                                        >
                                            <Text
                                                fontSize="md"
                                                fontWeight="bold"
                                                color={textColor}
                                                noOfLines={2}
                                            >
                                                {book.title}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                            >
                                                oleh {book.author}
                                            </Text>
                                            <HStack spacing={2}>
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.400"
                                                >
                                                    Kategori:
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    color="teal.600"
                                                    fontWeight="500"
                                                >
                                                    {book.category}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </Box>

                                {/* Confirmation Text */}
                                <Box textAlign="center" py={2}>
                                    <VStack spacing={2}>
                                        <Box
                                            p={3}
                                            bg="red.100"
                                            borderRadius="full"
                                            color="red.600"
                                        >
                                            <AlertTriangle size={24} />
                                        </Box>
                                        <Text
                                            fontSize="md"
                                            fontWeight="600"
                                            color={textColor}
                                        >
                                            Apakah Anda yakin ingin menghapus
                                            buku ini?
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            color="gray.500"
                                            maxW="300px"
                                        >
                                            Buku "{book.title}" akan dihapus
                                            secara permanen dari sistem.
                                        </Text>
                                    </VStack>
                                </Box>
                            </VStack>
                        </ModalBody>

                        <Divider />

                        <ModalFooter>
                            <HStack spacing={3}>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Batal
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={handleDelete}
                                    isLoading={isLoading}
                                    loadingText="Menghapus..."
                                    leftIcon={<Trash2 size={16} />}
                                >
                                    Hapus Buku
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default DeleteBookModal;

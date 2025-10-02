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
    Badge,
} from "@chakra-ui/react";
import { Trash2, AlertTriangle, Tag, BookOpen } from "lucide-react";

const DeleteCategoryModal = ({
    isOpen,
    onClose,
    category,
    onCategoryDeleted,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            // Simulasi API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Berhasil",
                description: "Kategori berhasil dihapus",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Callback to parent component
            if (onCategoryDeleted) {
                onCategoryDeleted(category.id);
            }

            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal menghapus kategori",
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

    if (!category) return null;

    const hasBooks = category.booksCount > 0;

    return (
        <AnimatePresence>
            {isOpen && (
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
                                        Hapus Kategori
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Konfirmasi penghapusan kategori
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
                                    status={hasBooks ? "error" : "warning"}
                                    borderRadius="lg"
                                    bg={useColorModeValue(
                                        hasBooks ? "red.50" : "orange.50",
                                        hasBooks ? "red.900" : "orange.900"
                                    )}
                                    border="1px"
                                    borderColor={useColorModeValue(
                                        hasBooks ? "red.200" : "orange.200",
                                        hasBooks ? "red.700" : "orange.700"
                                    )}
                                >
                                    <AlertIcon
                                        color={
                                            hasBooks ? "red.500" : "orange.500"
                                        }
                                    />
                                    <Box>
                                        <AlertTitle
                                            fontSize="sm"
                                            color={
                                                hasBooks
                                                    ? "red.700"
                                                    : "orange.700"
                                            }
                                        >
                                            {hasBooks
                                                ? "Tidak Dapat Dihapus!"
                                                : "Peringatan!"}
                                        </AlertTitle>
                                        <AlertDescription
                                            fontSize="sm"
                                            color={
                                                hasBooks
                                                    ? "red.600"
                                                    : "orange.600"
                                            }
                                        >
                                            {hasBooks
                                                ? `Kategori ini memiliki ${category.booksCount} buku. Pindahkan atau hapus buku terlebih dahulu.`
                                                : "Tindakan ini tidak dapat dibatalkan. Kategori akan dihapus secara permanen."}
                                        </AlertDescription>
                                    </Box>
                                </Alert>

                                {/* Category Info */}
                                <Box
                                    p={4}
                                    bg={useColorModeValue(
                                        "gray.50",
                                        "gray.700"
                                    )}
                                    borderRadius="lg"
                                    border="1px"
                                    borderColor={borderColor}
                                >
                                    <HStack spacing={4}>
                                        {category.icon ? (
                                            <Image
                                                src={category.icon}
                                                alt={category.name}
                                                w="60px"
                                                h="60px"
                                                objectFit="cover"
                                                borderRadius="lg"
                                                shadow="sm"
                                            />
                                        ) : (
                                            <Box
                                                w="60px"
                                                h="60px"
                                                bg={`${category.color}.100`}
                                                borderRadius="lg"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                color={`${category.color}.600`}
                                            >
                                                <Tag size={24} />
                                            </Box>
                                        )}
                                        <VStack
                                            align="start"
                                            spacing={2}
                                            flex={1}
                                        >
                                            <HStack spacing={2} align="center">
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color={textColor}
                                                >
                                                    {category.name}
                                                </Text>
                                                <Badge
                                                    colorScheme={
                                                        category.status ===
                                                        "active"
                                                            ? "green"
                                                            : "gray"
                                                    }
                                                    variant="subtle"
                                                    borderRadius="md"
                                                    fontSize="xs"
                                                >
                                                    {category.status ===
                                                    "active"
                                                        ? "Aktif"
                                                        : "Tidak Aktif"}
                                                </Badge>
                                            </HStack>
                                            {category.description && (
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                    noOfLines={2}
                                                >
                                                    {category.description}
                                                </Text>
                                            )}
                                            <HStack spacing={4} fontSize="sm">
                                                <HStack spacing={1}>
                                                    <BookOpen
                                                        size={14}
                                                        color="gray.400"
                                                    />
                                                    <Text color="gray.500">
                                                        {category.booksCount ||
                                                            0}{" "}
                                                        buku
                                                    </Text>
                                                </HStack>
                                                <Badge
                                                    colorScheme={category.color}
                                                    variant="subtle"
                                                    fontSize="xs"
                                                >
                                                    {category.color}
                                                </Badge>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </Box>

                                {/* Confirmation Text */}
                                {!hasBooks && (
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
                                                Apakah Anda yakin ingin
                                                menghapus kategori ini?
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                                maxW="300px"
                                            >
                                                Kategori "{category.name}" akan
                                                dihapus secara permanen dari
                                                sistem.
                                            </Text>
                                        </VStack>
                                    </Box>
                                )}
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
                                    {hasBooks ? "Tutup" : "Batal"}
                                </Button>
                                {!hasBooks && (
                                    <Button
                                        colorScheme="red"
                                        onClick={handleDelete}
                                        isLoading={isLoading}
                                        loadingText="Menghapus..."
                                        leftIcon={<Trash2 size={16} />}
                                    >
                                        Hapus Kategori
                                    </Button>
                                )}
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default DeleteCategoryModal;

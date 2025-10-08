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
    Input,
    Textarea,
    Select,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useColorModeValue,
    useToast,
    Box,
    SimpleGrid,
    Badge,
    IconButton,
    Tooltip,
    Divider,
} from "@chakra-ui/react";
import { Tag, Palette, Upload, X, Check } from "lucide-react";

const AddCategoryModal = ({
    isOpen,
    onClose,
    onCategoryAdded,
    colorOptions,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "blue",
        status: "active",
        icon: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const toast = useToast();

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Nama kategori wajib diisi";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Nama kategori minimal 2 karakter";
        }

        if (formData.description && formData.description.length > 200) {
            newErrors.description = "Deskripsi maksimal 200 karakter";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal menambah kategori");
            }

            const newCategory = await response.json();
            onCategoryAdded(newCategory);

            // Reset form
            setFormData({
                name: "",
                description: "",
                color: "blue",
                status: "active",
                icon: "",
            });
            setErrors({});
            onClose();

            toast({
                title: "Berhasil",
                description: "Kategori berhasil ditambahkan",
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

    const handleClose = () => {
        setFormData({
            name: "",
            description: "",
            color: "blue",
            status: "active",
            icon: "",
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
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
                                bg="blue.100"
                                    borderRadius="lg"
                                color="blue.600"
                                >
                                    <Tag size={20} />
                                </Box>
                            <VStack align="start" spacing={1}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                        Tambah Kategori Baru
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                    Buat kategori baru untuk mengorganisir buku
                                    </Text>
                                </VStack>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />

                    <ModalBody pb={6}>
                            <form onSubmit={handleSubmit}>
                            <VStack spacing={6} align="stretch">
                                {/* Basic Information */}
                                <Box>
                                                        <Text
                                        fontSize="lg"
                                        fontWeight="semibold"
                                                            color={textColor}
                                        mb={4}
                                    >
                                        Informasi Dasar
                                                        </Text>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl isInvalid={!!errors.name}>
                                            <FormLabel
                                                fontSize="sm"
                                                fontWeight="medium"
                                                color={textColor}
                                            >
                                                Nama Kategori *
                                            </FormLabel>
                                            <Input
                                                placeholder="Masukkan nama kategori"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                borderRadius="lg"
                                                _focus={{
                                                    borderColor: "blue.500",
                                                    boxShadow:
                                                        "0 0 0 1px blue.500",
                                                }}
                                            />
                                            <FormErrorMessage>
                                                {errors.name}
                                            </FormErrorMessage>
                                        </FormControl>

                                        <FormControl
                                            isInvalid={!!errors.description}
                                        >
                                            <FormLabel
                                                fontSize="sm"
                                                fontWeight="medium"
                                                color={textColor}
                                            >
                                                Deskripsi
                                            </FormLabel>
                                            <Textarea
                                                placeholder="Masukkan deskripsi kategori (opsional)"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows={3}
                                                resize="vertical"
                                                borderRadius="lg"
                                                _focus={{
                                                    borderColor: "blue.500",
                                                    boxShadow:
                                                        "0 0 0 1px blue.500",
                                                }}
                                            />
                                            <FormErrorMessage>
                                                {errors.description}
                                            </FormErrorMessage>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                textAlign="right"
                                            >
                                                {formData.description.length}
                                                /200 karakter
                                            </Text>
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <Divider />

                                {/* Appearance */}
                                <Box>
                                    <Text
                                        fontSize="lg"
                                        fontWeight="semibold"
                                        color={textColor}
                                        mb={4}
                                    >
                                        Tampilan
                                    </Text>
                                    <VStack spacing={4} align="stretch">
                                            <FormControl>
                                                <FormLabel
                                                    fontSize="sm"
                                                fontWeight="medium"
                                                color={textColor}
                                                >
                                                Warna Tema
                                                </FormLabel>
                                            <SimpleGrid columns={3} spacing={3}>
                                                {colorOptions.map((option) => (
                                                    <Box
                                                        key={option.value}
                                                        p={3}
                                                        border="2px"
                                                        borderColor={
                                                            formData.color ===
                                                            option.value
                                                                ? option.color
                                                                : borderColor
                                                        }
                                                    borderRadius="lg"
                                                        cursor="pointer"
                                                        onClick={() =>
                                                            handleInputChange(
                                                                "color",
                                                                option.value
                                                            )
                                                        }
                                                        _hover={{
                                                            borderColor:
                                                                option.color,
                                                            bg: `${option.value}.50`,
                                                        }}
                                                        transition="all 0.2s"
                                                        position="relative"
                                                    >
                                                        <VStack spacing={2}>
                                                            <Box
                                                                w="24px"
                                                                h="24px"
                                                                bg={
                                                                    option.color
                                                                }
                                                                borderRadius="md"
                                                            />
                                                            <Text
                                                                fontSize="xs"
                                                                fontWeight="medium"
                                                            >
                                                                {option.label}
                                                            </Text>
                                                            {formData.color ===
                                                                option.value && (
                                                                <Box
                                                                    position="absolute"
                                                                    top={1}
                                                                    right={1}
                                                                    bg="white"
                                                                    borderRadius="full"
                                                                    p={1}
                                                                    shadow="sm"
                                                                >
                                                                    <Check
                                                                        size={
                                                                            12
                                                                        }
                                                                        color="green"
                                                                    />
                                                                </Box>
                                                            )}
                                                        </VStack>
                                                    </Box>
                                                ))}
                                            </SimpleGrid>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel
                                                    fontSize="sm"
                                                fontWeight="medium"
                                                color={textColor}
                                                >
                                                    Status
                                                </FormLabel>
                                                <Select
                                                    value={formData.status}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                                    borderRadius="lg"
                                                    _focus={{
                                                    borderColor: "blue.500",
                                                        boxShadow:
                                                        "0 0 0 1px blue.500",
                                                    }}
                                                >
                                                    <option value="active">
                                                        Aktif
                                                    </option>
                                                    <option value="inactive">
                                                        Tidak Aktif
                                                    </option>
                                                </Select>
                                            </FormControl>
                                    </VStack>
                                </Box>

                                <Divider />

                                {/* Preview */}
                                <Box>
                                    <Text
                                        fontSize="lg"
                                        fontWeight="semibold"
                                        color={textColor}
                                        mb={4}
                                    >
                                        Preview
                                    </Text>
                                    <Box
                                        p={4}
                                        bg={`${formData.color || "blue"}.50`}
                                        borderRadius="xl"
                                        border="1px"
                                        borderColor={`${
                                            formData.color || "blue"
                                        }.200`}
                                    >
                                        <HStack spacing={3}>
                                            <Box
                                                p={3}
                                                bg={`${
                                                    formData.color || "blue"
                                                }.100`}
                                                borderRadius="xl"
                                                color={`${
                                                    formData.color || "blue"
                                                }.600`}
                                            >
                                                <Tag size={24} />
                                            </Box>
                                            <VStack
                                                align="start"
                                                spacing={1}
                                                flex={1}
                                            >
                                                <Text
                                                    fontWeight="bold"
                                                    color={textColor}
                                                    fontSize="lg"
                                                >
                                                    {formData.name ||
                                                        "Nama Kategori"}
                                                </Text>
                                                {formData.description && (
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.600"
                                                        noOfLines={2}
                                                    >
                                                        {formData.description}
                                                    </Text>
                                                )}
                                                <HStack spacing={2}>
                                                    <Badge
                                                        colorScheme={
                                                            formData.color ||
                                                            "blue"
                                                        }
                                                        variant="subtle"
                                                        fontSize="xs"
                                                    >
                                                        {formData.color ||
                                                            "blue"}
                                                    </Badge>
                                                    <Badge
                                                        colorScheme={
                                                            formData.status ===
                                                            "active"
                                                                ? "green"
                                                                : "gray"
                                                        }
                                                        variant="subtle"
                                                        fontSize="xs"
                                                    >
                                                        {formData.status ===
                                                        "active"
                                                            ? "Aktif"
                                                            : "Tidak Aktif"}
                                                    </Badge>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                </Box>
                                </VStack>
                            </form>
                        </ModalBody>

                        <ModalFooter>
                            <HStack spacing={3}>
                                <Button
                                variant="outline"
                                onClick={handleClose}
                                isDisabled={isLoading}
                                >
                                    Batal
                                </Button>
                                <Button
                                colorScheme="blue"
                                    onClick={handleSubmit}
                                    isLoading={isLoading}
                                    loadingText="Menyimpan..."
                                    leftIcon={<Tag size={16} />}
                                >
                                    Tambah Kategori
                                </Button>
                            </HStack>
                        </ModalFooter>
                </motion.div>
                    </ModalContent>
                </Modal>
    );
};

export default AddCategoryModal;

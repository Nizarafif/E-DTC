import React, { useState, useRef } from "react";
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
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    HStack,
    Box,
    Text,
    Image,
    useColorModeValue,
    useToast,
    Divider,
    Select,
} from "@chakra-ui/react";
import {
    Upload,
    Tag,
    FileText,
    Image as ImageIcon,
    X,
    Palette,
} from "lucide-react";

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "teal",
        status: "active",
    });
    const [iconImage, setIconImage] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");

    const colorOptions = [
        { value: "teal", label: "Teal", color: "teal.500" },
        { value: "blue", label: "Biru", color: "blue.500" },
        { value: "green", label: "Hijau", color: "green.500" },
        { value: "purple", label: "Ungu", color: "purple.500" },
        { value: "orange", label: "Oranye", color: "orange.500" },
        { value: "red", label: "Merah", color: "red.500" },
        { value: "pink", label: "Pink", color: "pink.500" },
        { value: "yellow", label: "Kuning", color: "yellow.500" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi file
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Error",
                    description: "File harus berupa gambar",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                // 2MB limit
                toast({
                    title: "Error",
                    description: "Ukuran file maksimal 2MB",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            setIconImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setIconPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setIconImage(null);
        setIconPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            color: "teal",
            status: "active",
        });
        setIconImage(null);
        setIconPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validasi form
            if (!formData.name) {
                toast({
                    title: "Error",
                    description: "Nama kategori wajib diisi",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setIsLoading(false);
                return;
            }

            // Simulasi API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create new category object
            const newCategory = {
                id: Date.now(), // Temporary ID
                ...formData,
                icon: iconPreview,
                createdAt: new Date().toISOString(),
                booksCount: 0,
            };

            toast({
                title: "Berhasil",
                description: "Kategori berhasil ditambahkan",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Callback to parent component
            if (onCategoryAdded) {
                onCategoryAdded(newCategory);
            }

            resetForm();
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal menambahkan kategori",
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
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    size="lg"
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
                                    bg="teal.100"
                                    borderRadius="lg"
                                    color="teal.600"
                                >
                                    <Tag size={20} />
                                </Box>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="xl" fontWeight="bold">
                                        Tambah Kategori Baru
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Buat kategori untuk mengorganisir buku
                                    </Text>
                                </VStack>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />

                        <Divider />

                        <ModalBody py={4}>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4} align="stretch">
                                    {/* Icon Upload */}
                                    <FormControl>
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="600"
                                            color={textColor}
                                        >
                                            <HStack spacing={2}>
                                                <ImageIcon size={16} />
                                                <Text>
                                                    Icon Kategori (Opsional)
                                                </Text>
                                            </HStack>
                                        </FormLabel>
                                        <Box
                                            border="2px"
                                            borderColor={
                                                iconPreview
                                                    ? "teal.300"
                                                    : borderColor
                                            }
                                            borderStyle="dashed"
                                            borderRadius="xl"
                                            p={3}
                                            textAlign="center"
                                            bg={useColorModeValue(
                                                "gray.50",
                                                "gray.700"
                                            )}
                                            cursor="pointer"
                                            transition="all 0.2s"
                                            _hover={{
                                                borderColor: "teal.400",
                                                bg: useColorModeValue(
                                                    "teal.50",
                                                    "gray.600"
                                                ),
                                            }}
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            {iconPreview ? (
                                                <HStack
                                                    spacing={4}
                                                    justify="center"
                                                >
                                                    <Box position="relative">
                                                        <Image
                                                            src={iconPreview}
                                                            alt="Icon preview"
                                                            w="50px"
                                                            h="50px"
                                                            objectFit="cover"
                                                            borderRadius="lg"
                                                            shadow="sm"
                                                        />
                                                        <Button
                                                            size="xs"
                                                            colorScheme="red"
                                                            variant="solid"
                                                            position="absolute"
                                                            top={-1}
                                                            right={-1}
                                                            borderRadius="full"
                                                            minW="auto"
                                                            h="20px"
                                                            w="20px"
                                                            p={0}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveImage();
                                                            }}
                                                        >
                                                            <X size={10} />
                                                        </Button>
                                                    </Box>
                                                    <VStack
                                                        spacing={1}
                                                        align="start"
                                                    >
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="600"
                                                            color={textColor}
                                                        >
                                                            Icon berhasil
                                                            dipilih
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                        >
                                                            Klik untuk mengganti
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            ) : (
                                                <HStack
                                                    spacing={3}
                                                    justify="center"
                                                >
                                                    <Box
                                                        p={3}
                                                        bg="teal.100"
                                                        borderRadius="lg"
                                                        color="teal.600"
                                                    >
                                                        <Upload size={20} />
                                                    </Box>
                                                    <VStack
                                                        spacing={0}
                                                        align="start"
                                                    >
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="600"
                                                            color={textColor}
                                                        >
                                                            Upload Icon
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                        >
                                                            PNG, JPG hingga 2MB
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            )}
                                            <Input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                display="none"
                                            />
                                        </Box>
                                    </FormControl>

                                    {/* Basic Information */}
                                    <VStack spacing={4} align="stretch">
                                        <FormControl isRequired>
                                            <FormLabel
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                <HStack spacing={2}>
                                                    <Tag size={16} />
                                                    <Text>Nama Kategori</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan nama kategori"
                                                borderRadius="lg"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow:
                                                        "0 0 0 1px teal.500",
                                                }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                <HStack spacing={2}>
                                                    <FileText size={16} />
                                                    <Text>Deskripsi</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Deskripsi singkat tentang kategori"
                                                rows={2}
                                                borderRadius="lg"
                                                _focus={{
                                                    borderColor: "teal.500",
                                                    boxShadow:
                                                        "0 0 0 1px teal.500",
                                                }}
                                            />
                                        </FormControl>

                                        <HStack spacing={4} align="start">
                                            <FormControl>
                                                <FormLabel
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                >
                                                    <HStack spacing={2}>
                                                        <Palette size={16} />
                                                        <Text>Warna Tema</Text>
                                                    </HStack>
                                                </FormLabel>
                                                <Select
                                                    name="color"
                                                    value={formData.color}
                                                    onChange={handleInputChange}
                                                    borderRadius="lg"
                                                    _focus={{
                                                        borderColor: "teal.500",
                                                        boxShadow:
                                                            "0 0 0 1px teal.500",
                                                    }}
                                                >
                                                    {colorOptions.map(
                                                        (option) => (
                                                            <option
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </option>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                >
                                                    Status
                                                </FormLabel>
                                                <Select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    borderRadius="lg"
                                                    _focus={{
                                                        borderColor: "teal.500",
                                                        boxShadow:
                                                            "0 0 0 1px teal.500",
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
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </form>
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
                                    colorScheme="teal"
                                    onClick={handleSubmit}
                                    isLoading={isLoading}
                                    loadingText="Menyimpan..."
                                    leftIcon={<Tag size={16} />}
                                >
                                    Tambah Kategori
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default AddCategoryModal;

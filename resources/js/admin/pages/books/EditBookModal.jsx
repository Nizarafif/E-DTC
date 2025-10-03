import React, { useState, useRef, useEffect } from "react";
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
    Select,
    VStack,
    HStack,
    Box,
    Text,
    Image,
    useColorModeValue,
    useToast,
    Divider,
} from "@chakra-ui/react";
import {
    Upload,
    BookOpen,
    User,
    Tag,
    FileText,
    Calendar,
    Image as ImageIcon,
    X,
    Edit3,
} from "lucide-react";

const EditBookModal = ({ isOpen, onClose, book, onBookUpdated }) => {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        description: "",
        publishDate: "",
        isbn: "",
        pages: "",
        language: "id",
        status: "draft",
    });
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const uploadBgColor = useColorModeValue("gray.50", "gray.700");
    const uploadHoverBgColor = useColorModeValue("blue.50", "gray.600");

    const categories = [
        "Teknologi",
        "Bisnis",
        "Pendidikan",
        "Kesehatan",
        "Seni & Desain",
        "Sains",
        "Sejarah",
        "Biografi",
        "Fiksi",
        "Non-Fiksi",
    ];

    // Populate form when book changes
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || "",
                author: book.author || "",
                category: book.category || "",
                description: book.description || "",
                publishDate: book.publishDate || "",
                isbn: book.isbn || "",
                pages: book.pages || "",
                language: book.language || "id",
                status: book.status || "draft",
            });
            setCoverPreview(book.coverImage || null);
        }
    }, [book]);

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

            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                toast({
                    title: "Error",
                    description: "Ukuran file maksimal 5MB",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            setCoverImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        setCoverPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validasi form
            if (!formData.title || !formData.author || !formData.category) {
                toast({
                    title: "Error",
                    description: "Judul, Penulis, dan Kategori wajib diisi",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setIsLoading(false);
                return;
            }

            // Simulasi API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create updated book object
            const updatedBook = {
                ...book,
                ...formData,
                coverImage: coverPreview,
                updatedAt: new Date().toISOString(),
            };

            toast({
                title: "Berhasil",
                description: "Buku berhasil diperbarui",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Callback to parent component
            if (onBookUpdated) {
                onBookUpdated(updatedBook);
            }

            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal memperbarui buku",
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
                    size="xl"
                    closeOnOverlayClick={false}
                    isCentered
                    scrollBehavior="inside"
                >
                    <ModalOverlay
                        bg="blackAlpha.500"
                        backdropFilter="blur(8px)"
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
                                    bg="blue.100"
                                    borderRadius="lg"
                                    color="blue.600"
                                >
                                    <Edit3 size={20} />
                                </Box>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="xl" fontWeight="bold">
                                        Edit Buku
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Perbarui informasi buku
                                    </Text>
                                </VStack>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />

                        <Divider />

                        <ModalBody py={4}>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4} align="stretch">
                                    {/* Cover Image Upload */}
                                    <FormControl>
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="600"
                                            color={textColor}
                                        >
                                            <HStack spacing={2}>
                                                <ImageIcon size={16} />
                                                <Text>Cover Buku</Text>
                                            </HStack>
                                        </FormLabel>
                                        <Box
                                            border="2px"
                                            borderColor={
                                                coverPreview
                                                    ? "blue.300"
                                                    : borderColor
                                            }
                                            borderStyle="dashed"
                                            borderRadius="xl"
                                            p={4}
                                            textAlign="center"
                                            bg={uploadBgColor}
                                            cursor="pointer"
                                            transition="all 0.2s"
                                            _hover={{
                                                borderColor: "blue.400",
                                                bg: uploadHoverBgColor,
                                            }}
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            {coverPreview ? (
                                                <VStack spacing={2}>
                                                    <Box position="relative">
                                                        <Image
                                                            src={coverPreview}
                                                            alt="Cover preview"
                                                            maxH="120px"
                                                            maxW="90px"
                                                            objectFit="cover"
                                                            borderRadius="lg"
                                                            shadow="md"
                                                        />
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="solid"
                                                            position="absolute"
                                                            top={-2}
                                                            right={-2}
                                                            borderRadius="full"
                                                            minW="auto"
                                                            h="24px"
                                                            w="24px"
                                                            p={0}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveImage();
                                                            }}
                                                        >
                                                            <X size={12} />
                                                        </Button>
                                                    </Box>
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.500"
                                                    >
                                                        Klik untuk mengganti
                                                        gambar
                                                    </Text>
                                                </VStack>
                                            ) : (
                                                <VStack spacing={4}>
                                                    <Box
                                                        p={4}
                                                        bg="blue.100"
                                                        borderRadius="full"
                                                        color="blue.600"
                                                    >
                                                        <Upload size={24} />
                                                    </Box>
                                                    <VStack spacing={1}>
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="600"
                                                            color={textColor}
                                                        >
                                                            Upload Cover Buku
                                                        </Text>
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray.500"
                                                        >
                                                            PNG, JPG hingga 5MB
                                                        </Text>
                                                    </VStack>
                                                </VStack>
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
                                    <Box>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="bold"
                                            mb={4}
                                            color={textColor}
                                        >
                                            Informasi Dasar
                                        </Text>
                                        <VStack spacing={4} align="stretch">
                                            <HStack spacing={4} align="start">
                                                <FormControl isRequired>
                                                    <FormLabel
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                    >
                                                        <HStack spacing={2}>
                                                            <BookOpen
                                                                size={16}
                                                            />
                                                            <Text>
                                                                Judul Buku
                                                            </Text>
                                                        </HStack>
                                                    </FormLabel>
                                                    <Input
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="Masukkan judul buku"
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor:
                                                                "blue.500",
                                                            boxShadow:
                                                                "0 0 0 1px blue.500",
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl isRequired>
                                                    <FormLabel
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                    >
                                                        <HStack spacing={2}>
                                                            <User size={16} />
                                                            <Text>Penulis</Text>
                                                        </HStack>
                                                    </FormLabel>
                                                    <Input
                                                        name="author"
                                                        value={formData.author}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="Nama penulis"
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor:
                                                                "blue.500",
                                                            boxShadow:
                                                                "0 0 0 1px blue.500",
                                                        }}
                                                    />
                                                </FormControl>
                                            </HStack>

                                            <FormControl isRequired>
                                                <FormLabel
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                >
                                                    <HStack spacing={2}>
                                                        <Tag size={16} />
                                                        <Text>Kategori</Text>
                                                    </HStack>
                                                </FormLabel>
                                                <Select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    placeholder="Pilih kategori"
                                                    borderRadius="lg"
                                                    _focus={{
                                                        borderColor: "blue.500",
                                                        boxShadow:
                                                            "0 0 0 1px blue.500",
                                                    }}
                                                >
                                                    {categories.map(
                                                        (category) => (
                                                            <option
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
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
                                                    <HStack spacing={2}>
                                                        <FileText size={16} />
                                                        <Text>Deskripsi</Text>
                                                    </HStack>
                                                </FormLabel>
                                                <Textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Deskripsi singkat tentang buku"
                                                    rows={4}
                                                    borderRadius="lg"
                                                    _focus={{
                                                        borderColor: "blue.500",
                                                        boxShadow:
                                                            "0 0 0 1px blue.500",
                                                    }}
                                                />
                                            </FormControl>
                                        </VStack>
                                    </Box>

                                    {/* Additional Information */}
                                    <Box>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="bold"
                                            mb={4}
                                            color={textColor}
                                        >
                                            Informasi Tambahan
                                        </Text>
                                        <VStack spacing={4} align="stretch">
                                            <HStack spacing={4} align="start">
                                                <FormControl>
                                                    <FormLabel
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                    >
                                                        ISBN
                                                    </FormLabel>
                                                    <Input
                                                        name="isbn"
                                                        value={formData.isbn}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="978-xxx-xxx-xxx-x"
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor:
                                                                "blue.500",
                                                            boxShadow:
                                                                "0 0 0 1px blue.500",
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                    >
                                                        Jumlah Halaman
                                                    </FormLabel>
                                                    <Input
                                                        name="pages"
                                                        type="number"
                                                        value={formData.pages}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="0"
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor:
                                                                "blue.500",
                                                            boxShadow:
                                                                "0 0 0 1px blue.500",
                                                        }}
                                                    />
                                                </FormControl>
                                            </HStack>

                                            <HStack spacing={4} align="start">
                                                <FormControl>
                                                    <FormLabel
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                    >
                                                        <HStack spacing={2}>
                                                            <Calendar
                                                                size={16}
                                                            />
                                                            <Text>
                                                                Tanggal Terbit
                                                            </Text>
                                                        </HStack>
                                                    </FormLabel>
                                                    <Input
                                                        name="publishDate"
                                                        type="date"
                                                        value={
                                                            formData.publishDate
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor:
                                                                "blue.500",
                                                            boxShadow:
                                                                "0 0 0 1px blue.500",
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                    >
                                                        Bahasa
                                                    </FormLabel>
                                                    <Select
                                                        name="language"
                                                        value={
                                                            formData.language
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor:
                                                                "blue.500",
                                                            boxShadow:
                                                                "0 0 0 1px blue.500",
                                                        }}
                                                    >
                                                        <option value="id">
                                                            Indonesia
                                                        </option>
                                                        <option value="en">
                                                            English
                                                        </option>
                                                        <option value="other">
                                                            Lainnya
                                                        </option>
                                                    </Select>
                                                </FormControl>
                                            </HStack>

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
                                                        borderColor: "blue.500",
                                                        boxShadow:
                                                            "0 0 0 1px blue.500",
                                                    }}
                                                >
                                                    <option value="draft">
                                                        Draft
                                                    </option>
                                                    <option value="review">
                                                        Review
                                                    </option>
                                                    <option value="published">
                                                        Terbit
                                                    </option>
                                                </Select>
                                            </FormControl>
                                        </VStack>
                                    </Box>
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
                                    colorScheme="blue"
                                    onClick={handleSubmit}
                                    isLoading={isLoading}
                                    loadingText="Menyimpan..."
                                    leftIcon={<Edit3 size={16} />}
                                >
                                    Perbarui Buku
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default EditBookModal;

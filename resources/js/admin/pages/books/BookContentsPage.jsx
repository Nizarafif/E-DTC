import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    useToast,
    InputGroup,
    InputLeftElement,
    Input,
    Select,
    Badge,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    IconButton,
    Tooltip,
    Flex,
    Spacer,
    Divider,
} from "@chakra-ui/react";
import {
    FileText,
    Plus,
    Search,
    Filter,
    BookOpen,
    Edit3,
    Trash2,
    Eye,
    MoreVertical,
    RefreshCw,
    Download,
    Calendar,
    User,
} from "lucide-react";

const BookContentsPage = () => {
    const [bookContents, setBookContents] = useState([]);
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBook, setFilterBook] = useState("");
    const [filterContentType, setFilterContentType] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [contentToDelete, setContentToDelete] = useState(null);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const toast = useToast();

    // Load data on mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch book contents
            const contentsResponse = await fetch("/book-contents");
            if (contentsResponse.ok) {
                const contentsData = await contentsResponse.json();
                setBookContents(contentsData || []);
            }

            // Fetch books
            const booksResponse = await fetch("/books");
            if (booksResponse.ok) {
                const booksData = await booksResponse.json();
                setBooks(booksData || []);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal mengambil data",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Filter book contents
    const filteredContents = bookContents.filter((content) => {
        const matchesSearch =
            !searchTerm ||
            content.chapter_title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (content.chapter_number &&
                content.chapter_number
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        const matchesBook =
            !filterBook || content.book_id.toString() === filterBook;
        const matchesContentType =
            !filterContentType || content.content_type === filterContentType;

        return matchesSearch && matchesBook && matchesContentType;
    });

    // Calculate stats
    const totalContents = bookContents.length;
    const editorContents = bookContents.filter(
        (content) => content.content_type === "editor"
    ).length;
    const pdfContents = bookContents.filter(
        (content) => content.content_type === "pdf"
    ).length;
    const totalBooks = books.length;

    // Event handlers
    const handleDeleteContent = (content) => {
        setContentToDelete(content);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!contentToDelete) return;

        try {
            const response = await fetch(
                `/book-contents/${contentToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Gagal menghapus isi buku");
            }

            setBookContents((prev) =>
                prev.filter((content) => content.id !== contentToDelete.id)
            );

            setIsDeleteModalOpen(false);
            setContentToDelete(null);

            toast({
                title: "Berhasil",
                description: "Isi buku berhasil dihapus",
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
        }
    };

    const handleViewContent = (content) => {
        // Navigate to tinjauan pustaka page
        window.open(`/tinjauan-pustaka/${content.book_id}`, "_blank");
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterBook("");
        setFilterContentType("");
    };

    const activeFiltersCount = [
        searchTerm,
        filterBook,
        filterContentType,
    ].filter(Boolean).length;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getBookTitle = (bookId) => {
        const book = books.find((b) => b.id === bookId);
        return book ? book.title : "Buku Tidak Ditemukan";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <VStack spacing={6} align="stretch">
                {/* Header Section */}
                <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="2xl"
                    border="1px"
                    borderColor={borderColor}
                    shadow="sm"
                >
                    <VStack spacing={6} align="stretch">
                        {/* Title and Actions */}
                        <Flex align="center" justify="space-between">
                            <HStack spacing={4}>
                                <Box
                                    p={3}
                                    bg="purple.100"
                                    borderRadius="xl"
                                    color="purple.600"
                                >
                                    <FileText size={24} />
                                </Box>
                                <VStack align="start" spacing={1}>
                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color={textColor}
                                    >
                                        Kelola Isi Buku
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Kelola dan hapus isi buku dari berbagai
                                        buku
                                    </Text>
                                </VStack>
                            </HStack>

                            <HStack spacing={3}>
                                <Button
                                    leftIcon={<RefreshCw size={16} />}
                                    variant="outline"
                                    onClick={fetchData}
                                    isLoading={isLoading}
                                >
                                    Refresh
                                </Button>
                            </HStack>
                        </Flex>

                        {/* Stats Cards */}
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                            <Box
                                bg={useColorModeValue(
                                    "purple.50",
                                    "purple.900"
                                )}
                                p={4}
                                borderRadius="xl"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "purple.200",
                                    "purple.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="purple.600">
                                        Total Isi Buku
                                    </StatLabel>
                                    <StatNumber
                                        fontSize="2xl"
                                        color="purple.600"
                                    >
                                        {totalContents}
                                    </StatNumber>
                                </Stat>
                            </Box>
                            <Box
                                bg={useColorModeValue("blue.50", "blue.900")}
                                p={4}
                                borderRadius="xl"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "blue.200",
                                    "blue.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="blue.600">
                                        Editor Content
                                    </StatLabel>
                                    <StatNumber fontSize="2xl" color="blue.600">
                                        {editorContents}
                                    </StatNumber>
                                </Stat>
                            </Box>
                            <Box
                                bg={useColorModeValue("red.50", "red.900")}
                                p={4}
                                borderRadius="xl"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "red.200",
                                    "red.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="red.600">
                                        PDF Content
                                    </StatLabel>
                                    <StatNumber fontSize="2xl" color="red.600">
                                        {pdfContents}
                                    </StatNumber>
                                </Stat>
                            </Box>
                            <Box
                                bg={useColorModeValue("green.50", "green.900")}
                                p={4}
                                borderRadius="xl"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "green.200",
                                    "green.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="green.600">
                                        Total Buku
                                    </StatLabel>
                                    <StatNumber
                                        fontSize="2xl"
                                        color="green.600"
                                    >
                                        {totalBooks}
                                    </StatNumber>
                                </Stat>
                            </Box>
                        </SimpleGrid>

                        {/* Search and Filters */}
                        <VStack spacing={4} align="stretch">
                            <HStack spacing={4} align="end">
                                {/* Search */}
                                <Box flex={1}>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <Search
                                                size={16}
                                                color="gray.400"
                                            />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Cari berdasarkan judul chapter atau nomor chapter..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            borderRadius="lg"
                                            _focus={{
                                                borderColor: "purple.500",
                                                boxShadow:
                                                    "0 0 0 1px purple.500",
                                            }}
                                        />
                                    </InputGroup>
                                </Box>

                                {/* Book Filter */}
                                <Select
                                    placeholder="Semua Buku"
                                    value={filterBook}
                                    onChange={(e) =>
                                        setFilterBook(e.target.value)
                                    }
                                    borderRadius="lg"
                                    maxW="200px"
                                >
                                    {books.map((book) => (
                                        <option key={book.id} value={book.id}>
                                            {book.title}
                                        </option>
                                    ))}
                                </Select>

                                {/* Content Type Filter */}
                                <Select
                                    placeholder="Semua Tipe"
                                    value={filterContentType}
                                    onChange={(e) =>
                                        setFilterContentType(e.target.value)
                                    }
                                    borderRadius="lg"
                                    maxW="150px"
                                >
                                    <option value="editor">Editor</option>
                                    <option value="pdf">PDF</option>
                                </Select>

                                {/* Clear Filters */}
                                {activeFiltersCount > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        leftIcon={<Filter size={16} />}
                                    >
                                        Clear ({activeFiltersCount})
                                    </Button>
                                )}
                            </HStack>

                            {/* Results Info */}
                            <Flex align="center" justify="space-between">
                                <Text fontSize="sm" color="gray.500">
                                    Menampilkan {filteredContents.length} dari{" "}
                                    {totalContents} isi buku
                                </Text>
                            </Flex>
                        </VStack>
                    </VStack>
                </Box>

                {/* Book Contents List */}
                <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="2xl"
                    border="1px"
                    borderColor={borderColor}
                    shadow="sm"
                >
                    {isLoading ? (
                        <VStack spacing={4} py={8}>
                            <Text>Memuat isi buku...</Text>
                        </VStack>
                    ) : filteredContents.length === 0 ? (
                        <VStack spacing={4} py={12}>
                            <Box
                                p={6}
                                bg="gray.100"
                                borderRadius="full"
                                color="gray.500"
                            >
                                <FileText size={48} />
                            </Box>
                            <VStack spacing={2}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    {searchTerm ||
                                    filterBook ||
                                    filterContentType
                                        ? "Tidak ada isi buku yang sesuai filter"
                                        : "Belum ada isi buku"}
                                </Text>
                                <Text
                                    color="gray.500"
                                    textAlign="center"
                                    maxW="400px"
                                >
                                    {searchTerm ||
                                    filterBook ||
                                    filterContentType
                                        ? "Coba ubah filter atau hapus filter untuk melihat semua isi buku"
                                        : "Mulai tambahkan isi buku pertama melalui halaman Kelola Konten"}
                                </Text>
                            </VStack>
                        </VStack>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {filteredContents.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Box
                                        p={4}
                                        bg={useColorModeValue(
                                            "gray.50",
                                            "gray.700"
                                        )}
                                        borderRadius="xl"
                                        border="1px"
                                        borderColor={borderColor}
                                        _hover={{
                                            shadow: "md",
                                            borderColor: "purple.300",
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <HStack
                                            justify="space-between"
                                            align="start"
                                        >
                                            <VStack
                                                align="start"
                                                spacing={2}
                                                flex={1}
                                            >
                                                <HStack spacing={3}>
                                                    <Box
                                                        p={2}
                                                        bg={
                                                            content.content_type ===
                                                            "pdf"
                                                                ? "red.100"
                                                                : "blue.100"
                                                        }
                                                        borderRadius="lg"
                                                        color={
                                                            content.content_type ===
                                                            "pdf"
                                                                ? "red.600"
                                                                : "blue.600"
                                                        }
                                                    >
                                                        {content.content_type ===
                                                        "pdf" ? (
                                                            <Download
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <FileText
                                                                size={16}
                                                            />
                                                        )}
                                                    </Box>
                                                    <VStack
                                                        align="start"
                                                        spacing={1}
                                                    >
                                                        <Text
                                                            fontSize="lg"
                                                            fontWeight="bold"
                                                            color={textColor}
                                                        >
                                                            {content.chapter_title ||
                                                                "Untitled"}
                                                        </Text>
                                                        <HStack spacing={2}>
                                                            <Badge
                                                                colorScheme={
                                                                    content.content_type ===
                                                                    "pdf"
                                                                        ? "red"
                                                                        : "blue"
                                                                }
                                                                variant="subtle"
                                                                fontSize="xs"
                                                            >
                                                                {content.content_type ===
                                                                "pdf"
                                                                    ? "PDF"
                                                                    : "Editor"}
                                                            </Badge>
                                                            {content.chapter_number && (
                                                                <Badge
                                                                    variant="outline"
                                                                    fontSize="xs"
                                                                >
                                                                    Chapter{" "}
                                                                    {
                                                                        content.chapter_number
                                                                    }
                                                                </Badge>
                                                            )}
                                                        </HStack>
                                                    </VStack>
                                                </HStack>

                                                <HStack
                                                    spacing={4}
                                                    fontSize="sm"
                                                    color="gray.500"
                                                >
                                                    <HStack spacing={1}>
                                                        <BookOpen size={14} />
                                                        <Text>
                                                            {getBookTitle(
                                                                content.book_id
                                                            )}
                                                        </Text>
                                                    </HStack>
                                                    <HStack spacing={1}>
                                                        <Calendar size={14} />
                                                        <Text>
                                                            {formatDate(
                                                                content.created_at
                                                            )}
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            </VStack>

                                            <HStack spacing={2}>
                                                <Tooltip label="Lihat di Tinjauan Pustaka">
                                                    <IconButton
                                                        size="sm"
                                                        variant="outline"
                                                        colorScheme="purple"
                                                        icon={<Eye size={14} />}
                                                        onClick={() =>
                                                            handleViewContent(
                                                                content
                                                            )
                                                        }
                                                    />
                                                </Tooltip>
                                                <Tooltip label="Hapus Isi Buku">
                                                    <IconButton
                                                        size="sm"
                                                        variant="outline"
                                                        colorScheme="red"
                                                        icon={
                                                            <Trash2 size={14} />
                                                        }
                                                        onClick={() =>
                                                            handleDeleteContent(
                                                                content
                                                            )
                                                        }
                                                    />
                                                </Tooltip>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                </motion.div>
                            ))}
                        </VStack>
                    )}
                </Box>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setContentToDelete(null);
                    }}
                    leastDestructiveRef={React.useRef()}
                    isCentered
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Hapus Isi Buku
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                Apakah Anda yakin ingin menghapus isi buku{" "}
                                <Text
                                    as="span"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    "
                                    {contentToDelete?.chapter_title ||
                                        "Untitled"}
                                    "
                                </Text>{" "}
                                dari buku{" "}
                                <Text
                                    as="span"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    "{getBookTitle(contentToDelete?.book_id)}"
                                </Text>{" "}
                                ? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setContentToDelete(null);
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={handleConfirmDelete}
                                    ml={3}
                                >
                                    Hapus
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </VStack>
        </motion.div>
    );
};

export default BookContentsPage;

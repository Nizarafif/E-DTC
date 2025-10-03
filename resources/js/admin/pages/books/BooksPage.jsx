import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    Input,
    Select,
    Badge,
} from "@chakra-ui/react";
import { BookOpen, Plus, Search, Filter } from "lucide-react";
import AddBookModal from "./AddBookModal";
import EditBookModal from "./EditBookModal";
import DeleteBookModal from "./DeleteBookModal";
import BooksList from "./BooksList";

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");

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

    // Load books from API
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch("/admin/books");
            if (response.ok) {
                const booksData = await response.json();
                setBooks(booksData);
            } else {
                console.error("Failed to fetch books:", response.status);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Filter books based on search and filters
    React.useEffect(() => {
        let filtered = books;

        if (searchTerm) {
            filtered = filtered.filter(
                (book) =>
                    book.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory) {
            filtered = filtered.filter(
                (book) => book.category === filterCategory
            );
        }

        if (filterStatus) {
            filtered = filtered.filter((book) => book.status === filterStatus);
        }

        setFilteredBooks(filtered);
    }, [books, searchTerm, filterCategory, filterStatus]);

    const handleAddBook = (newBook) => {
        // Refresh books from API to get the latest data
        fetchBooks();
    };

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    const handleUpdateBook = (updatedBook) => {
        // Optimistic update
        setBooks((prev) =>
            prev.map((book) =>
                book.id === updatedBook.id ? updatedBook : book
            )
        );
        // Close modal and refresh list from API to ensure latest data
        setIsEditModalOpen(false);
        setSelectedBook(null);
        fetchBooks();
    };

    const handleDeleteBook = (book) => {
        setSelectedBook(book);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = (bookId) => {
        // Refresh books from API to get the latest data after deletion
        fetchBooks();
        setSelectedBook(null);
    };

    const handleViewBook = (book) => {
        // TODO: Implement view book details
        console.log("View book:", book);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterCategory("");
        setFilterStatus("");
    };

    const activeFiltersCount = [
        searchTerm,
        filterCategory,
        filterStatus,
    ].filter(Boolean).length;

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
                    <VStack spacing={4} align="stretch">
                        {/* Title and Add Button */}
                        <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                                <HStack spacing={3}>
                                    <Box
                                        p={2}
                                        bg="teal.100"
                                        borderRadius="lg"
                                        color="teal.600"
                                    >
                                        <BookOpen size={20} />
                                    </Box>
                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                        color={textColor}
                                    >
                                        Kelola Buku
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.500">
                                    Kelola koleksi buku digital Anda
                                </Text>
                            </VStack>
                            <Button
                                colorScheme="teal"
                                leftIcon={<Plus size={16} />}
                                onClick={() => setIsAddModalOpen(true)}
                                borderRadius="lg"
                                shadow="sm"
                                _hover={{
                                    transform: "translateY(-2px)",
                                    shadow: "md",
                                }}
                                transition="all 0.2s"
                            >
                                Tambah Buku
                            </Button>
                        </HStack>

                        {/* Search and Filters */}
                        <HStack spacing={4} align="end">
                            {/* Search */}
                            <Box flex={1}>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Search size={16} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Cari judul atau penulis..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        borderRadius="lg"
                                        _focus={{
                                            borderColor: "teal.500",
                                            boxShadow: "0 0 0 1px teal.500",
                                        }}
                                    />
                                </InputGroup>
                            </Box>

                            {/* Category Filter */}
                            <Select
                                placeholder="Semua Kategori"
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                                borderRadius="lg"
                                maxW="200px"
                                _focus={{
                                    borderColor: "teal.500",
                                    boxShadow: "0 0 0 1px teal.500",
                                }}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Select>

                            {/* Status Filter */}
                            <Select
                                placeholder="Semua Status"
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                borderRadius="lg"
                                maxW="150px"
                                _focus={{
                                    borderColor: "teal.500",
                                    boxShadow: "0 0 0 1px teal.500",
                                }}
                            >
                                <option value="draft">Draft</option>
                                <option value="review">Review</option>
                                <option value="published">Terbit</option>
                            </Select>

                            {/* Clear Filters */}
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="md"
                                    onClick={clearFilters}
                                    leftIcon={<Filter size={16} />}
                                    borderRadius="lg"
                                >
                                    Clear
                                    <Badge
                                        ml={2}
                                        colorScheme="teal"
                                        borderRadius="full"
                                        fontSize="xs"
                                    >
                                        {activeFiltersCount}
                                    </Badge>
                                </Button>
                            )}
                        </HStack>

                        {/* Stats */}
                        <HStack spacing={6} pt={2}>
                            <HStack spacing={2}>
                                <Text fontSize="sm" color="gray.500">
                                    Total Buku:
                                </Text>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color={textColor}
                                >
                                    {books.length}
                                </Text>
                            </HStack>
                            <HStack spacing={2}>
                                <Text fontSize="sm" color="gray.500">
                                    Ditampilkan:
                                </Text>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color={textColor}
                                >
                                    {filteredBooks.length}
                                </Text>
                            </HStack>
                            {books.length > 0 && (
                                <HStack spacing={2}>
                                    <Text fontSize="sm" color="gray.500">
                                        Terbit:
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color="green.600"
                                    >
                                        {
                                            books.filter(
                                                (book) =>
                                                    book.status === "published"
                                            ).length
                                        }
                                    </Text>
                                </HStack>
                            )}
                        </HStack>
                    </VStack>
                </Box>

                {/* Books List */}
                <BooksList
                    books={filteredBooks}
                    onEdit={handleEditBook}
                    onDelete={handleDeleteBook}
                    onView={handleViewBook}
                />

                {/* Modals */}
                <AddBookModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onBookAdded={handleAddBook}
                />

                <EditBookModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedBook(null);
                    }}
                    book={selectedBook}
                    onBookUpdated={handleUpdateBook}
                />

                <DeleteBookModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedBook(null);
                    }}
                    book={selectedBook}
                    onBookDeleted={handleConfirmDelete}
                />
            </VStack>
        </motion.div>
    );
};

export default BooksPage;

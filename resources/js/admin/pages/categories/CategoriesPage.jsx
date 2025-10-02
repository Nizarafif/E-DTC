import React, { useState } from "react";
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
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import {
    Tag,
    Plus,
    Search,
    Filter,
    TrendingUp,
    Users,
    Eye,
} from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoriesList from "./CategoriesList";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterColor, setFilterColor] = useState("");

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");

    const colorOptions = [
        { value: "teal", label: "Teal" },
        { value: "blue", label: "Biru" },
        { value: "green", label: "Hijau" },
        { value: "purple", label: "Ungu" },
        { value: "orange", label: "Oranye" },
        { value: "red", label: "Merah" },
        { value: "pink", label: "Pink" },
        { value: "yellow", label: "Kuning" },
    ];

    // Filter categories based on search and filters
    React.useEffect(() => {
        let filtered = categories;

        if (searchTerm) {
            filtered = filtered.filter(
                (category) =>
                    category.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (category.description &&
                        category.description
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        if (filterStatus) {
            filtered = filtered.filter(
                (category) => category.status === filterStatus
            );
        }

        if (filterColor) {
            filtered = filtered.filter(
                (category) => category.color === filterColor
            );
        }

        setFilteredCategories(filtered);
    }, [categories, searchTerm, filterStatus, filterColor]);

    const handleAddCategory = (newCategory) => {
        setCategories((prev) => [newCategory, ...prev]);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleUpdateCategory = (updatedCategory) => {
        setCategories((prev) =>
            prev.map((category) =>
                category.id === updatedCategory.id ? updatedCategory : category
            )
        );
        setSelectedCategory(null);
    };

    const handleDeleteCategory = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = (categoryId) => {
        setCategories((prev) =>
            prev.filter((category) => category.id !== categoryId)
        );
        setSelectedCategory(null);
    };

    const handleViewCategory = (category) => {
        // TODO: Implement view category details
        console.log("View category:", category);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("");
        setFilterColor("");
    };

    const activeFiltersCount = [searchTerm, filterStatus, filterColor].filter(
        Boolean
    ).length;

    // Calculate stats
    const totalCategories = categories.length;
    const activeCategories = categories.filter(
        (cat) => cat.status === "active"
    ).length;
    const totalBooks = categories.reduce(
        (sum, cat) => sum + (cat.booksCount || 0),
        0
    );
    const avgBooksPerCategory =
        totalCategories > 0 ? Math.round(totalBooks / totalCategories) : 0;

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
                                        <Tag size={20} />
                                    </Box>
                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                        color={textColor}
                                    >
                                        Kelola Kategori
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.500">
                                    Organisir buku dengan kategori yang
                                    terstruktur
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
                                Tambah Kategori
                            </Button>
                        </HStack>

                        {/* Stats Cards */}
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                            <Box
                                bg={useColorModeValue("blue.50", "blue.900")}
                                p={4}
                                borderRadius="lg"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "blue.200",
                                    "blue.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="blue.600">
                                        Total Kategori
                                    </StatLabel>
                                    <StatNumber fontSize="2xl" color="blue.600">
                                        {totalCategories}
                                    </StatNumber>
                                </Stat>
                            </Box>
                            <Box
                                bg={useColorModeValue("green.50", "green.900")}
                                p={4}
                                borderRadius="lg"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "green.200",
                                    "green.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="green.600">
                                        Kategori Aktif
                                    </StatLabel>
                                    <StatNumber
                                        fontSize="2xl"
                                        color="green.600"
                                    >
                                        {activeCategories}
                                    </StatNumber>
                                </Stat>
                            </Box>
                            <Box
                                bg={useColorModeValue(
                                    "purple.50",
                                    "purple.900"
                                )}
                                p={4}
                                borderRadius="lg"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "purple.200",
                                    "purple.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="purple.600">
                                        Total Buku
                                    </StatLabel>
                                    <StatNumber
                                        fontSize="2xl"
                                        color="purple.600"
                                    >
                                        {totalBooks}
                                    </StatNumber>
                                </Stat>
                            </Box>
                            <Box
                                bg={useColorModeValue(
                                    "orange.50",
                                    "orange.900"
                                )}
                                p={4}
                                borderRadius="lg"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "orange.200",
                                    "orange.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="orange.600">
                                        Rata-rata Buku
                                    </StatLabel>
                                    <StatNumber
                                        fontSize="2xl"
                                        color="orange.600"
                                    >
                                        {avgBooksPerCategory}
                                    </StatNumber>
                                    <StatHelpText
                                        fontSize="xs"
                                        color="orange.500"
                                    >
                                        per kategori
                                    </StatHelpText>
                                </Stat>
                            </Box>
                        </SimpleGrid>

                        {/* Search and Filters */}
                        <HStack spacing={4} align="end">
                            {/* Search */}
                            <Box flex={1}>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Search size={16} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Cari nama atau deskripsi kategori..."
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
                                <option value="active">Aktif</option>
                                <option value="inactive">Tidak Aktif</option>
                            </Select>

                            {/* Color Filter */}
                            <Select
                                placeholder="Semua Warna"
                                value={filterColor}
                                onChange={(e) => setFilterColor(e.target.value)}
                                borderRadius="lg"
                                maxW="150px"
                                _focus={{
                                    borderColor: "teal.500",
                                    boxShadow: "0 0 0 1px teal.500",
                                }}
                            >
                                {colorOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
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

                        {/* Results Info */}
                        <HStack spacing={6} pt={2}>
                            <HStack spacing={2}>
                                <Text fontSize="sm" color="gray.500">
                                    Ditampilkan:
                                </Text>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color={textColor}
                                >
                                    {filteredCategories.length} dari{" "}
                                    {totalCategories}
                                </Text>
                            </HStack>
                        </HStack>
                    </VStack>
                </Box>

                {/* Categories List */}
                <CategoriesList
                    categories={filteredCategories}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onView={handleViewCategory}
                />

                {/* Modals */}
                <AddCategoryModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onCategoryAdded={handleAddCategory}
                />

                <EditCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedCategory(null);
                    }}
                    category={selectedCategory}
                    onCategoryUpdated={handleUpdateCategory}
                />

                <DeleteCategoryModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedCategory(null);
                    }}
                    category={selectedCategory}
                    onCategoryDeleted={handleConfirmDelete}
                />
            </VStack>
        </motion.div>
    );
};

export default CategoriesPage;

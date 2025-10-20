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
    StatHelpText,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider,
    Flex,
    Spacer,
    IconButton,
    Tooltip,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import {
    Tag,
    Plus,
    Search,
    Filter,
    TrendingUp,
    BookOpen,
    Edit3,
    Trash2,
    Eye,
    MoreVertical,
    RefreshCw,
    Download,
    Upload,
    Settings,
} from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoriesGrid from "./CategoriesGrid";
import CategoriesTable from "./CategoriesTable";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterColor, setFilterColor] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // grid or table
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isDeleteMultipleOpen, setIsDeleteMultipleOpen] = useState(false);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const toast = useToast();

    const colorOptions = [
        { value: "blue", label: "Biru", color: "blue.500" },
        { value: "green", label: "Hijau", color: "green.500" },
        { value: "purple", label: "Ungu", color: "purple.500" },
        { value: "orange", label: "Oranye", color: "orange.500" },
        { value: "red", label: "Merah", color: "red.500" },
        { value: "pink", label: "Pink", color: "pink.500" },
        { value: "teal", label: "Teal", color: "teal.500" },
        { value: "yellow", label: "Kuning", color: "yellow.500" },
        { value: "gray", label: "Abu-abu", color: "gray.500" },
    ];

    // Load categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data || []);
            } else {
                throw new Error("Gagal mengambil data kategori");
            }
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

    // Filter categories
    const filteredCategories = categories.filter((category) => {
        const matchesSearch =
            !searchTerm ||
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (category.description &&
                category.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        const matchesStatus = !filterStatus || category.status === filterStatus;
        const matchesColor = !filterColor || category.color === filterColor;

        return matchesSearch && matchesStatus && matchesColor;
    });

    // Calculate stats
    const totalCategories = categories.length;
    const activeCategories = categories.filter(
        (cat) => cat.status === "active"
    ).length;
    const inactiveCategories = categories.filter(
        (cat) => cat.status === "inactive"
    ).length;
    const totalBooks = categories.reduce(
        (sum, cat) => sum + (cat.books_count || 0),
        0
    );

    // Event handlers
    const handleAddCategory = (newCategory) => {
        setCategories((prev) => [newCategory, ...prev]);
        toast({
            title: "Berhasil",
            description: "Kategori berhasil ditambahkan",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top-right",
        });
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleUpdateCategory = (updatedCategory) => {
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === updatedCategory.id ? updatedCategory : cat
            )
        );
        setSelectedCategory(null);
        toast({
            title: "Berhasil",
            description: "Kategori berhasil diperbarui",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top-right",
        });
    };

    const handleDeleteCategory = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = (categoryId) => {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        setSelectedCategory(null);
        toast({
            title: "Berhasil",
            description: "Kategori berhasil dihapus",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top-right",
        });
    };

    const handleViewCategory = (category) => {
        console.log("View category:", category);
    };

    const handleSelectCategory = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSelectAll = () => {
        if (selectedCategories.length === filteredCategories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(filteredCategories.map((cat) => cat.id));
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("");
        setFilterColor("");
    };

    const activeFiltersCount = [searchTerm, filterStatus, filterColor].filter(
        Boolean
    ).length;

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
                                    bg="blue.100"
                                    borderRadius="xl"
                                    color="blue.600"
                                >
                                    <Tag size={24} />
                                </Box>
                                <VStack align="start" spacing={1}>
                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color={textColor}
                                    >
                                        Kelola Kategori Buku
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Organisir dan kelola kategori buku
                                        dengan mudah
                                    </Text>
                                </VStack>
                            </HStack>

                            <HStack spacing={3}>
                                <Button
                                    leftIcon={<RefreshCw size={16} />}
                                    variant="outline"
                                    onClick={fetchCategories}
                                    isLoading={isLoading}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    leftIcon={<Plus size={16} />}
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    Tambah Kategori
                                </Button>
                            </HStack>
                        </Flex>

                        {/* Stats Cards */}
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
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
                                borderRadius="xl"
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
                                    "orange.50",
                                    "orange.900"
                                )}
                                p={4}
                                borderRadius="xl"
                                border="1px"
                                borderColor={useColorModeValue(
                                    "orange.200",
                                    "orange.700"
                                )}
                            >
                                <Stat>
                                    <StatLabel fontSize="xs" color="orange.600">
                                        Tidak Aktif
                                    </StatLabel>
                                    <StatNumber
                                        fontSize="2xl"
                                        color="orange.600"
                                    >
                                        {inactiveCategories}
                                    </StatNumber>
                                </Stat>
                            </Box>
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
                                            placeholder="Cari kategori berdasarkan nama atau deskripsi..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            borderRadius="lg"
                                            _focus={{
                                                borderColor: "blue.500",
                                                boxShadow: "0 0 0 1px blue.500",
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
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">
                                        Tidak Aktif
                                    </option>
                                </Select>

                                {/* Color Filter */}
                                <Select
                                    placeholder="Semua Warna"
                                    value={filterColor}
                                    onChange={(e) =>
                                        setFilterColor(e.target.value)
                                    }
                                    borderRadius="lg"
                                    maxW="150px"
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
                                        onClick={clearFilters}
                                        leftIcon={<Filter size={16} />}
                                    >
                                        Clear ({activeFiltersCount})
                                    </Button>
                                )}
                            </HStack>

                            {/* Results Info and View Toggle */}
                            <Flex align="center" justify="space-between">
                                <HStack spacing={4}>
                                    <Text fontSize="sm" color="gray.500">
                                        Menampilkan {filteredCategories.length}{" "}
                                        dari {totalCategories} kategori
                                    </Text>
                                    {selectedCategories.length > 0 && (
                                        <Badge
                                            colorScheme="blue"
                                            variant="subtle"
                                        >
                                            {selectedCategories.length} dipilih
                                        </Badge>
                                    )}
                                </HStack>

                                <HStack spacing={2}>
                                    <Button
                                        size="sm"
                                        variant={
                                            viewMode === "grid"
                                                ? "solid"
                                                : "outline"
                                        }
                                        colorScheme="blue"
                                        onClick={() => setViewMode("grid")}
                                        leftIcon={<Tag size={14} />}
                                    >
                                        Grid
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            viewMode === "table"
                                                ? "solid"
                                                : "outline"
                                        }
                                        colorScheme="blue"
                                        onClick={() => setViewMode("table")}
                                        leftIcon={<Settings size={14} />}
                                    >
                                        Tabel
                                    </Button>
                                </HStack>
                            </Flex>
                        </VStack>
                    </VStack>
                </Box>

                {/* Categories Content */}
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
                            <Text>Memuat kategori...</Text>
                        </VStack>
                    ) : filteredCategories.length === 0 ? (
                        <VStack spacing={4} py={12}>
                            <Box
                                p={6}
                                bg="gray.100"
                                borderRadius="full"
                                color="gray.500"
                            >
                                <Tag size={48} />
                            </Box>
                            <VStack spacing={2}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    {searchTerm || filterStatus || filterColor
                                        ? "Tidak ada kategori yang sesuai filter"
                                        : "Belum ada kategori"}
                                </Text>
                                <Text
                                    color="gray.500"
                                    textAlign="center"
                                    maxW="400px"
                                >
                                    {searchTerm || filterStatus || filterColor
                                        ? "Coba ubah filter atau hapus filter untuk melihat semua kategori"
                                        : "Mulai tambahkan kategori pertama untuk mengorganisir buku-buku Anda"}
                                </Text>
                            </VStack>
                            {!searchTerm && !filterStatus && !filterColor && (
                                <Button
                                    colorScheme="blue"
                                    leftIcon={<Plus size={16} />}
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    Tambah Kategori Pertama
                                </Button>
                            )}
                        </VStack>
                    ) : (
                        <>
                            {/* Bulk Actions */}
                            {selectedCategories.length > 0 && (
                                <Box
                                    bg="blue.50"
                                    p={4}
                                    borderRadius="lg"
                                    border="1px"
                                    borderColor="blue.200"
                                    mb={6}
                                >
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="blue.700">
                                            {selectedCategories.length} kategori
                                            dipilih
                                        </Text>
                                        <HStack spacing={2}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                colorScheme="red"
                                                leftIcon={<Trash2 size={14} />}
                                                onClick={() =>
                                                    setIsDeleteMultipleOpen(
                                                        true
                                                    )
                                                }
                                            >
                                                Hapus Terpilih
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setSelectedCategories([])
                                                }
                                            >
                                                Batal Pilih
                                            </Button>
                                        </HStack>
                                    </HStack>
                                </Box>
                            )}

                            {/* Categories Display */}
                            {viewMode === "grid" ? (
                                <CategoriesGrid
                                    categories={filteredCategories}
                                    selectedCategories={selectedCategories}
                                    onSelectCategory={handleSelectCategory}
                                    onSelectAll={handleSelectAll}
                                    onEdit={handleEditCategory}
                                    onDelete={handleDeleteCategory}
                                    onView={handleViewCategory}
                                />
                            ) : (
                                <CategoriesTable
                                    categories={filteredCategories}
                                    selectedCategories={selectedCategories}
                                    onSelectCategory={handleSelectCategory}
                                    onSelectAll={handleSelectAll}
                                    onEdit={handleEditCategory}
                                    onDelete={handleDeleteCategory}
                                    onView={handleViewCategory}
                                />
                            )}
                        </>
                    )}
                </Box>

                {/* Modals */}
                <AddCategoryModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onCategoryAdded={handleAddCategory}
                    colorOptions={colorOptions}
                />

                <EditCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedCategory(null);
                    }}
                    category={selectedCategory}
                    onCategoryUpdated={handleUpdateCategory}
                    colorOptions={colorOptions}
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

                {/* Delete Multiple Categories Dialog */}
                <AlertDialog
                    isOpen={isDeleteMultipleOpen}
                    onClose={() => setIsDeleteMultipleOpen(false)}
                    leastDestructiveRef={React.useRef()}
                    isCentered
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Hapus Kategori Terpilih
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                Apakah Anda yakin ingin menghapus{" "}
                                {selectedCategories.length} kategori yang
                                dipilih? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button
                                    onClick={() =>
                                        setIsDeleteMultipleOpen(false)
                                    }
                                >
                                    Batal
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={() => {
                                        setCategories((prev) =>
                                            prev.filter(
                                                (cat) =>
                                                    !selectedCategories.includes(
                                                        cat.id
                                                    )
                                            )
                                        );
                                        setSelectedCategories([]);
                                        setIsDeleteMultipleOpen(false);
                                        toast({
                                            title: "Berhasil",
                                            description:
                                                "Kategori terpilih berhasil dihapus",
                                            status: "success",
                                            duration: 2000,
                                            isClosable: true,
                                            position: "top-right",
                                        });
                                    }}
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

export default CategoriesPage;

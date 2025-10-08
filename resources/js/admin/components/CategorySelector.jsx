import React, { useState, useEffect } from "react";
import {
    Box,
    VStack,
    HStack,
    Text,
    Select,
    Button,
    Badge,
    useColorModeValue,
    useToast,
    Spinner,
    Alert,
    AlertIcon,
    AlertDescription,
    InputGroup,
    InputLeftElement,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Tooltip,
    Divider,
} from "@chakra-ui/react";
import { Tag, Plus, Search, RefreshCw, Palette, Eye } from "lucide-react";

const CategorySelector = ({
    value,
    onChange,
    placeholder = "Pilih kategori...",
    showAddButton = true,
    onAddCategory,
    size = "md",
    isDisabled = false,
}) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const toast = useToast();

    // Load categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/categories-options");
            if (response.ok) {
                const data = await response.json();
                setCategories(data || []);
            } else {
                throw new Error("Gagal mengambil data kategori");
            }
        } catch (err) {
            setError(err.message);
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const selectedCategory = categories.find(
            (cat) => cat.id.toString() === categoryId
        );
        onChange(selectedCategory);
    };

    const handleRefresh = () => {
        fetchCategories();
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCategory = categories.find((cat) => cat.id === value?.id);

    if (error) {
        return (
            <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <AlertDescription fontSize="sm">{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <VStack spacing={3} align="stretch">
            {/* Search and Actions */}
            <HStack spacing={2}>
                <InputGroup size="sm" flex={1}>
                    <InputLeftElement pointerEvents="none">
                        <Search size={14} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Cari kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        borderRadius="lg"
                        size="sm"
                    />
                </InputGroup>
                <Tooltip label="Refresh kategori">
                    <IconButton
                        size="sm"
                        variant="outline"
                        icon={<RefreshCw size={14} />}
                        onClick={handleRefresh}
                        isLoading={isLoading}
                    />
                </Tooltip>
                {showAddButton && onAddCategory && (
                    <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<Plus size={14} />}
                        onClick={onAddCategory}
                    >
                        Tambah
                    </Button>
                )}
            </HStack>

            {/* Category Selector */}
            <Box>
                <Select
                    value={selectedCategory?.id || ""}
                    onChange={handleCategoryChange}
                    placeholder={isLoading ? "Memuat kategori..." : placeholder}
                    size={size}
                    isDisabled={isDisabled || isLoading}
                    borderRadius="lg"
                    _focus={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 1px blue.500",
                    }}
                >
                    {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Select>
            </Box>

            {/* Selected Category Preview */}
            {selectedCategory && (
                <Box
                    p={3}
                    bg={`${selectedCategory.color || "blue"}.50`}
                    borderRadius="lg"
                    border="1px"
                    borderColor={`${selectedCategory.color || "blue"}.200`}
                >
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            bg={`${selectedCategory.color || "blue"}.100`}
                            borderRadius="lg"
                            color={`${selectedCategory.color || "blue"}.600`}
                        >
                            <Tag size={16} />
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                            <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color={textColor}
                            >
                                {selectedCategory.name}
                            </Text>
                            <HStack spacing={2}>
                                <Badge
                                    colorScheme={
                                        selectedCategory.color || "blue"
                                    }
                                    variant="subtle"
                                    fontSize="xs"
                                >
                                    {selectedCategory.color || "blue"}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                    ID: {selectedCategory.id}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>
            )}

            {/* Categories Count */}
            <HStack justify="space-between" fontSize="xs" color="gray.500">
                <Text>
                    {isLoading
                        ? "Memuat..."
                        : `${filteredCategories.length} kategori tersedia`}
                </Text>
                {searchTerm && <Text>Filter: "{searchTerm}"</Text>}
            </HStack>
        </VStack>
    );
};

export default CategorySelector;

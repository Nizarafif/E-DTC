import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    Grid,
    VStack,
    HStack,
    Text,
    Image,
    Badge,
    Button,
    IconButton,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Stat,
    StatLabel,
    StatNumber,
    Checkbox,
    Tooltip,
    Flex,
    Spacer,
} from "@chakra-ui/react";
import {
    Tag,
    Edit3,
    Trash2,
    MoreVertical,
    Eye,
    Calendar,
    Palette,
    BookOpen,
    Users,
} from "lucide-react";

const CategoriesGrid = ({
    categories,
    selectedCategories,
    onSelectCategory,
    onSelectAll,
    onEdit,
    onDelete,
    onView,
}) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const statsBgColor = useColorModeValue("gray.50", "gray.700");
    const hoverBorderColor = useColorModeValue("blue.300", "blue.600");

    const getStatusColor = (status) => {
        return status === "active" ? "green" : "gray";
    };

    const getStatusText = (status) => {
        return status === "active" ? "Aktif" : "Tidak Aktif";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
    };

    const isAllSelected =
        selectedCategories.length === categories.length &&
        categories.length > 0;
    const isIndeterminate =
        selectedCategories.length > 0 &&
        selectedCategories.length < categories.length;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <VStack spacing={4} align="stretch">
                {/* Select All Header */}
                <Box
                    p={4}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                >
                    <HStack justify="space-between">
                        <HStack spacing={3}>
                            <Checkbox
                                isChecked={isAllSelected}
                                isIndeterminate={isIndeterminate}
                                onChange={onSelectAll}
                                colorScheme="blue"
                            />
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color={textColor}
                            >
                                Pilih Semua ({categories.length} kategori)
                            </Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                            Klik checkbox untuk memilih kategori
                        </Text>
                    </HStack>
                </Box>

                {/* Grid */}
                <Grid
                    templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                        xl: "repeat(4, 1fr)",
                    }}
                    gap={6}
                >
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Box
                                bg={bgColor}
                                borderRadius="2xl"
                                border="2px"
                                borderColor={
                                    selectedCategories.includes(category.id)
                                        ? "blue.300"
                                        : borderColor
                                }
                                overflow="hidden"
                                shadow="sm"
                                _hover={{
                                    shadow: "lg",
                                    borderColor: selectedCategories.includes(
                                        category.id
                                    )
                                        ? "blue.400"
                                        : hoverBorderColor,
                                }}
                                transition="all 0.2s"
                                position="relative"
                                h="320px"
                                cursor="pointer"
                                onClick={() => onSelectCategory(category.id)}
                            >
                                {/* Selection Checkbox */}
                                <Box
                                    position="absolute"
                                    top={3}
                                    left={3}
                                    zIndex={2}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Checkbox
                                        isChecked={selectedCategories.includes(
                                            category.id
                                        )}
                                        onChange={() =>
                                            onSelectCategory(category.id)
                                        }
                                        colorScheme="blue"
                                        bg="white"
                                        borderRadius="md"
                                        p={1}
                                        shadow="sm"
                                    />
                                </Box>

                                {/* Header with Icon/Image */}
                                <Box
                                    position="relative"
                                    h="140px"
                                    bg={`${category.color || "blue"}.50`}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {category.icon ? (
                                        <Image
                                            src={category.icon}
                                            alt={category.name}
                                            w="70px"
                                            h="70px"
                                            objectFit="cover"
                                            borderRadius="xl"
                                            shadow="sm"
                                        />
                                    ) : (
                                        <Box
                                            p={5}
                                            bg={`${
                                                category.color || "blue"
                                            }.100`}
                                            borderRadius="2xl"
                                            color={`${
                                                category.color || "blue"
                                            }.600`}
                                        >
                                            <Tag size={40} />
                                        </Box>
                                    )}

                                    {/* Status Badge */}
                                    <Badge
                                        colorScheme={getStatusColor(
                                            category.status
                                        )}
                                        position="absolute"
                                        top={3}
                                        right={3}
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                        fontSize="xs"
                                        fontWeight="600"
                                        shadow="sm"
                                    >
                                        {getStatusText(category.status)}
                                    </Badge>

                                    {/* Actions Menu */}
                                    <Box
                                        position="absolute"
                                        top={3}
                                        right={3}
                                        zIndex={1}
                                    >
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={
                                                    <MoreVertical size={16} />
                                                }
                                                variant="solid"
                                                bg="white"
                                                color="gray.600"
                                                size="sm"
                                                borderRadius="full"
                                                shadow="sm"
                                                _hover={{
                                                    bg: "gray.100",
                                                }}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                            <MenuList>
                                                <MenuItem
                                                    icon={<Eye size={16} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onView &&
                                                            onView(category);
                                                    }}
                                                >
                                                    Lihat Detail
                                                </MenuItem>
                                                <MenuItem
                                                    icon={<Edit3 size={16} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit &&
                                                            onEdit(category);
                                                    }}
                                                >
                                                    Edit Kategori
                                                </MenuItem>
                                                <MenuDivider />
                                                <MenuItem
                                                    icon={<Trash2 size={16} />}
                                                    color="red.500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete &&
                                                            onDelete(category);
                                                    }}
                                                >
                                                    Hapus Kategori
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                </Box>

                                {/* Category Info */}
                                <Box
                                    p={5}
                                    h="180px"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <VStack
                                        align="stretch"
                                        spacing={3}
                                        flex={1}
                                    >
                                        {/* Name and Description */}
                                        <VStack align="start" spacing={2}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="bold"
                                                color={textColor}
                                                noOfLines={1}
                                            >
                                                {category.name}
                                            </Text>
                                            {category.description && (
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                    noOfLines={2}
                                                    lineHeight="1.4"
                                                >
                                                    {category.description}
                                                </Text>
                                            )}
                                        </VStack>

                                        {/* Stats */}
                                        <Box
                                            bg={statsBgColor}
                                            p={3}
                                            borderRadius="lg"
                                            flex={1}
                                        >
                                            <Stat>
                                                <StatLabel
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={1}
                                                >
                                                    <BookOpen size={12} />
                                                    Jumlah Buku
                                                </StatLabel>
                                                <StatNumber
                                                    fontSize="xl"
                                                    color={`${
                                                        category.color || "blue"
                                                    }.600`}
                                                >
                                                    {category.books_count || 0}
                                                </StatNumber>
                                            </Stat>
                                        </Box>

                                        {/* Color and Date */}
                                        <HStack
                                            justify="space-between"
                                            fontSize="xs"
                                            color="gray.500"
                                        >
                                            <HStack spacing={1}>
                                                <Palette size={12} />
                                                <Badge
                                                    colorScheme={
                                                        category.color || "blue"
                                                    }
                                                    variant="subtle"
                                                    fontSize="xs"
                                                >
                                                    {category.color || "blue"}
                                                </Badge>
                                            </HStack>
                                            <HStack spacing={1}>
                                                <Calendar size={12} />
                                                <Text>
                                                    {formatDate(
                                                        category.created_at
                                                    )}
                                                </Text>
                                            </HStack>
                                        </HStack>

                                        {/* Action Buttons */}
                                        <HStack spacing={2} pt={2}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                colorScheme="blue"
                                                leftIcon={<Edit3 size={14} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit && onEdit(category);
                                                }}
                                                flex={1}
                                            >
                                                Edit
                                            </Button>
                                            <IconButton
                                                size="sm"
                                                variant="outline"
                                                colorScheme="red"
                                                icon={<Trash2 size={14} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete &&
                                                        onDelete(category);
                                                }}
                                                isDisabled={
                                                    category.books_count > 0
                                                }
                                            />
                                        </HStack>
                                    </VStack>
                                </Box>
                            </Box>
                        </motion.div>
                    ))}
                </Grid>
            </VStack>
        </motion.div>
    );
};

export default CategoriesGrid;

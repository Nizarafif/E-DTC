import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Checkbox,
    Text,
    Badge,
    Button,
    IconButton,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    HStack,
    VStack,
    Tooltip,
    Image,
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

const CategoriesTable = ({
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
    const headerBgColor = useColorModeValue("gray.50", "gray.700");
    const rowHoverBg = useColorModeValue("gray.50", "gray.700");

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

    const isAllSelected =
        selectedCategories.length === categories.length &&
        categories.length > 0;
    const isIndeterminate =
        selectedCategories.length > 0 &&
        selectedCategories.length < categories.length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                borderRadius="xl"
                border="1px"
                borderColor={borderColor}
                overflow="hidden"
                bg={bgColor}
            >
                <Table variant="simple" size="md">
                    <Thead bg={headerBgColor}>
                        <Tr>
                            <Th px={4} py={4}>
                                <Checkbox
                                    isChecked={isAllSelected}
                                    isIndeterminate={isIndeterminate}
                                    onChange={onSelectAll}
                                    colorScheme="blue"
                                />
                            </Th>
                            <Th
                                px={4}
                                py={4}
                                color={textColor}
                                fontWeight="bold"
                            >
                                Kategori
                            </Th>
                            <Th
                                px={4}
                                py={4}
                                color={textColor}
                                fontWeight="bold"
                            >
                                Status
                            </Th>
                            <Th
                                px={4}
                                py={4}
                                color={textColor}
                                fontWeight="bold"
                            >
                                Warna
                            </Th>
                            <Th
                                px={4}
                                py={4}
                                color={textColor}
                                fontWeight="bold"
                                isNumeric
                            >
                                Jumlah Buku
                            </Th>
                            <Th
                                px={4}
                                py={4}
                                color={textColor}
                                fontWeight="bold"
                            >
                                Tanggal Dibuat
                            </Th>
                            <Th
                                px={4}
                                py={4}
                                color={textColor}
                                fontWeight="bold"
                                textAlign="center"
                            >
                                Aksi
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {categories.map((category, index) => (
                            <motion.tr
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                _hover={{ bg: rowHoverBg }}
                                cursor="pointer"
                                onClick={() => onSelectCategory(category.id)}
                            >
                                <Td px={4} py={4}>
                                    <Checkbox
                                        isChecked={selectedCategories.includes(
                                            category.id
                                        )}
                                        onChange={() =>
                                            onSelectCategory(category.id)
                                        }
                                        colorScheme="blue"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Td>
                                <Td px={4} py={4}>
                                    <HStack spacing={3}>
                                        {/* Icon/Image */}
                                        <Box
                                            w="40px"
                                            h="40px"
                                            bg={`${
                                                category.color || "blue"
                                            }.100`}
                                            borderRadius="lg"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            color={`${
                                                category.color || "blue"
                                            }.600`}
                                        >
                                            {category.icon ? (
                                                <Image
                                                    src={category.icon}
                                                    alt={category.name}
                                                    w="24px"
                                                    h="24px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                            ) : (
                                                <Tag size={20} />
                                            )}
                                        </Box>

                                        {/* Name and Description */}
                                        <VStack align="start" spacing={1}>
                                            <Text
                                                fontWeight="semibold"
                                                color={textColor}
                                                fontSize="sm"
                                            >
                                                {category.name}
                                            </Text>
                                            {category.description && (
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    noOfLines={1}
                                                    maxW="200px"
                                                >
                                                    {category.description}
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                </Td>
                                <Td px={4} py={4}>
                                    <Badge
                                        colorScheme={getStatusColor(
                                            category.status
                                        )}
                                        variant="subtle"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="600"
                                    >
                                        {getStatusText(category.status)}
                                    </Badge>
                                </Td>
                                <Td px={4} py={4}>
                                    <HStack spacing={2}>
                                        <Box
                                            w="20px"
                                            h="20px"
                                            bg={`${
                                                category.color || "blue"
                                            }.500`}
                                            borderRadius="md"
                                        />
                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            textTransform="capitalize"
                                        >
                                            {category.color || "blue"}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td px={4} py={4} isNumeric>
                                    <HStack justify="end" spacing={1}>
                                        <BookOpen size={14} color="gray.500" />
                                        <Text
                                            fontWeight="semibold"
                                            color={`${
                                                category.color || "blue"
                                            }.600`}
                                            fontSize="sm"
                                        >
                                            {category.books_count || 0}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td px={4} py={4}>
                                    <HStack spacing={1} color="gray.500">
                                        <Calendar size={14} />
                                        <Text fontSize="sm">
                                            {formatDate(category.created_at)}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td px={4} py={4} textAlign="center">
                                    <HStack spacing={1} justify="center">
                                        <Tooltip label="Lihat Detail">
                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                                icon={<Eye size={14} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView && onView(category);
                                                }}
                                            />
                                        </Tooltip>
                                        <Tooltip label="Edit Kategori">
                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="blue"
                                                icon={<Edit3 size={14} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit && onEdit(category);
                                                }}
                                            />
                                        </Tooltip>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="gray"
                                                icon={
                                                    <MoreVertical size={14} />
                                                }
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
                                                    isDisabled={
                                                        category.books_count > 0
                                                    }
                                                >
                                                    Hapus Kategori
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </HStack>
                                </Td>
                            </motion.tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </motion.div>
    );
};

export default CategoriesTable;

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
} from "@chakra-ui/react";
import {
    Tag,
    Edit3,
    Trash2,
    MoreVertical,
    Eye,
    BookOpen,
    Calendar,
    Palette,
} from "lucide-react";

const CategoriesList = ({ categories, onEdit, onDelete, onView }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");

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

    if (!categories || categories.length === 0) {
        return (
            <Box
                bg={bgColor}
                p={8}
                borderRadius="2xl"
                border="1px"
                borderColor={borderColor}
                textAlign="center"
                minH="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <VStack spacing={4}>
                        <Box
                            p={6}
                            bg="teal.100"
                            borderRadius="full"
                            color="teal.600"
                        >
                            <Tag size={48} />
                        </Box>
                        <VStack spacing={2}>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Belum Ada Kategori
                            </Text>
                            <Text color="gray.500" maxW="400px">
                                Mulai tambahkan kategori pertama untuk
                                mengorganisir buku-buku Anda
                            </Text>
                        </VStack>
                    </VStack>
                </motion.div>
            </Box>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
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
                            border="1px"
                            borderColor={borderColor}
                            overflow="hidden"
                            shadow="sm"
                            _hover={{
                                shadow: "lg",
                                borderColor: `${category.color}.300`,
                            }}
                            transition="all 0.2s"
                            position="relative"
                            h="280px"
                        >
                            {/* Header with Icon/Image */}
                            <Box
                                position="relative"
                                h="120px"
                                bg={`${category.color}.50`}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {category.icon ? (
                                    <Image
                                        src={category.icon}
                                        alt={category.name}
                                        w="60px"
                                        h="60px"
                                        objectFit="cover"
                                        borderRadius="lg"
                                        shadow="sm"
                                    />
                                ) : (
                                    <Box
                                        p={4}
                                        bg={`${category.color}.100`}
                                        borderRadius="xl"
                                        color={`${category.color}.600`}
                                    >
                                        <Tag size={32} />
                                    </Box>
                                )}

                                {/* Status Badge */}
                                <Badge
                                    colorScheme={getStatusColor(
                                        category.status
                                    )}
                                    position="absolute"
                                    top={3}
                                    left={3}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    fontSize="xs"
                                    fontWeight="600"
                                >
                                    {getStatusText(category.status)}
                                </Badge>

                                {/* Actions Menu */}
                                <Box position="absolute" top={3} right={3}>
                                    <Menu>
                                        <MenuButton
                                            as={IconButton}
                                            icon={<MoreVertical size={16} />}
                                            variant="solid"
                                            bg="white"
                                            color="gray.600"
                                            size="sm"
                                            borderRadius="full"
                                            shadow="sm"
                                            _hover={{
                                                bg: "gray.100",
                                            }}
                                        />
                                        <MenuList>
                                            <MenuItem
                                                icon={<Eye size={16} />}
                                                onClick={() =>
                                                    onView && onView(category)
                                                }
                                            >
                                                Lihat Detail
                                            </MenuItem>
                                            <MenuItem
                                                icon={<Edit3 size={16} />}
                                                onClick={() =>
                                                    onEdit && onEdit(category)
                                                }
                                            >
                                                Edit Kategori
                                            </MenuItem>
                                            <MenuDivider />
                                            <MenuItem
                                                icon={<Trash2 size={16} />}
                                                color="red.500"
                                                onClick={() =>
                                                    onDelete &&
                                                    onDelete(category)
                                                }
                                            >
                                                Hapus Kategori
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </Box>

                            {/* Category Info */}
                            <Box
                                p={4}
                                h="160px"
                                display="flex"
                                flexDirection="column"
                            >
                                <VStack align="stretch" spacing={3} flex={1}>
                                    {/* Name and Description */}
                                    <VStack align="start" spacing={1}>
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
                                                lineHeight="1.3"
                                            >
                                                {category.description}
                                            </Text>
                                        )}
                                    </VStack>

                                    {/* Stats */}
                                    <Box
                                        bg={useColorModeValue(
                                            "gray.50",
                                            "gray.700"
                                        )}
                                        p={3}
                                        borderRadius="lg"
                                        flex={1}
                                    >
                                        <Stat>
                                            <StatLabel
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                Jumlah Buku
                                            </StatLabel>
                                            <StatNumber
                                                fontSize="xl"
                                                color={`${category.color}.600`}
                                            >
                                                {category.booksCount || 0}
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
                                                colorScheme={category.color}
                                                variant="subtle"
                                                fontSize="xs"
                                            >
                                                {category.color}
                                            </Badge>
                                        </HStack>
                                        <HStack spacing={1}>
                                            <Calendar size={12} />
                                            <Text>
                                                {formatDate(category.createdAt)}
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
                                            onClick={() =>
                                                onEdit && onEdit(category)
                                            }
                                            flex={1}
                                        >
                                            Edit
                                        </Button>
                                        <IconButton
                                            size="sm"
                                            variant="outline"
                                            colorScheme="red"
                                            icon={<Trash2 size={14} />}
                                            onClick={() =>
                                                onDelete && onDelete(category)
                                            }
                                            isDisabled={category.booksCount > 0}
                                        />
                                    </HStack>
                                </VStack>
                            </Box>
                        </Box>
                    </motion.div>
                ))}
            </Grid>
        </motion.div>
    );
};

export default CategoriesList;

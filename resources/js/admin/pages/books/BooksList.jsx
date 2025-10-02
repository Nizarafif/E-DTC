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
} from "@chakra-ui/react";
import {
    BookOpen,
    Edit3,
    Trash2,
    MoreVertical,
    Eye,
    Download,
    Star,
    Calendar,
    User,
} from "lucide-react";

const BooksList = ({ books, onEdit, onDelete, onView }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const hoverBg = useColorModeValue("gray.50", "gray.700");

    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return "green";
            case "draft":
                return "yellow";
            case "review":
                return "blue";
            default:
                return "gray";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "published":
                return "Terbit";
            case "draft":
                return "Draft";
            case "review":
                return "Review";
            default:
                return "Unknown";
        }
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

    if (!books || books.length === 0) {
        return (
            <Box
                bg={bgColor}
                p={8}
                borderRadius="2xl"
                border="1px"
                borderColor={borderColor}
                shadow="sm"
                textAlign="center"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <VStack spacing={6}>
                        <Box
                            p={6}
                            bg="gray.100"
                            borderRadius="full"
                            color="gray.400"
                        >
                            <BookOpen size={48} />
                        </Box>
                        <VStack spacing={2}>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Belum Ada Buku
                            </Text>
                            <Text color="gray.500" maxW="400px">
                                Mulai tambahkan buku pertama Anda dengan
                                mengklik tombol "Tambah Buku" di atas
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
                }}
                gap={6}
            >
                {books.map((book, index) => (
                    <motion.div
                        key={book.id}
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
                                borderColor: "teal.300",
                            }}
                            transition="all 0.2s"
                            position="relative"
                        >
                            {/* Book Cover */}
                            <Box position="relative" h="200px" bg="gray.100">
                                {book.cover &&
                                book.cover !==
                                    "/images/Image-Cover Buku.svg" ? (
                                    <Image
                                        src={book.cover}
                                        alt={book.title}
                                        w="full"
                                        h="full"
                                        objectFit="cover"
                                        fallback={
                                            <Box
                                                w="full"
                                                h="full"
                                                bg="gray.200"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <BookOpen
                                                    size={48}
                                                    color="gray.400"
                                                />
                                            </Box>
                                        }
                                        onError={(e) => {
                                            console.log(
                                                "Image failed to load:",
                                                book.cover
                                            );
                                        }}
                                    />
                                ) : (
                                    <Box
                                        w="full"
                                        h="full"
                                        bg="gray.200"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <BookOpen size={48} color="gray.400" />
                                    </Box>
                                )}

                                {/* Status Badge */}
                                <Badge
                                    colorScheme={getStatusColor(book.status)}
                                    position="absolute"
                                    top={3}
                                    left={3}
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    fontSize="xs"
                                    fontWeight="600"
                                >
                                    {getStatusText(book.status)}
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
                                                    onView && onView(book)
                                                }
                                            >
                                                Lihat Detail
                                            </MenuItem>
                                            <MenuItem
                                                icon={<Edit3 size={16} />}
                                                onClick={() =>
                                                    onEdit && onEdit(book)
                                                }
                                            >
                                                Edit Buku
                                            </MenuItem>
                                            <MenuDivider />
                                            <MenuItem
                                                icon={<Trash2 size={16} />}
                                                color="red.500"
                                                onClick={() =>
                                                    onDelete && onDelete(book)
                                                }
                                            >
                                                Hapus Buku
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </Box>

                            {/* Book Info */}
                            <Box p={4}>
                                <VStack align="stretch" spacing={3}>
                                    {/* Title and Author */}
                                    <VStack align="start" spacing={1}>
                                        <Text
                                            fontSize="md"
                                            fontWeight="bold"
                                            color={textColor}
                                            noOfLines={2}
                                            lineHeight="1.3"
                                        >
                                            {book.title}
                                        </Text>
                                        <HStack spacing={1}>
                                            <User size={14} color="gray.400" />
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                            >
                                                {book.author}
                                            </Text>
                                        </HStack>
                                    </VStack>

                                    {/* Category */}
                                    <Badge
                                        colorScheme="teal"
                                        variant="subtle"
                                        borderRadius="md"
                                        px={2}
                                        py={1}
                                        fontSize="xs"
                                        alignSelf="flex-start"
                                    >
                                        {book.category}
                                    </Badge>

                                    {/* Stats */}
                                    <HStack
                                        justify="space-between"
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        <HStack spacing={1}>
                                            <Download size={12} />
                                            <Text>{book.downloads || 0}</Text>
                                        </HStack>
                                        <HStack spacing={1}>
                                            <Star size={12} />
                                            <Text>{book.rating || 0}</Text>
                                        </HStack>
                                        <HStack spacing={1}>
                                            <Calendar size={12} />
                                            <Text>
                                                {formatDate(book.publishDate)}
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
                                                onEdit && onEdit(book)
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
                                                onDelete && onDelete(book)
                                            }
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

export default BooksList;

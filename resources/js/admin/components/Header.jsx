import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    HStack,
    VStack,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    Avatar,
    Badge,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    useColorMode,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@chakra-ui/react";
import {
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    ChevronDown,
    Moon,
    Sun,
    ChevronRight,
    Home as HomeIcon,
    Heart,
} from "lucide-react";

const Header = ({ title, breadcrumbs, onLogout, sidebarWidth }) => {
    const [searchValue, setSearchValue] = useState("");
    const [notifications, setNotifications] = useState(0);
    const [notificationItems, setNotificationItems] = useState([]);
    const { colorMode, toggleColorMode } = useColorMode();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const searchBg = useColorModeValue("gray.50", "gray.700");

    const headerVariants = {
        initial: { y: -20, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    const searchVariants = {
        focus: {
            scale: 1.02,
            transition: { duration: 0.2 },
        },
        blur: {
            scale: 1,
            transition: { duration: 0.2 },
        },
    };

    const notificationVariants = {
        initial: { scale: 0 },
        animate: {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
            },
        },
        pulse: {
            scale: [1, 1.2, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // Fetch notifications periodically
    useEffect(() => {
        let aborted = false;
        const fetchNotifs = async () => {
            try {
                const res = await fetch("/notifications?limit=10");
                if (!res.ok) return;
                const data = await res.json();
                if (!aborted) {
                    setNotifications(data?.count || 0);
                    setNotificationItems(
                        Array.isArray(data?.items) ? data.items : []
                    );
                }
            } catch (_) {
                // ignore
            }
        };

        fetchNotifs();
        const id = setInterval(fetchNotifs, 15000);
        return () => {
            aborted = true;
            clearInterval(id);
        };
    }, []);

    return (
        <motion.div
            variants={headerVariants}
            initial="initial"
            animate="animate"
            style={{
                position: "fixed",
                top: 0,
                left: sidebarWidth,
                right: 0,
                zIndex: 999,
                transition: "left 0.3s ease-in-out",
            }}
        >
            <Box
                bg={bgColor}
                borderBottom="1px"
                borderColor={borderColor}
                px={6}
                py={3}
                shadow="sm"
                backdropFilter="blur(10px)"
                backgroundColor={useColorModeValue(
                    "rgba(255, 255, 255, 0.8)",
                    "rgba(26, 32, 44, 0.8)"
                )}
            >
                <HStack justify="space-between" align="center">
                    {/* Left Section - Title & Breadcrumbs */}
                    <VStack align="start" spacing={1}>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={textColor}
                            >
                                {title}
                            </Text>
                        </motion.div>

                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                <Breadcrumb
                                    spacing="8px"
                                    separator={
                                        <ChevronRight
                                            size={14}
                                            color="gray.400"
                                        />
                                    }
                                    fontSize="sm"
                                    color="gray.500"
                                >
                                    {breadcrumbs.map((crumb, index) => (
                                        <BreadcrumbItem
                                            key={index}
                                            isCurrentPage={
                                                index === breadcrumbs.length - 1
                                            }
                                        >
                                            <BreadcrumbLink
                                                href={crumb.href}
                                                color={
                                                    index ===
                                                    breadcrumbs.length - 1
                                                        ? "teal.500"
                                                        : "gray.500"
                                                }
                                                fontWeight={
                                                    index ===
                                                    breadcrumbs.length - 1
                                                        ? "600"
                                                        : "400"
                                                }
                                                _hover={{ color: "teal.500" }}
                                            >
                                                {crumb.label}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    ))}
                                </Breadcrumb>
                            </motion.div>
                        )}
                    </VStack>

                    {/* Right Section - Search & Profile */}
                    <HStack spacing={4}>
                        {/* Search */}
                        <motion.div
                            variants={searchVariants}
                            whileFocus="focus"
                            whileBlur="blur"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <InputGroup maxW="300px">
                                <InputLeftElement pointerEvents="none">
                                    <Search size={18} color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Cari buku, kategori..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    bg={searchBg}
                                    border="none"
                                    borderRadius="xl"
                                    _focus={{
                                        bg: bgColor,
                                        border: "2px solid",
                                        borderColor: "teal.500",
                                        boxShadow: "0 0 0 1px teal.500",
                                    }}
                                    _placeholder={{ color: "gray.400" }}
                                />
                            </InputGroup>
                        </motion.div>

                        {/* Dark Mode Toggle */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.3 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IconButton
                                    icon={
                                        colorMode === "light" ? (
                                            <Moon size={20} />
                                        ) : (
                                            <Sun size={20} />
                                        )
                                    }
                                    onClick={toggleColorMode}
                                    variant="ghost"
                                    size="md"
                                    color={textColor}
                                    _hover={{
                                        bg: useColorModeValue(
                                            "gray.100",
                                            "gray.700"
                                        ),
                                    }}
                                    borderRadius="xl"
                                    aria-label="Toggle color mode"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.45, duration: 0.3 }}
                        >
                            <Menu placement="bottom-end">
                                <MenuButton as={Box} position="relative">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <IconButton
                                            icon={<Bell size={20} />}
                                            variant="ghost"
                                            size="md"
                                            color={textColor}
                                            _hover={{
                                                bg: useColorModeValue(
                                                    "gray.100",
                                                    "gray.700"
                                                ),
                                            }}
                                            borderRadius="xl"
                                        />
                                    </motion.div>
                                    {notifications > 0 && (
                                        <motion.div
                                            variants={notificationVariants}
                                            initial="initial"
                                            animate="pulse"
                                            style={{
                                                position: "absolute",
                                                top: -2,
                                                right: -2,
                                            }}
                                        >
                                            <Badge
                                                colorScheme="red"
                                                borderRadius="full"
                                                fontSize="xs"
                                                minW="20px"
                                                h="20px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                {notifications}
                                            </Badge>
                                        </motion.div>
                                    )}
                                </MenuButton>
                                <MenuList maxW="320px" p={0} overflow="hidden">
                                    <Box
                                        px={4}
                                        py={2}
                                        borderBottom="1px"
                                        borderColor={borderColor}
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                        >
                                            Notifikasi Terbaru
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {notifications} aktivitas terakhir
                                        </Text>
                                    </Box>
                                    {notificationItems.length === 0 ? (
                                        <Box px={4} py={3}>
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                            >
                                                Tidak ada notifikasi
                                            </Text>
                                        </Box>
                                    ) : (
                                        notificationItems.map((n) => (
                                            <MenuItem
                                                key={n.id}
                                                _hover={{
                                                    bg: useColorModeValue(
                                                        "gray.50",
                                                        "gray.700"
                                                    ),
                                                }}
                                            >
                                                <VStack
                                                    align="start"
                                                    spacing={0}
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="medium"
                                                    >
                                                        {n.title ||
                                                            "Konten baru"}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                    >
                                                        {n.bookTitle || "Buku"}
                                                    </Text>
                                                </VStack>
                                            </MenuItem>
                                        ))
                                    )}
                                </MenuList>
                            </Menu>
                        </motion.div>

                        {/* Profile Menu */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.55, duration: 0.3 }}
                        >
                            <Menu>
                                <MenuButton
                                    as={motion.div}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <HStack
                                        spacing={3}
                                        cursor="pointer"
                                        p={2}
                                        borderRadius="xl"
                                        _hover={{
                                            bg: useColorModeValue(
                                                "gray.100",
                                                "gray.700"
                                            ),
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <Avatar
                                            size="sm"
                                            name="Admin User"
                                            bg="teal.500"
                                            color="white"
                                        />
                                        <VStack
                                            align="start"
                                            spacing={0}
                                            display={{
                                                base: "none",
                                                md: "flex",
                                            }}
                                        >
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color={textColor}
                                            >
                                                Admin User
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                Administrator
                                            </Text>
                                        </VStack>
                                        <ChevronDown
                                            size={16}
                                            color="gray.400"
                                        />
                                    </HStack>
                                </MenuButton>

                                <AnimatePresence>
                                    <MenuList
                                        as={motion.div}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        border="1px"
                                        borderColor={borderColor}
                                        shadow="xl"
                                        borderRadius="xl"
                                        overflow="hidden"
                                    >
                                        <MenuItem
                                            icon={<HomeIcon size={16} />}
                                            as={RouterLink}
                                            to="/"
                                            _hover={{
                                                bg: useColorModeValue(
                                                    "gray.50",
                                                    "gray.700"
                                                ),
                                            }}
                                        >
                                            Lihat Home
                                        </MenuItem>
                                        <MenuItem
                                            icon={<User size={16} />}
                                            _hover={{
                                                bg: useColorModeValue(
                                                    "gray.50",
                                                    "gray.700"
                                                ),
                                            }}
                                        >
                                            Profil Saya
                                        </MenuItem>
                                        <MenuItem
                                            icon={<Settings size={16} />}
                                            _hover={{
                                                bg: useColorModeValue(
                                                    "gray.50",
                                                    "gray.700"
                                                ),
                                            }}
                                        >
                                            Pengaturan
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem
                                            icon={<LogOut size={16} />}
                                            onClick={onLogout}
                                            color="red.500"
                                            _hover={{
                                                bg: "red.50",
                                                color: "red.600",
                                            }}
                                        >
                                            Keluar
                                        </MenuItem>
                                    </MenuList>
                                </AnimatePresence>
                            </Menu>
                        </motion.div>
                    </HStack>
                </HStack>
            </Box>
        </motion.div>
    );
};

export default Header;

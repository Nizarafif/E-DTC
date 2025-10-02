import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    IconButton,
    Divider,
    Tooltip,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    LayoutDashboard,
    BookOpen,
    FolderOpen,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Library,
} from "lucide-react";

const Sidebar = ({
    isCollapsed,
    onToggle,
    onLogout,
    activeItem,
    onItemClick,
}) => {
    const [hoveredItem, setHoveredItem] = useState(null);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const activeColor = "teal.500";
    const hoverBg = useColorModeValue("teal.50", "teal.900");

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "books", label: "Kelola Buku", icon: BookOpen },
        { id: "categories", label: "Kategori", icon: FolderOpen },
        { id: "users", label: "Pengguna", icon: Users },
        { id: "analytics", label: "Analitik", icon: BarChart3 },
        { id: "library", label: "Perpustakaan", icon: Library },
    ];

    const bottomItems = [
        { id: "settings", label: "Pengaturan", icon: Settings },
        { id: "logout", label: "Keluar", icon: LogOut, onClick: onLogout },
    ];

    const sidebarVariants = {
        expanded: {
            width: 240,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        collapsed: {
            width: 80,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
    };

    const itemVariants = {
        hover: {
            x: 4,
            transition: { duration: 0.2, ease: "easeOut" },
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 },
        },
    };

    const MenuItem = ({ item, isBottom = false }) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        const isHovered = hoveredItem === item.id;

        return (
            <Tooltip
                label={item.label}
                placement="right"
                isDisabled={!isCollapsed}
                hasArrow
                bg="gray.800"
                color="white"
                fontSize="sm"
                px={3}
                py={2}
                borderRadius="md"
            >
                <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                >
                    <HStack
                        as="button"
                        w="full"
                        p={3}
                        borderRadius="xl"
                        bg={
                            isActive
                                ? activeColor
                                : isHovered
                                ? hoverBg
                                : "transparent"
                        }
                        color={isActive ? "white" : textColor}
                        cursor="pointer"
                        onClick={() =>
                            item.onClick ? item.onClick() : onItemClick(item.id)
                        }
                        spacing={4}
                        transition="all 0.2s"
                        _hover={{
                            transform: "translateX(2px)",
                        }}
                        position="relative"
                        overflow="hidden"
                    >
                        <motion.div
                            animate={{
                                rotate: isActive ? 360 : 0,
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <Icon size={20} />
                        </motion.div>

                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Text
                                        fontSize="sm"
                                        fontWeight={isActive ? "600" : "500"}
                                        whiteSpace="nowrap"
                                    >
                                        {item.label}
                                    </Text>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Active indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="activeIndicator"
                                style={{
                                    position: "absolute",
                                    right: 8,
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                    </HStack>
                </motion.div>
            </Tooltip>
        );
    };

    return (
        <motion.div
            variants={sidebarVariants}
            animate={isCollapsed ? "collapsed" : "expanded"}
            style={{
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 1000,
            }}
        >
            <Box h="full" bg={bgColor} shadow="lg" position="relative">
                {/* Header */}
                <HStack
                    p={4}
                    justify={isCollapsed ? "center" : "space-between"}
                    h="60px"
                    align="center"
                >
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                style={{ flex: 1 }}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    pl={4}
                                >
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo"
                                        style={{
                                            height: "36px",
                                            width: "auto",
                                            objectFit: "contain",
                                        }}
                                    />
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <IconButton
                            icon={
                                isCollapsed ? (
                                    <ChevronRight size={18} />
                                ) : (
                                    <ChevronLeft size={18} />
                                )
                            }
                            onClick={onToggle}
                            variant="ghost"
                            size="sm"
                            color={textColor}
                            _hover={{ bg: hoverBg }}
                            borderRadius="lg"
                        />
                    </motion.div>
                </HStack>

                {/* Menu Items */}
                <VStack spacing={2} p={4} align="stretch">
                    {menuItems.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))}
                </VStack>

                {/* Bottom Items */}
                <Box position="absolute" bottom={4} left={0} right={0} px={4}>
                    <Divider mb={4} borderColor={borderColor} />
                    <VStack spacing={2} align="stretch">
                        {bottomItems.map((item) => (
                            <MenuItem key={item.id} item={item} isBottom />
                        ))}
                    </VStack>
                </Box>
            </Box>
        </motion.div>
    );
};

export default Sidebar;

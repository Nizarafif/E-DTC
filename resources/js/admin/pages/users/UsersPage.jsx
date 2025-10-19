import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    useToast,
    SimpleGrid,
    Card,
    CardBody,
    CardHeader,
    Badge,
    Avatar,
    AvatarGroup,
    Flex,
    Spacer,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Tooltip,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Divider,
    Alert,
    AlertIcon,
    Spinner,
    Center,
} from "@chakra-ui/react";
import AddUserModal from "../../components/AddUserModal";
import UserDetailModal from "../../components/UserDetailModal";
import UserEditModal from "../../components/UserEditModal";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import DeleteUserModal from "../../components/DeleteUserModal";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Edit3,
    Trash2,
    Eye,
    Mail,
    Calendar,
    Clock,
    Activity,
    TrendingUp,
    RefreshCw,
    Download,
    UserCheck,
    UserX,
    Key,
} from "lucide-react";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const cardBg = useColorModeValue("gray.50", "gray.700");
    const hoverBg = useColorModeValue("gray.50", "gray.700");
    const toast = useToast();

    // Filter dan sort users
    useEffect(() => {
        let filtered = [...users];

        // Filter berdasarkan search term
        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort users
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === "created_at") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredUsers(filtered);
    }, [users, searchTerm, sortBy, sortOrder]);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);

            // Try different endpoints
            const endpoints = ["/users", "/api/users"];
            let response = null;
            let usersData = [];

            for (const endpoint of endpoints) {
                try {
                    response = await fetch(endpoint, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const contentType =
                            response.headers.get("content-type");
                        if (
                            contentType &&
                            contentType.includes("application/json")
                        ) {
                            usersData = await response.json();
                            break;
                        }
                    }
                } catch (e) {
                    console.warn(`Failed to fetch from ${endpoint}:`, e);
                    continue;
                }
            }

            if (!response || !response.ok) {
                throw new Error("No valid endpoint found");
            }

            setUsers(usersData);
            setLastUpdated(new Date());

            toast({
                title: "Data Pengguna Diperbarui",
                description: `${usersData.length} pengguna ditemukan`,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Error",
                description:
                    "Gagal mengambil data pengguna. Pastikan backend Laravel berjalan dan ada data user di database.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });

            // Set empty data instead of crashing
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    // Load data awal
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleManualRefresh = () => {
        fetchUsers();
    };

    const handleUserAdded = (newUser) => {
        // Add new user to the list
        setUsers((prevUsers) => [newUser, ...prevUsers]);

        // Show success message
        toast({
            title: "Pengguna Berhasil Ditambahkan",
            description: `${newUser.name} telah ditambahkan ke sistem`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
    };

    const openAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };

    const closeAddUserModal = () => {
        setIsAddUserModalOpen(false);
    };

    const openDetailModal = (user) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedUser(null);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const openChangePasswordModal = (user) => {
        setSelectedUser(user);
        setIsChangePasswordModalOpen(true);
    };

    const closeChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
        setSelectedUser(null);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleUserUpdated = (updatedUser) => {
        // Update user in the list
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );

        toast({
            title: "Pengguna Berhasil Diperbarui",
            description: `${updatedUser.name} telah diperbarui`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
    };

    const handleUserDeleted = (deletedUser) => {
        // Remove user from the list
        setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== deletedUser.id)
        );

        toast({
            title: "Pengguna Berhasil Dihapus",
            description: `${deletedUser.name} telah dihapus dari sistem`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "-";
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
        return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getStatusColor = (user) => {
        const now = new Date();
        const lastLogin = new Date(user.last_login_at || user.created_at);
        const diffInDays = Math.floor(
            (now - lastLogin) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays <= 1) return "green";
        if (diffInDays <= 7) return "yellow";
        return "red";
    };

    const getStatusText = (user) => {
        const now = new Date();
        const lastLogin = new Date(user.last_login_at || user.created_at);
        const diffInDays = Math.floor(
            (now - lastLogin) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays <= 1) return "Aktif";
        if (diffInDays <= 7) return "Kurang Aktif";
        return "Tidak Aktif";
    };

    // Statistik pengguna
    const userStats = {
        total: users.length,
        active: users.filter((user) => {
            const now = new Date();
            const lastLogin = new Date(user.last_login_at || user.created_at);
            const diffInDays = Math.floor(
                (now - lastLogin) / (1000 * 60 * 60 * 24)
            );
            return diffInDays <= 1;
        }).length,
        inactive: users.filter((user) => {
            const now = new Date();
            const lastLogin = new Date(user.last_login_at || user.created_at);
            const diffInDays = Math.floor(
                (now - lastLogin) / (1000 * 60 * 60 * 24)
            );
            return diffInDays > 7;
        }).length,
        newThisWeek: users.filter((user) => {
            const now = new Date();
            const created = new Date(user.created_at);
            const diffInDays = Math.floor(
                (now - created) / (1000 * 60 * 60 * 24)
            );
            return diffInDays <= 7;
        }).length,
    };

    const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card
                bg={bgColor}
                border="1px"
                borderColor={borderColor}
                shadow="sm"
            >
                <CardBody p={4}>
                    <Flex align="center" justify="space-between">
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="sm"
                                color="gray.500"
                                fontWeight="medium"
                            >
                                {title}
                            </Text>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={textColor}
                            >
                                {isLoading ? "..." : value}
                            </Text>
                            {subtitle && (
                                <Text fontSize="xs" color="gray.500">
                                    {subtitle}
                                </Text>
                            )}
                            {trend && (
                                <HStack spacing={1}>
                                    <StatArrow
                                        type={
                                            trend > 0 ? "increase" : "decrease"
                                        }
                                    />
                                    <Text
                                        fontSize="xs"
                                        color={
                                            trend > 0 ? "green.500" : "red.500"
                                        }
                                    >
                                        {Math.abs(trend)}%
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                        <Box
                            p={3}
                            bg={`${color}.100`}
                            borderRadius="xl"
                            color={`${color}.600`}
                        >
                            {icon}
                        </Box>
                    </Flex>
                </CardBody>
            </Card>
        </motion.div>
    );

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
                    <Flex align="center" justify="space-between">
                        <HStack spacing={4}>
                            <Box
                                p={3}
                                bg="purple.100"
                                borderRadius="xl"
                                color="purple.600"
                            >
                                <Users size={24} />
                            </Box>
                            <VStack align="start" spacing={1}>
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    Kelola Pengguna
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Manajemen pengguna sistem E-DTC
                                </Text>
                            </VStack>
                        </HStack>

                        <HStack spacing={3}>
                            <Button
                                leftIcon={<RefreshCw size={16} />}
                                variant="outline"
                                onClick={handleManualRefresh}
                                isLoading={isLoading}
                            >
                                Refresh
                            </Button>
                            <Button
                                leftIcon={<UserPlus size={16} />}
                                colorScheme="blue"
                                onClick={openAddUserModal}
                            >
                                Tambah Pengguna
                            </Button>
                        </HStack>
                    </Flex>

                    <HStack spacing={4} mt={4} fontSize="sm" color="gray.500">
                        <HStack spacing={1}>
                            <Clock size={14} />
                            <Text>
                                Terakhir update: {formatTimeAgo(lastUpdated)}
                            </Text>
                        </HStack>
                    </HStack>
                </Box>

                {/* Statistik Pengguna */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    <StatCard
                        title="Total Pengguna"
                        value={userStats.total}
                        icon={<Users size={20} />}
                        color="blue"
                        subtitle="User terdaftar"
                    />
                    <StatCard
                        title="Pengguna Aktif"
                        value={userStats.active}
                        icon={<UserCheck size={20} />}
                        color="green"
                        subtitle="Login < 1 hari"
                    />
                    <StatCard
                        title="Tidak Aktif"
                        value={userStats.inactive}
                        icon={<UserX size={20} />}
                        color="red"
                        subtitle="Login > 7 hari"
                    />
                    <StatCard
                        title="Pengguna Baru"
                        value={userStats.newThisWeek}
                        icon={<TrendingUp size={20} />}
                        color="purple"
                        subtitle="Minggu ini"
                    />
                </SimpleGrid>

                {/* Filter dan Search */}
                <Card bg={bgColor} border="1px" borderColor={borderColor}>
                    <CardBody>
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            gap={4}
                            align="center"
                        >
                            <InputGroup maxW="300px">
                                <InputLeftElement pointerEvents="none">
                                    <Search size={18} color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Cari nama atau email..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </InputGroup>

                            <Select
                                maxW="200px"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="created_at">
                                    Tanggal Daftar
                                </option>
                                <option value="name">Nama</option>
                                <option value="email">Email</option>
                            </Select>

                            <Select
                                maxW="150px"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="desc">Terbaru</option>
                                <option value="asc">Terlama</option>
                            </Select>

                            <Spacer />

                            <Text fontSize="sm" color="gray.500">
                                {filteredUsers.length} dari {users.length}{" "}
                                pengguna
                            </Text>
                        </Flex>
                    </CardBody>
                </Card>

                {/* Tabel Pengguna */}
                <Card bg={bgColor} border="1px" borderColor={borderColor}>
                    <CardHeader>
                        <HStack spacing={3}>
                            <Box
                                p={2}
                                bg="teal.100"
                                borderRadius="lg"
                                color="teal.600"
                            >
                                <Users size={16} />
                            </Box>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Daftar Pengguna
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                        {isLoading ? (
                            <Center py={8}>
                                <VStack spacing={3}>
                                    <Spinner size="lg" color="blue.500" />
                                    <Text color="gray.500">
                                        Memuat data pengguna...
                                    </Text>
                                </VStack>
                            </Center>
                        ) : filteredUsers.length === 0 ? (
                            <Box textAlign="center" py={8}>
                                <Box fontSize="4xl" mb={3}>
                                    👥
                                </Box>
                                <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={textColor}
                                    mb={2}
                                >
                                    Tidak Ada Pengguna
                                </Text>
                                <Text color="gray.500" mb={4}>
                                    {searchTerm
                                        ? "Tidak ada pengguna yang sesuai dengan pencarian"
                                        : "Belum ada pengguna terdaftar"}
                                </Text>
                                {!searchTerm && (
                                    <Button
                                        colorScheme="blue"
                                        onClick={openAddUserModal}
                                        leftIcon={<UserPlus size={16} />}
                                    >
                                        Tambah Pengguna Pertama
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Pengguna</Th>
                                            <Th>Email</Th>
                                            <Th>Status</Th>
                                            <Th>Tanggal Daftar</Th>
                                            <Th>Aksi</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <AnimatePresence>
                                            {filteredUsers.map(
                                                (user, index) => (
                                                    <motion.tr
                                                        key={user.id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -20,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: index * 0.05,
                                                        }}
                                                        _hover={{
                                                            bg: hoverBg,
                                                        }}
                                                    >
                                                        <Td>
                                                            <HStack spacing={3}>
                                                                <Avatar
                                                                    size="sm"
                                                                    name={
                                                                        user.name
                                                                    }
                                                                    bg="blue.500"
                                                                    color="white"
                                                                />
                                                                <VStack
                                                                    align="start"
                                                                    spacing={0}
                                                                >
                                                                    <Text
                                                                        fontSize="sm"
                                                                        fontWeight="medium"
                                                                        color={
                                                                            textColor
                                                                        }
                                                                    >
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </Text>
                                                                    <Text
                                                                        fontSize="xs"
                                                                        color="gray.500"
                                                                    >
                                                                        ID:{" "}
                                                                        {
                                                                            user.id
                                                                        }
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </Td>
                                                        <Td>
                                                            <HStack spacing={2}>
                                                                <Mail
                                                                    size={14}
                                                                    color="gray.400"
                                                                />
                                                                <Text
                                                                    fontSize="sm"
                                                                    color={
                                                                        textColor
                                                                    }
                                                                >
                                                                    {user.email}
                                                                </Text>
                                                            </HStack>
                                                        </Td>
                                                        <Td>
                                                            <Badge
                                                                colorScheme={getStatusColor(
                                                                    user
                                                                )}
                                                                variant="subtle"
                                                                fontSize="xs"
                                                            >
                                                                {getStatusText(
                                                                    user
                                                                )}
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <VStack
                                                                align="start"
                                                                spacing={0}
                                                            >
                                                                <Text
                                                                    fontSize="sm"
                                                                    color={
                                                                        textColor
                                                                    }
                                                                >
                                                                    {formatDate(
                                                                        user.created_at
                                                                    )}
                                                                </Text>
                                                                <Text
                                                                    fontSize="xs"
                                                                    color="gray.500"
                                                                >
                                                                    {formatTimeAgo(
                                                                        user.created_at
                                                                    )}
                                                                </Text>
                                                            </VStack>
                                                        </Td>
                                                        <Td>
                                                            <Menu>
                                                                <MenuButton
                                                                    as={
                                                                        IconButton
                                                                    }
                                                                    icon={
                                                                        <MoreVertical
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    }
                                                                    variant="ghost"
                                                                    size="sm"
                                                                />
                                                                <MenuList>
                                                                    <MenuItem
                                                                        icon={
                                                                            <Eye
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        }
                                                                        onClick={() =>
                                                                            openDetailModal(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        Lihat
                                                                        Detail
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        icon={
                                                                            <Edit3
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        }
                                                                        onClick={() =>
                                                                            openEditModal(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                        Pengguna
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        icon={
                                                                            <Key
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        }
                                                                        onClick={() =>
                                                                            openChangePasswordModal(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        Ubah
                                                                        Password
                                                                    </MenuItem>
                                                                    <MenuDivider />
                                                                    <MenuItem
                                                                        icon={
                                                                            <Trash2
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        }
                                                                        color="red.500"
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        Hapus
                                                                        Pengguna
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </Td>
                                                    </motion.tr>
                                                )
                                            )}
                                        </AnimatePresence>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardBody>
                </Card>
            </VStack>

            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={closeAddUserModal}
                onUserAdded={handleUserAdded}
            />

            {/* User Detail Modal */}
            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                user={selectedUser}
            />

            {/* User Edit Modal */}
            <UserEditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                user={selectedUser}
                onUserUpdated={handleUserUpdated}
            />

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={closeChangePasswordModal}
                user={selectedUser}
                onPasswordChanged={() => {
                    // Optional: refresh user data or show notification
                    toast({
                        title: "Password Diubah",
                        description: "Password pengguna telah berhasil diubah",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                        position: "top-right",
                    });
                }}
            />

            {/* Delete User Modal */}
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                user={selectedUser}
                onUserDeleted={handleUserDeleted}
            />
        </motion.div>
    );
};

export default UsersPage;

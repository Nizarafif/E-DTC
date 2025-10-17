import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Select,
    Textarea,
    Divider,
    Icon,
    useDisclosure,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import {
    UserPlus,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Save,
    X,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        status: "active",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const toast = useToast();

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validasi nama
        if (!formData.name.trim()) {
            newErrors.name = "Nama wajib diisi";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Nama minimal 2 karakter";
        }

        // Validasi email
        if (!formData.email.trim()) {
            newErrors.email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
        }

        // Validasi password
        if (!formData.password) {
            newErrors.password = "Password wajib diisi";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password minimal 8 karakter";
        }

        // Validasi konfirmasi password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password wajib diisi";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Password tidak cocok";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Form Tidak Valid",
                description: "Mohon perbaiki error yang ada",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: formData.role,
                    status: formData.status,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal menambah pengguna");
            }

            const newUser = await response.json();

            toast({
                title: "Pengguna Berhasil Ditambahkan",
                description: `${newUser.name} telah ditambahkan ke sistem`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });

            // Reset form
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "user",
                status: "active",
            });
            setErrors({});

            // Notify parent component
            if (onUserAdded) {
                onUserAdded(newUser);
            }

            onClose();
        } catch (error) {
            console.error("Error adding user:", error);
            toast({
                title: "Error",
                description: error.message || "Gagal menambah pengguna",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "user",
                status: "active",
            });
            setErrors({});
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg={bgColor} border="1px" borderColor={borderColor}>
                <ModalHeader>
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            bg="blue.100"
                            borderRadius="lg"
                            color="blue.600"
                        >
                            <UserPlus size={20} />
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Tambah Pengguna Baru
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Buat akun pengguna baru untuk sistem E-DTC
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            {/* Informasi Dasar */}
                            <Box>
                                <Text
                                    fontSize="md"
                                    fontWeight="semibold"
                                    color={textColor}
                                    mb={3}
                                >
                                    Informasi Dasar
                                </Text>

                                <VStack spacing={4}>
                                    <FormControl isInvalid={!!errors.name}>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            <HStack spacing={2}>
                                                <User size={14} />
                                                <Text>Nama Lengkap</Text>
                                            </HStack>
                                        </FormLabel>
                                        <Input
                                            placeholder="Masukkan nama lengkap"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            bg={useColorModeValue(
                                                "white",
                                                "gray.700"
                                            )}
                                            borderColor={borderColor}
                                            _focus={{
                                                borderColor: "blue.500",
                                                boxShadow: "0 0 0 1px #3182ce",
                                            }}
                                        />
                                        <FormErrorMessage>
                                            {errors.name}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.email}>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            <HStack spacing={2}>
                                                <Mail size={14} />
                                                <Text>Email</Text>
                                            </HStack>
                                        </FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="Masukkan alamat email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            bg={useColorModeValue(
                                                "white",
                                                "gray.700"
                                            )}
                                            borderColor={borderColor}
                                            _focus={{
                                                borderColor: "blue.500",
                                                boxShadow: "0 0 0 1px #3182ce",
                                            }}
                                        />
                                        <FormErrorMessage>
                                            {errors.email}
                                        </FormErrorMessage>
                                    </FormControl>
                                </VStack>
                            </Box>

                            <Divider />

                            {/* Keamanan */}
                            <Box>
                                <Text
                                    fontSize="md"
                                    fontWeight="semibold"
                                    color={textColor}
                                    mb={3}
                                >
                                    Keamanan Akun
                                </Text>

                                <VStack spacing={4}>
                                    <FormControl isInvalid={!!errors.password}>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            <HStack spacing={2}>
                                                <Lock size={14} />
                                                <Text>Password</Text>
                                            </HStack>
                                        </FormLabel>
                                        <HStack>
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Masukkan password"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                bg={useColorModeValue(
                                                    "white",
                                                    "gray.700"
                                                )}
                                                borderColor={borderColor}
                                                _focus={{
                                                    borderColor: "blue.500",
                                                    boxShadow:
                                                        "0 0 0 1px #3182ce",
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                color="gray.500"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </Button>
                                        </HStack>
                                        <FormErrorMessage>
                                            {errors.password}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl
                                        isInvalid={!!errors.confirmPassword}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            <HStack spacing={2}>
                                                <Lock size={14} />
                                                <Text>Konfirmasi Password</Text>
                                            </HStack>
                                        </FormLabel>
                                        <HStack>
                                            <Input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Konfirmasi password"
                                                value={formData.confirmPassword}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "confirmPassword",
                                                        e.target.value
                                                    )
                                                }
                                                bg={useColorModeValue(
                                                    "white",
                                                    "gray.700"
                                                )}
                                                borderColor={borderColor}
                                                _focus={{
                                                    borderColor: "blue.500",
                                                    boxShadow:
                                                        "0 0 0 1px #3182ce",
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                color="gray.500"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </Button>
                                        </HStack>
                                        <FormErrorMessage>
                                            {errors.confirmPassword}
                                        </FormErrorMessage>
                                    </FormControl>
                                </VStack>
                            </Box>

                            <Divider />

                            {/* Pengaturan */}
                            <Box>
                                <Text
                                    fontSize="md"
                                    fontWeight="semibold"
                                    color={textColor}
                                    mb={3}
                                >
                                    Pengaturan Akun
                                </Text>

                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            Role Pengguna
                                        </FormLabel>
                                        <Select
                                            value={formData.role}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "role",
                                                    e.target.value
                                                )
                                            }
                                            bg={useColorModeValue(
                                                "white",
                                                "gray.700"
                                            )}
                                            borderColor={borderColor}
                                            _focus={{
                                                borderColor: "blue.500",
                                                boxShadow: "0 0 0 1px #3182ce",
                                            }}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="moderator">
                                                Moderator
                                            </option>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.600"
                                        >
                                            Status Akun
                                        </FormLabel>
                                        <Select
                                            value={formData.status}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            bg={useColorModeValue(
                                                "white",
                                                "gray.700"
                                            )}
                                            borderColor={borderColor}
                                            _focus={{
                                                borderColor: "blue.500",
                                                boxShadow: "0 0 0 1px #3182ce",
                                            }}
                                        >
                                            <option value="active">
                                                Aktif
                                            </option>
                                            <option value="inactive">
                                                Tidak Aktif
                                            </option>
                                            <option value="pending">
                                                Menunggu Verifikasi
                                            </option>
                                        </Select>
                                    </FormControl>
                                </VStack>
                            </Box>

                            {/* Info */}
                            <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle fontSize="sm">
                                        Informasi!
                                    </AlertTitle>
                                    <AlertDescription fontSize="xs">
                                        Pengguna baru akan menerima email
                                        konfirmasi dan dapat langsung login
                                        dengan kredensial yang diberikan.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack spacing={3}>
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                                leftIcon={<X size={16} />}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={isLoading}
                                loadingText="Menyimpan..."
                                leftIcon={<Save size={16} />}
                            >
                                Simpan Pengguna
                            </Button>
                        </HStack>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AddUserModal;

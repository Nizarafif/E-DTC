import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Select,
    useColorModeValue,
    useToast,
    Box,
    Divider,
    Icon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    InputGroup,
    InputRightElement,
    IconButton,
    Checkbox,
} from "@chakra-ui/react";
import {
    User,
    Mail,
    Lock,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Shield,
    Eye,
    EyeOff,
    Key,
} from "lucide-react";

const UserEditModal = ({ isOpen, onClose, user, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        status: "active",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const toast = useToast();

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "user",
                status: user.status || "active",
                password: "",
                confirmPassword: "",
            });
            setChangePassword(false);
        }
    }, [user]);

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
            newErrors.name = "Nama tidak boleh kosong";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Nama minimal 2 karakter";
        }

        // Validasi email
        if (!formData.email.trim()) {
            newErrors.email = "Email tidak boleh kosong";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
        }

        // Validasi password jika ingin mengubah password
        if (changePassword) {
            if (!formData.password.trim()) {
                newErrors.password = "Password tidak boleh kosong";
            } else if (formData.password.length < 6) {
                newErrors.password = "Password minimal 6 karakter";
            }

            if (!formData.confirmPassword.trim()) {
                newErrors.confirmPassword =
                    "Konfirmasi password tidak boleh kosong";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword =
                    "Password dan konfirmasi password tidak sama";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast({
                title: "Validasi Gagal",
                description: "Mohon periksa kembali data yang diisi",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Siapkan data yang akan dikirim
            const updateData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
            };

            // Tambahkan password jika ingin mengubah password
            if (changePassword) {
                updateData.password = formData.password;
            }

            // API call untuk update user
            const response = await fetch(`/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedUser = await response.json();

                toast({
                    title: "Pengguna Berhasil Diperbarui",
                    description: `${updatedUser.name} telah diperbarui`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });

                // Callback untuk update data di parent component
                if (onUserUpdated) {
                    onUserUpdated(updatedUser);
                }

                onClose();
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Gagal memperbarui pengguna"
                );
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
                title: "Error",
                description: error.message || "Gagal memperbarui pengguna",
                status: "error",
                duration: 5000,
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
                role: "user",
                status: "active",
                password: "",
                confirmPassword: "",
            });
            setErrors({});
            setChangePassword(false);
            setShowPassword(false);
            setShowConfirmPassword(false);
            onClose();
        }
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg={bgColor} border="1px" borderColor={borderColor}>
                <ModalHeader>
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            bg="blue.100"
                            borderRadius="lg"
                            color="blue.600"
                        >
                            <User size={20} />
                        </Box>
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Edit Pengguna
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Perbarui informasi pengguna
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        {/* Alert untuk informasi */}
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle fontSize="sm">
                                    Informasi!
                                </AlertTitle>
                                <AlertDescription fontSize="xs">
                                    Perubahan akan langsung diterapkan setelah
                                    disimpan.
                                </AlertDescription>
                            </Box>
                        </Alert>

                        {/* Form Fields */}
                        <FormControl isInvalid={errors.name}>
                            <FormLabel
                                fontSize="sm"
                                fontWeight="medium"
                                color={textColor}
                            >
                                Nama Lengkap
                            </FormLabel>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    handleInputChange("name", e.target.value)
                                }
                                placeholder="Masukkan nama lengkap"
                                size="sm"
                            />
                            <FormErrorMessage fontSize="xs">
                                {errors.name}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.email}>
                            <FormLabel
                                fontSize="sm"
                                fontWeight="medium"
                                color={textColor}
                            >
                                Email
                            </FormLabel>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                placeholder="Masukkan email"
                                size="sm"
                            />
                            <FormErrorMessage fontSize="xs">
                                {errors.email}
                            </FormErrorMessage>
                        </FormControl>

                        <HStack spacing={4}>
                            <FormControl>
                                <FormLabel
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={textColor}
                                >
                                    Role
                                </FormLabel>
                                <Select
                                    value={formData.role}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "role",
                                            e.target.value
                                        )
                                    }
                                    size="sm"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={textColor}
                                >
                                    Status
                                </FormLabel>
                                <Select
                                    value={formData.status}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    size="sm"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">
                                        Tidak Aktif
                                    </option>
                                    <option value="suspended">
                                        Ditangguhkan
                                    </option>
                                </Select>
                            </FormControl>
                        </HStack>

                        <Divider />

                        {/* Password Section */}
                        <VStack spacing={3} align="stretch">
                            <HStack spacing={3}>
                                <Box
                                    p={2}
                                    bg="orange.100"
                                    borderRadius="lg"
                                    color="orange.600"
                                >
                                    <Key size={16} />
                                </Box>
                                <Text
                                    fontSize="sm"
                                    fontWeight="bold"
                                    color={textColor}
                                >
                                    Ubah Password
                                </Text>
                            </HStack>

                            <Checkbox
                                isChecked={changePassword}
                                onChange={(e) =>
                                    setChangePassword(e.target.checked)
                                }
                                size="sm"
                                colorScheme="orange"
                            >
                                <Text fontSize="sm" color={textColor}>
                                    Ubah password pengguna
                                </Text>
                            </Checkbox>

                            {changePassword && (
                                <VStack spacing={3} align="stretch">
                                    <FormControl isInvalid={errors.password}>
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color={textColor}
                                        >
                                            Password Baru
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={formData.password}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan password baru"
                                                size="sm"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    aria-label={
                                                        showPassword
                                                            ? "Sembunyikan password"
                                                            : "Tampilkan password"
                                                    }
                                                    icon={
                                                        showPassword ? (
                                                            <EyeOff size={16} />
                                                        ) : (
                                                            <Eye size={16} />
                                                        )
                                                    }
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="xs">
                                            {errors.password}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl
                                        isInvalid={errors.confirmPassword}
                                    >
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color={textColor}
                                        >
                                            Konfirmasi Password
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={formData.confirmPassword}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "confirmPassword",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Konfirmasi password baru"
                                                size="sm"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    aria-label={
                                                        showConfirmPassword
                                                            ? "Sembunyikan password"
                                                            : "Tampilkan password"
                                                    }
                                                    icon={
                                                        showConfirmPassword ? (
                                                            <EyeOff size={16} />
                                                        ) : (
                                                            <Eye size={16} />
                                                        )
                                                    }
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="xs">
                                            {errors.confirmPassword}
                                        </FormErrorMessage>
                                    </FormControl>
                                </VStack>
                            )}
                        </VStack>

                        <Divider />

                        {/* User Info Display */}
                        <Box
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                            border="1px"
                            borderColor="gray.200"
                        >
                            <VStack align="start" spacing={2}>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    fontWeight="medium"
                                >
                                    Informasi Akun
                                </Text>
                                <HStack
                                    spacing={4}
                                    fontSize="xs"
                                    color="gray.600"
                                >
                                    <Text>ID: #{user.id}</Text>
                                    <Text>•</Text>
                                    <Text>
                                        Dibuat:{" "}
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString("id-ID")}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3}>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            isDisabled={isLoading}
                            leftIcon={<X size={16} />}
                            size="sm"
                        >
                            Batal
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText="Menyimpan..."
                            leftIcon={<Save size={16} />}
                            size="sm"
                        >
                            Simpan Perubahan
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UserEditModal;

import React, { useState } from "react";
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
    useColorModeValue,
    useToast,
    Box,
    InputGroup,
    InputRightElement,
    IconButton,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { Lock, Save, X, Eye, EyeOff, Key, Shield } from "lucide-react";

const ChangePasswordModal = ({ isOpen, onClose, user, onPasswordChanged }) => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
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

        // Validasi password
        if (!formData.password.trim()) {
            newErrors.password = "Password tidak boleh kosong";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password minimal 6 karakter";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password =
                "Password harus mengandung huruf kecil, huruf besar, dan angka";
        }

        // Validasi konfirmasi password
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword =
                "Konfirmasi password tidak boleh kosong";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword =
                "Password dan konfirmasi password tidak sama";
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
            // API call untuk mengubah password
            const response = await fetch(`/users/${user.id}/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    password: formData.password,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Password Berhasil Diubah",
                    description: `Password untuk ${user.name} telah diperbarui`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });

                // Callback untuk notifikasi ke parent component
                if (onPasswordChanged) {
                    onPasswordChanged();
                }

                handleClose();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal mengubah password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast({
                title: "Error",
                description: error.message || "Gagal mengubah password",
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
                password: "",
                confirmPassword: "",
            });
            setErrors({});
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
                            bg="orange.100"
                            borderRadius="lg"
                            color="orange.600"
                        >
                            <Key size={20} />
                        </Box>
                        <VStack align="start" spacing={1}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Ubah Password
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Ubah password untuk {user.name}
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        {/* Alert untuk informasi */}
                        <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle fontSize="sm">
                                    Perhatian!
                                </AlertTitle>
                                <AlertDescription fontSize="xs">
                                    Password yang baru akan langsung aktif dan
                                    pengguna harus login ulang.
                                </AlertDescription>
                            </Box>
                        </Alert>

                        {/* User Info */}
                        <Box
                            p={3}
                            bg="blue.50"
                            borderRadius="md"
                            border="1px"
                            borderColor="blue.200"
                        >
                            <VStack align="start" spacing={2}>
                                <Text
                                    fontSize="xs"
                                    color="blue.600"
                                    fontWeight="medium"
                                >
                                    Informasi Pengguna
                                </Text>
                                <HStack
                                    spacing={4}
                                    fontSize="sm"
                                    color="blue.700"
                                >
                                    <Text>Nama: {user.name}</Text>
                                    <Text>•</Text>
                                    <Text>Email: {user.email}</Text>
                                </HStack>
                            </VStack>
                        </Box>

                        {/* Form Fields */}
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
                                    type={showPassword ? "text" : "password"}
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
                                            setShowPassword(!showPassword)
                                        }
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage fontSize="xs">
                                {errors.password}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.confirmPassword}>
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

                        {/* Password Requirements */}
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
                                    color="gray.600"
                                    fontWeight="medium"
                                >
                                    Persyaratan Password:
                                </Text>
                                <VStack
                                    align="start"
                                    spacing={1}
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    <Text>• Minimal 6 karakter</Text>
                                    <Text>
                                        • Mengandung huruf kecil dan besar
                                    </Text>
                                    <Text>• Mengandung angka</Text>
                                </VStack>
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
                            colorScheme="orange"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText="Mengubah..."
                            leftIcon={<Lock size={16} />}
                            size="sm"
                        >
                            Ubah Password
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangePasswordModal;

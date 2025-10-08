import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    useToast,
    Badge,
    IconButton,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import {
    Upload,
    FileText,
    X,
    CheckCircle,
    AlertCircle,
    Download,
} from "lucide-react";

const PDFUploader = ({ onPDFUpload, onRemovePDF, uploadedPDF, isLoading }) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const uploadBgColor = useColorModeValue("gray.50", "gray.700");
    const uploadHoverBgColor = useColorModeValue("teal.50", "gray.600");
    const successBgColor = useColorModeValue("green.50", "green.900");
    const successBorderColor = useColorModeValue("green.200", "green.700");

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Validasi tipe file
        if (file.type !== "application/pdf") {
            toast({
                title: "Error",
                description: "File harus berupa PDF",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Validasi ukuran file (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Ukuran file maksimal 50MB",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Langsung panggil onPDFUpload tanpa simulasi progress
        onPDFUpload(file);
    };

    const handleRemoveFile = () => {
        onRemovePDF();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    if (uploadedPDF) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    bg={successBgColor}
                    border="2px"
                    borderColor={successBorderColor}
                    borderRadius="xl"
                    p={6}
                    position="relative"
                >
                    <VStack spacing={4}>
                        <HStack spacing={3}>
                            <Box
                                p={3}
                                bg="green.100"
                                borderRadius="full"
                                color="green.600"
                            >
                                <CheckCircle size={24} />
                            </Box>
                            <VStack align="start" spacing={1}>
                                <Text fontWeight="bold" color="green.700">
                                    PDF Berhasil Diupload
                                </Text>
                                <Text fontSize="sm" color="green.600">
                                    {uploadedPDF.name}
                                </Text>
                                <Text fontSize="xs" color="green.500">
                                    {formatFileSize(uploadedPDF.size)}
                                </Text>
                            </VStack>
                        </HStack>

                        <HStack spacing={2}>
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="green"
                                leftIcon={<FileText size={16} />}
                                onClick={() => {
                                    const url =
                                        URL.createObjectURL(uploadedPDF);
                                    window.open(url, "_blank");
                                }}
                            >
                                Preview
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="green"
                                leftIcon={<Download size={16} />}
                                onClick={() => {
                                    const url =
                                        URL.createObjectURL(uploadedPDF);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = uploadedPDF.name;
                                    a.click();
                                }}
                            >
                                Download
                            </Button>
                        </HStack>
                    </VStack>

                    <IconButton
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        icon={<X size={16} />}
                        onClick={handleRemoveFile}
                        aria-label="Hapus PDF"
                    />
                </Box>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                bg={bgColor}
                border="2px"
                borderColor={dragActive ? "teal.300" : borderColor}
                borderStyle={dragActive ? "dashed" : "solid"}
                borderRadius="xl"
                p={8}
                textAlign="center"
                position="relative"
                transition="all 0.2s"
                _hover={{
                    borderColor: "teal.300",
                    bg: uploadHoverBgColor,
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    style={{ display: "none" }}
                />

                <VStack spacing={6}>
                    <Box
                        p={6}
                        bg={uploadBgColor}
                        borderRadius="full"
                        color="teal.600"
                    >
                        <Upload size={48} />
                    </Box>

                    <VStack spacing={3}>
                        <Text fontSize="xl" fontWeight="bold" color={textColor}>
                            Upload PDF Isi Buku
                        </Text>
                        <Text color="gray.500" maxW="400px">
                            Drag & drop file PDF ke sini atau klik untuk memilih
                            file
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                            Maksimal 50MB • Format PDF
                        </Text>
                    </VStack>

                    <Button
                        colorScheme="teal"
                        variant="outline"
                        leftIcon={<Upload size={16} />}
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={isLoading}
                        loadingText="Uploading..."
                    >
                        Pilih File PDF
                    </Button>

                    <Alert status="info" borderRadius="lg" maxW="400px">
                        <AlertIcon />
                        <Box>
                            <AlertTitle fontSize="sm">
                                Tips Upload PDF:
                            </AlertTitle>
                            <AlertDescription fontSize="xs">
                                • Pastikan PDF sudah dalam format final
                                <br />
                                • Judul chapter akan otomatis terisi dari nama
                                file
                                <br />
                                • File akan langsung digunakan sebagai isi buku
                                <br />• Tidak perlu edit manual setelah upload
                            </AlertDescription>
                        </Box>
                    </Alert>
                </VStack>
            </Box>
        </motion.div>
    );
};

export default PDFUploader;





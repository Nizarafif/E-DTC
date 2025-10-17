import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Select,
    FormControl,
    FormLabel,
    Input,
    useToast,
    useColorModeValue,
    Card,
    CardHeader,
    CardBody,
    Divider,
    Badge,
    Spinner,
    Alert,
    AlertIcon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import { Save, BookOpen, FileText, Plus, Upload, Edit3 } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PDFUploader from "../../components/PDFUploader.jsx";

const BookContentPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState("");
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [content, setContent] = useState("");
    const [uploadedPDF, setUploadedPDF] = useState(null);
    const [contentType, setContentType] = useState("editor"); // "editor" | "pdf"
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingBooks, setIsFetchingBooks] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const selectBg = useColorModeValue("white", "gray.700");
    const inputBg = useColorModeValue("white", "gray.700");
    const editorBg = useColorModeValue("white", "gray.700");

    // CKEditor 5 configuration
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append(
            "_token",
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || ""
        );

        try {
            const response = await fetch("/book-contents/upload-image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            return { default: data.url };
        } catch (error) {
            console.error("Image upload error:", error);
            // Fallback to base64 if upload fails
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ default: reader.result });
                reader.readAsDataURL(file);
            });
        }
    };

    // CKEditor upload adapter class
    class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
        }

        upload() {
            return this.loader.file.then(
                (file) =>
                    new Promise((resolve, reject) => {
                        console.log("Uploading file:", file);

                        const body = new FormData();
                        body.append("image", file);
                        body.append(
                            "_token",
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || ""
                        );

                        console.log(
                            "Sending request to /book-contents/upload-image"
                        );

                        fetch("/book-contents/upload-image", {
                            method: "POST",
                            body: body,
                        })
                            .then((response) => {
                                console.log(
                                    "Response status:",
                                    response.status
                                );
                                if (!response.ok) {
                                    throw new Error(
                                        `HTTP error! status: ${response.status}`
                                    );
                                }
                                return response.json();
                            })
                            .then((result) => {
                                console.log("Upload result:", result);
                                resolve({
                                    default: result.url,
                                });
                            })
                            .catch((error) => {
                                console.error("Upload error:", error);
                                reject(error);
                            });
                    })
            );
        }

        abort() {
            console.log("Upload aborted");
        }
    }

    // Fetch books on component mount
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch("/books");
            if (response.ok) {
                const booksData = await response.json();
                setBooks(booksData);
            } else {
                throw new Error("Gagal mengambil data buku");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            toast({
                title: "Error",
                description: "Gagal mengambil data buku",
                status: "error",
                duration: 3000,
            });
        } finally {
            setIsFetchingBooks(false);
        }
    };

    const handlePDFUpload = (pdfFile) => {
        setUploadedPDF(pdfFile);
        setContentType("pdf");

        // Auto-fill chapter title from PDF filename
        if (!chapterTitle.trim()) {
            const fileName = pdfFile.name
                .replace(".pdf", "")
                .replace(/[-_]/g, " ");
            setChapterTitle(fileName);
        }
    };

    const handleRemovePDF = () => {
        setUploadedPDF(null);
        if (contentType === "pdf") setContentType("editor");
    };

    // DOCX upload removed

    const handleSaveContent = async () => {
        if (!selectedBookId) {
            toast({
                title: "Error",
                description: "Pilih buku terlebih dahulu",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (contentType === "editor" && !chapterTitle.trim()) {
            toast({
                title: "Error",
                description: "Judul chapter harus diisi",
                status: "error",
                duration: 3000,
            });
            return;
        }

        // Validasi berdasarkan tipe konten
        if (contentType === "editor") {
            if (!content.trim()) {
                toast({
                    title: "Error",
                    description: "Konten chapter harus diisi",
                    status: "error",
                    duration: 3000,
                });
                return;
            }
        } else if (contentType === "pdf") {
            if (!uploadedPDF) {
                toast({
                    title: "Error",
                    description: "File PDF harus diupload",
                    status: "error",
                    duration: 3000,
                });
                return;
            }
        }

        setIsLoading(true);

        try {
            let response;

            if (contentType === "pdf") {
                // Upload PDF file
                const formData = new FormData();
                formData.append("book_id", selectedBookId);
                formData.append("chapter_number", chapterNumber || "");
                formData.append(
                    "chapter_title",
                    chapterTitle || uploadedPDF.name.replace(".pdf", "")
                );
                formData.append("pdf_file", uploadedPDF);
                formData.append("content_type", "pdf");

                console.log("Sending PDF upload:", {
                    book_id: selectedBookId,
                    chapter_title: chapterTitle,
                    file_name: uploadedPDF.name,
                    file_size: uploadedPDF.size,
                    file_type: uploadedPDF.type,
                });

                response = await fetch("/book-contents/pdf", {
                    method: "POST",
                    body: formData,
                });
            } else {
                // Save editor content
                response = await fetch("/book-contents", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        book_id: selectedBookId,
                        chapter_number: chapterNumber || null,
                        chapter_title: chapterTitle,
                        content: content,
                        content_type: "editor",
                    }),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                throw new Error(errorData.message || "Gagal menyimpan konten");
            }

            toast({
                title: "Berhasil",
                description: "Konten buku berhasil disimpan",
                status: "success",
                duration: 3000,
            });

            // Reset form dan alihkan ke Kategori
            setChapterTitle("");
            setChapterNumber("");
            setContent("");
            setUploadedPDF(null);
            setContentType("editor");
            navigate("/admin?tab=categories");
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Error",
                description: error.message || "Gagal menyimpan konten",
                status: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const selectedBook = books.find(
        (book) => book.id === parseInt(selectedBookId)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <VStack spacing={6} align="stretch">
                {/* Header */}
                <Box>
                    <HStack spacing={3} mb={2}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <FileText size={28} color="teal" />
                        </motion.div>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={textColor}
                        >
                            Tambah Isi Buku
                        </Text>
                    </HStack>
                    <Text color="gray.500" fontSize="md">
                        Tambahkan konten chapter atau bagian dari buku
                        menggunakan React Quill editor dengan dukungan rich
                        text.
                    </Text>
                </Box>

                {/* Book Selection */}
                <Card bg={bgColor} border="1px" borderColor={borderColor}>
                    <CardHeader pb={2}>
                        <HStack spacing={2}>
                            <BookOpen size={20} color="teal" />
                            <Text fontSize="lg" fontWeight="semibold">
                                Pilih Buku
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody pt={2}>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel
                                    htmlFor="book-select"
                                    fontSize="sm"
                                    fontWeight="medium"
                                >
                                    Buku
                                </FormLabel>
                                {isFetchingBooks ? (
                                    <HStack spacing={2}>
                                        <Spinner size="sm" color="teal.500" />
                                        <Text fontSize="sm" color="gray.500">
                                            Memuat daftar buku...
                                        </Text>
                                    </HStack>
                                ) : (
                                    <Select
                                        id="book-select"
                                        placeholder="Pilih buku untuk ditambahkan konten"
                                        value={selectedBookId}
                                        onChange={(e) =>
                                            setSelectedBookId(e.target.value)
                                        }
                                        bg={selectBg}
                                        borderColor={borderColor}
                                    >
                                        {books.map((book) => (
                                            <option
                                                key={book.id}
                                                value={book.id}
                                            >
                                                {book.title} - {book.author}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </FormControl>

                            {selectedBook && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert status="info" borderRadius="lg">
                                        <AlertIcon />
                                        <Box>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="medium"
                                            >
                                                Buku Dipilih:{" "}
                                                {selectedBook.title}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="gray.600"
                                            >
                                                Penulis: {selectedBook.author} |
                                                Kategori:{" "}
                                                {selectedBook.category}
                                            </Text>
                                        </Box>
                                    </Alert>
                                </motion.div>
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Chapter Information */}
                <Card bg={bgColor} border="1px" borderColor={borderColor}>
                    <CardHeader pb={2}>
                        <HStack spacing={2}>
                            <Plus size={20} color="teal" />
                            <Text fontSize="lg" fontWeight="semibold">
                                Informasi Chapter
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody pt={2}>
                        <HStack spacing={4}>
                            <FormControl maxW="200px">
                                <FormLabel
                                    htmlFor="chapter-number"
                                    fontSize="sm"
                                    fontWeight="medium"
                                >
                                    Nomor Chapter (Opsional)
                                </FormLabel>
                                <Input
                                    id="chapter-number"
                                    placeholder="1, 2, 3..."
                                    value={chapterNumber}
                                    onChange={(e) =>
                                        setChapterNumber(e.target.value)
                                    }
                                    bg={inputBg}
                                    borderColor={borderColor}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel
                                    htmlFor="chapter-title"
                                    fontSize="sm"
                                    fontWeight="medium"
                                >
                                    Judul Chapter{" "}
                                    {contentType === "editor"
                                        ? "*"
                                        : "(Opsional)"}
                                </FormLabel>
                                <Input
                                    id="chapter-title"
                                    placeholder={
                                        contentType === "pdf"
                                            ? "Akan otomatis terisi dari nama file PDF"
                                            : "Masukkan judul chapter atau bagian"
                                    }
                                    value={chapterTitle}
                                    onChange={(e) =>
                                        setChapterTitle(e.target.value)
                                    }
                                    bg={inputBg}
                                    borderColor={borderColor}
                                    isDisabled={
                                        contentType === "pdf" && uploadedPDF
                                    }
                                />
                            </FormControl>
                        </HStack>
                    </CardBody>
                </Card>

                {/* Content Editor */}
                <Card bg={bgColor} border="1px" borderColor={borderColor}>
                    <CardHeader pb={2}>
                        <HStack spacing={2}>
                            <FileText size={20} color="teal" />
                            <Text fontSize="lg" fontWeight="semibold">
                                Konten Chapter
                            </Text>
                            <Badge colorScheme="red" fontSize="xs">
                                Required
                            </Badge>
                        </HStack>
                    </CardHeader>
                    <CardBody pt={2}>
                        <Tabs
                            index={contentType === "editor" ? 0 : 1}
                            onChange={(index) => {
                                if (index === 0) setContentType("editor");
                                else if (index === 1) setContentType("pdf");
                            }}
                        >
                            <TabList>
                                <Tab>
                                    <HStack spacing={2}>
                                        <Edit3 size={16} />
                                        <Text>Editor Manual</Text>
                                    </HStack>
                                </Tab>
                                <Tab>
                                    <HStack spacing={2}>
                                        <Upload size={16} />
                                        <Text>Upload PDF</Text>
                                    </HStack>
                                </Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel px={0} py={4}>
                                    <Box
                                        className="book-editor"
                                        border="1px"
                                        borderColor={borderColor}
                                        borderRadius="lg"
                                        overflow="hidden"
                                        bg={editorBg}
                                    >
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={content}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setContent(data);
                                            }}
                                            onReady={(editor) => {
                                                console.log(
                                                    "CKEditor ready, registering upload adapter"
                                                );
                                                // Register upload adapter
                                                editor.plugins.get(
                                                    "FileRepository"
                                                ).createUploadAdapter = (
                                                    loader
                                                ) => {
                                                    console.log(
                                                        "Creating upload adapter for loader:",
                                                        loader
                                                    );
                                                    return new MyUploadAdapter(
                                                        loader
                                                    );
                                                };
                                            }}
                                            config={{
                                                licenseKey: "GPL",
                                                placeholder:
                                                    "Mulai menulis konten chapter di sini...",
                                                toolbar: [
                                                    "heading",
                                                    "|",
                                                    "bold",
                                                    "italic",
                                                    "|",
                                                    "bulletedList",
                                                    "numberedList",
                                                    "|",
                                                    "link",
                                                    "insertImage",
                                                    "insertTable",
                                                    "|",
                                                    "blockQuote",
                                                    "|",
                                                    "undo",
                                                    "redo",
                                                ],
                                                image: {
                                                    toolbar: [
                                                        "imageTextAlternative",
                                                        "|",
                                                        "imageStyle:alignLeft",
                                                        "imageStyle:alignCenter",
                                                        "imageStyle:alignRight",
                                                        "|",
                                                        "imageStyle:side",
                                                        "imageStyle:wrapText",
                                                        "imageStyle:breakText",
                                                    ],
                                                },
                                                table: {
                                                    contentToolbar: [
                                                        "tableColumn",
                                                        "tableRow",
                                                        "mergeTableCells",
                                                    ],
                                                },
                                                // Upload adapter akan didaftarkan secara otomatis
                                            }}
                                        />
                                    </Box>
                                    <Text fontSize="xs" color="gray.500" mt={2}>
                                        CKEditor 5 - Editor gratis dan powerful:
                                        headings, bold, italic, lists, links,
                                        images, tables, blockquotes, dan
                                        copy-paste gambar langsung dari
                                        clipboard!
                                    </Text>
                                </TabPanel>

                                <TabPanel px={0} py={4}>
                                    <PDFUploader
                                        onPDFUpload={handlePDFUpload}
                                        onRemovePDF={handleRemovePDF}
                                        uploadedPDF={uploadedPDF}
                                        isLoading={isLoading}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </CardBody>
                </Card>

                {/* Save Button */}
                <HStack spacing={4} justify="flex-end">
                    <Button
                        leftIcon={<Save size={18} />}
                        colorScheme="teal"
                        size="lg"
                        onClick={handleSaveContent}
                        isLoading={isLoading}
                        loadingText="Menyimpan..."
                        disabled={
                            !selectedBookId ||
                            (contentType === "editor" &&
                                (!chapterTitle.trim() || !content.trim())) ||
                            (contentType === "pdf" && !uploadedPDF)
                        }
                        px={8}
                    >
                        Simpan Konten
                    </Button>
                </HStack>
            </VStack>
        </motion.div>
    );
};

export default BookContentPage;

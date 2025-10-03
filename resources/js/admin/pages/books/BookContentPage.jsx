import React, { useState, useEffect, useRef, Suspense } from "react";
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
} from "@chakra-ui/react";
import { Save, BookOpen, FileText, Plus } from "lucide-react";
import QuillEditor from "../../components/QuillEditor.jsx";
import "quill/dist/quill.snow.css";

const BookContentPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState("");
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingBooks, setIsFetchingBooks] = useState(true);
    const quillRef = useRef(null);
    const toast = useToast();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const selectBg = useColorModeValue("white", "gray.700");
    const inputBg = useColorModeValue("white", "gray.700");
    const editorBg = useColorModeValue("white", "gray.700");

    // Quill modules configuration
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ font: [] }, { size: ["small", false, "large", "huge"] }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link", "image", "video"],
            ["blockquote", "code-block"],
            [{ script: "sub" }, { script: "super" }],
            ["clean"],
        ],
        blotFormatter: {
            // opsi default cukup, bisa diatur align/resize presets
        },
        imageDrop: true,
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "align",
        "list",
        "indent",
        "link",
        "image",
        "video",
        "blockquote",
        "code-block",
        "script",
    ];

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

        if (!chapterTitle.trim()) {
            toast({
                title: "Error",
                description: "Judul chapter harus diisi",
                status: "error",
                duration: 3000,
            });
            return;
        }

        // Get content from Quill editor
        const editorContent = content;

        if (!editorContent.trim()) {
            toast({
                title: "Error",
                description: "Konten chapter harus diisi",
                status: "error",
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/book-contents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    book_id: selectedBookId,
                    chapter_number: chapterNumber || null,
                    chapter_title: chapterTitle,
                    content: editorContent,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal menyimpan konten");
            }

            toast({
                title: "Berhasil",
                description: "Konten buku berhasil disimpan",
                status: "success",
                duration: 3000,
            });

            // Reset form
            setChapterTitle("");
            setChapterNumber("");
            setContent("");
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
                                    Judul Chapter *
                                </FormLabel>
                                <Input
                                    id="chapter-title"
                                    placeholder="Masukkan judul chapter atau bagian"
                                    value={chapterTitle}
                                    onChange={(e) =>
                                        setChapterTitle(e.target.value)
                                    }
                                    bg={inputBg}
                                    borderColor={borderColor}
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
                        <Box
                            className="book-editor"
                            border="1px"
                            borderColor={borderColor}
                            borderRadius="lg"
                            overflow="hidden"
                            bg={editorBg}
                        >
                            <QuillEditor
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                formats={formats}
                                placeholder="Mulai menulis konten chapter di sini..."
                                style={{
                                    minHeight: "450px",
                                    backgroundColor: editorBg,
                                }}
                            />
                        </Box>
                        <Text fontSize="xs" color="gray.500" mt={2}>
                            React Quill Editor dengan fitur rich text:
                            formatting teks, colors, fonts, alignment, lists,
                            links, images, videos, blockquotes, code blocks, dan
                            subscript/superscript.
                        </Text>
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
                            !chapterTitle.trim() ||
                            !content.trim()
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

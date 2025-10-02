import React from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    Text,
    Button,
    useColorModeValue,
    Icon,
} from "@chakra-ui/react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Dashboard Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    onRetry={() =>
                        this.setState({ hasError: false, error: null })
                    }
                />
            );
        }

        return this.props.children;
    }
}

const ErrorFallback = ({ onRetry }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.700", "gray.200");

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={useColorModeValue("gray.50", "gray.900")}
            p={6}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    bg={bgColor}
                    p={8}
                    borderRadius="2xl"
                    border="1px"
                    borderColor={borderColor}
                    shadow="lg"
                    textAlign="center"
                    maxW="400px"
                >
                    <VStack spacing={6}>
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Box
                                p={4}
                                bg="red.100"
                                borderRadius="full"
                                color="red.600"
                            >
                                <Icon as={AlertTriangle} boxSize={8} />
                            </Box>
                        </motion.div>

                        <VStack spacing={2}>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                color={textColor}
                            >
                                Oops! Terjadi Kesalahan
                            </Text>
                            <Text
                                fontSize="sm"
                                color="gray.500"
                                textAlign="center"
                            >
                                Terjadi kesalahan tak terduga pada dashboard.
                                Silakan coba muat ulang halaman.
                            </Text>
                        </VStack>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                colorScheme="teal"
                                leftIcon={<RefreshCw size={16} />}
                                onClick={onRetry}
                                borderRadius="xl"
                                px={6}
                            >
                                Muat Ulang
                            </Button>
                        </motion.div>
                    </VStack>
                </Box>
            </motion.div>
        </Box>
    );
};

export default ErrorBoundary;

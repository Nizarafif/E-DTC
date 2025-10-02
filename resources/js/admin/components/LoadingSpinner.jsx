import React from "react";
import { motion } from "framer-motion";
import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";

const LoadingSpinner = ({ message = "Memuat..." }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = "gray.700";

    const spinnerVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
            },
        },
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    const dotVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    bg="white"
                    p={8}
                    borderRadius="3xl"
                    shadow="2xl"
                    border="1px"
                    borderColor="gray.100"
                >
                    <VStack spacing={6}>
                        {/* Main Spinner */}
                        <Box position="relative">
                            {/* Outer Ring */}
                            <motion.div
                                variants={spinnerVariants}
                                animate="animate"
                            >
                                <Box
                                    w="80px"
                                    h="80px"
                                    border="3px solid"
                                    borderColor="teal.100"
                                    borderTopColor="teal.500"
                                    borderRadius="full"
                                />
                            </motion.div>

                            {/* Inner Icon */}
                            <motion.div
                                variants={pulseVariants}
                                animate="animate"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <Box
                                    w="40px"
                                    h="40px"
                                    bg="teal.500"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="white"
                                >
                                    <BookOpen size={20} />
                                </Box>
                            </motion.div>
                        </Box>

                        {/* Loading Text */}
                        <VStack spacing={2}>
                            <Text
                                fontSize="lg"
                                fontWeight="600"
                                color={textColor}
                                textAlign="center"
                            >
                                {message}
                            </Text>

                            {/* Animated Dots */}
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                gap={1}
                            >
                                {[0, 1, 2].map((index) => (
                                    <motion.div
                                        key={index}
                                        variants={dotVariants}
                                        animate="animate"
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        <Box
                                            w="6px"
                                            h="6px"
                                            bg="teal.500"
                                            borderRadius="full"
                                        />
                                    </motion.div>
                                ))}
                            </Box>
                        </VStack>
                    </VStack>
                </Box>
            </motion.div>
        </Box>
    );
};

export default LoadingSpinner;

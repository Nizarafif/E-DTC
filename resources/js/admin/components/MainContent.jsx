import React from "react";
import { motion } from "framer-motion";
import { Box, useColorModeValue } from "@chakra-ui/react";

const MainContent = ({ children, sidebarWidth, activeItem }) => {
    const bgColor = useColorModeValue("gray.50", "gray.900");

    const contentVariants = {
        initial: {
            opacity: 0,
            y: 10,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut",
            },
        },
    };

    const childVariants = {
        initial: {
            opacity: 0,
            y: 5,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.15,
                ease: "easeOut",
            },
        },
    };

    return (
        <Box
            position="fixed"
            left={`${sidebarWidth}px`}
            top="60px" // Header height
            right={0}
            bottom={0}
            bg={bgColor}
            overflow="auto"
            transition="left 0.3s ease-in-out"
        >
            {/* Background Pattern */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.02}
                backgroundImage="radial-gradient(circle at 1px 1px, teal.500 1px, transparent 0)"
                backgroundSize="20px 20px"
                pointerEvents="none"
            />

            <Box w="full" px={6} pt={12} pb={8} position="relative" zIndex={1}>
                <motion.div
                    key={activeItem}
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                >
                    <motion.div variants={childVariants}>{children}</motion.div>
                </motion.div>
            </Box>
        </Box>
    );
};

export default MainContent;

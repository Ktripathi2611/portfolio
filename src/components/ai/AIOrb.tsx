"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy load the chat panel
const AIChatPanel = dynamic(() => import("./AIChatPanel"), {
    ssr: false,
    loading: () => null,
});

export default function AIOrb() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);

    // Delay orb appearance for better UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Show greeting pulse after initial delay
    useEffect(() => {
        if (isVisible && !hasGreeted) {
            const greetTimer = setTimeout(() => {
                setHasGreeted(true);
            }, 5000);

            return () => clearTimeout(greetTimer);
        }
    }, [isVisible, hasGreeted]);

    if (!isVisible) return null;

    return (
        <>
            {/* AI Orb Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full cursor-pointer"
                style={{
                    background: "linear-gradient(135deg, #00d4ff, #a855f7, #ec4899)",
                    boxShadow: "0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open AI Assistant"
            >
                {/* Breathing glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: "linear-gradient(135deg, #00d4ff, #a855f7)",
                        filter: "blur(15px)",
                        opacity: 0.6,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.3, 0.6],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Icon */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isOpen ? (
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        )}
                    </motion.div>
                </div>

                {/* Greeting indicator */}
                {hasGreeted && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: "#22c55e",
                            boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                        }}
                    >
                        <span className="text-[10px]">1</span>
                    </motion.div>
                )}

                {/* Floating particles around orb */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                            background: "white",
                            left: "50%",
                            top: "50%",
                        }}
                        animate={{
                            x: [0, Math.cos((i * 120 * Math.PI) / 180) * 30],
                            y: [0, Math.sin((i * 120 * Math.PI) / 180) * 30],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </motion.button>

            {/* Chat Panel */}
            <AIChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

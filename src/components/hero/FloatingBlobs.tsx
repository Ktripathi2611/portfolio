"use client";

import { motion } from "framer-motion";

export default function FloatingBlobs() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Blob 1 - Blue */}
            <motion.div
                animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -40, 20, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
                style={{
                    background: "radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />

            {/* Blob 2 - Purple */}
            <motion.div
                animate={{
                    x: [0, -60, 40, 0],
                    y: [0, 30, -50, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-30"
                style={{
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />

            {/* Blob 3 - Pink */}
            <motion.div
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -30, 40, 0],
                    scale: [1, 1.05, 0.95, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
                className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-25"
                style={{
                    background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />

            {/* Small floating particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: 'rgba(0, 212, 255, 0.5)',
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                    }}
                />
            ))}
        </div>
    );
}

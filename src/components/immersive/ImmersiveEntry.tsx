"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { performanceMonitor } from "@/lib/webgl/PerformanceMonitor";

interface ImmersiveEntryProps {
    onComplete: () => void;
}

export default function ImmersiveEntry({ onComplete }: ImmersiveEntryProps) {
    const [stage, setStage] = useState<"stars" | "zoom" | "fade">("stars");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Check if immersive mode should be enabled
        performanceMonitor.initialize();
        if (!performanceMonitor.shouldEnableImmersive()) {
            onComplete();
            return;
        }

        // Stage 1: Stars appear (2s)
        const starsTimer = setTimeout(() => {
            setStage("zoom");
        }, 2000);

        // Stage 2: Zoom toward planet (3s)
        const zoomTimer = setTimeout(() => {
            setStage("fade");
        }, 5000);

        // Stage 3: Fade out (1s)
        const fadeTimer = setTimeout(() => {
            onComplete();
        }, 6000);

        // Progress animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 1.67, 100)); // 60 steps over 6s
        }, 100);

        return () => {
            clearTimeout(starsTimer);
            clearTimeout(zoomTimer);
            clearTimeout(fadeTimer);
            clearInterval(progressInterval);
        };
    }, [onComplete]);

    const handleSkip = () => {
        onComplete();
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100]"
            style={{
                background: "radial-gradient(circle at center, #0a0a1f, #000000)",
            }}
        >
            {/* Stars */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            background: "white",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: stage === "stars" ? [0, 1] : stage === "zoom" ? [1, 2] : [2, 0],
                            opacity: stage === "stars" ? [0, 1] : stage === "zoom" ? [1, 0.5] : [0.5, 0],
                        }}
                        transition={{
                            duration: stage === "stars" ? 2 : stage === "zoom" ? 3 : 1,
                            delay: Math.random() * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Central planet/glow */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="rounded-full"
                    style={{
                        background: "radial-gradient(circle, #00d4ff, #a855f7, #000000)",
                        filter: "blur(40px)",
                    }}
                    initial={{ width: 10, height: 10, opacity: 0 }}
                    animate={{
                        width: stage === "zoom" ? [100, 800] : 100,
                        height: stage === "zoom" ? [100, 800] : 100,
                        opacity: stage === "stars" ? [0, 0.3] : stage === "zoom" ? [0.3, 0.6] : [0.6, 0],
                    }}
                    transition={{ duration: stage === "zoom" ? 3 : 1 }}
                />
            </div>

            {/* Welcome text */}
            <AnimatePresence>
                {stage === "stars" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center">
                            <h1 className="text-6xl font-display font-bold gradient-text mb-4">
                                Welcome
                            </h1>
                            <p className="text-xl text-white/60">Entering digital universe...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skip button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                onClick={handleSkip}
                className="absolute bottom-8 right-8 px-6 py-3 rounded-full text-sm font-medium"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                }}
            >
                Skip Intro
            </motion.button>

            {/* Progress bar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
            >
                <motion.div
                    className="h-full"
                    style={{
                        background: "linear-gradient(to right, #00d4ff, #a855f7)",
                        width: `${progress}%`,
                    }}
                />
            </div>
        </motion.div>
    );
}

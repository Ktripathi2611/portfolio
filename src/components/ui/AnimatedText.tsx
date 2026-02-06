"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function AnimatedText({
    text,
    className = "",
    delay = 0,
}: AnimatedTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const words = text.split(" ");

    return (
        <motion.span
            ref={ref}
            className={`inline-block ${className}`}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{
                                duration: 0.3,
                                delay: delay + wordIndex * 0.1 + charIndex * 0.03,
                            }}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                    <span className="inline-block">&nbsp;</span>
                </span>
            ))}
        </motion.span>
    );
}

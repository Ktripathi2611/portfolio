"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SkillBarProps {
    name: string;
    level: number;
    color?: "blue" | "purple" | "pink";
}

export default function SkillBar({
    name,
    level,
    color = "blue",
}: SkillBarProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const gradientColors = {
        blue: "linear-gradient(to right, #00d4ff, #a855f7)",
        purple: "linear-gradient(to right, #a855f7, #ec4899)",
        pink: "linear-gradient(to right, #ec4899, #00d4ff)",
    };

    return (
        <div ref={ref} className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm font-medium">{name}</span>
                <span className="text-white/50 text-sm">{level}%</span>
            </div>
            <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: '#1a1a25' }}
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${level}%` } : { width: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: gradientColors[color] }}
                />
            </div>
        </div>
    );
}

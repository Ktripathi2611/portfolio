"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    hoverEffect = true,
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={
                hoverEffect
                    ? {
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(0, 212, 255, 0.15)",
                    }
                    : {}
            }
            className={`glass-card p-6 transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
}

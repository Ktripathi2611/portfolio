"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    // Scroll restoration on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: "easeOut" }
                }}
                exit={{
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.3, ease: "easeIn" }
                }}
                className="w-full"
                style={{ willChange: "opacity, transform" }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

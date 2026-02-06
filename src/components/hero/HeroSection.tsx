"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import TypeWriter from "./TypeWriter";
import FloatingBlobs from "./FloatingBlobs";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";

const ParticleBackground = dynamic(() => import("./ParticleBackground"), {
    ssr: false,
});

const roles = [
    "Python Developer",
    "Backend Engineer",
    "Django Specialist",
    "REST API Developer",
    "Full Stack Developer",
];

export default function HeroSection() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative flex items-center justify-center overflow-hidden"
            style={{
                minHeight: '100vh',
                marginTop: 'calc(-1 * var(--navbar-height))',
                paddingTop: 'var(--navbar-height)',
            }}
        >
            {/* Backgrounds */}
            <ParticleBackground />
            <FloatingBlobs />

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 container text-center"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center rounded-full"
                    style={{
                        gap: 'var(--space-sm)',
                        padding: 'var(--space-sm) var(--space-md)',
                        backgroundColor: 'var(--color-glass)',
                        border: '1px solid var(--color-glass-border)',
                        marginBottom: 'var(--space-lg)',
                    }}
                >
                    <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: '#22c55e' }}
                    />
                    <span className="text-small text-muted">Available for opportunities</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-hero font-display font-bold"
                    style={{
                        lineHeight: 1.1,
                        marginBottom: 'var(--space-lg)',
                    }}
                >
                    <span style={{ color: 'var(--color-text)' }}>Hi, I&apos;m </span>
                    <span className="gradient-text">Kushal Tripathi</span>
                </motion.h1>

                {/* Dynamic Role */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-heading font-display"
                    style={{ marginBottom: 'var(--space-md)' }}
                >
                    <TypeWriter words={roles} typingSpeed={80} deletingSpeed={40} />
                    <span className="text-muted"> in Mumbai</span>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-lg text-muted"
                    style={{
                        maxWidth: '42rem',
                        marginInline: 'auto',
                        marginBottom: 'var(--space-xl)',
                        lineHeight: 1.7,
                    }}
                >
                    Backend Developer specializing in{" "}
                    <span style={{ color: 'var(--color-accent-blue)' }}>Django</span>,{" "}
                    <span style={{ color: 'var(--color-accent-purple)' }}>REST APIs</span>,{" "}
                    <span style={{ color: 'var(--color-accent-pink)' }}>Automation</span> & Scalable Systems.
                    Building robust solutions that power modern applications.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex flex-wrap items-center justify-center"
                    style={{ gap: 'var(--space-md)' }}
                >
                    <Link href="/projects" className="btn-primary">
                        View My Work
                    </Link>
                    <Link href="/contact" className="btn-secondary">
                        Get In Touch
                    </Link>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 flex flex-col items-center"
                    style={{
                        transform: 'translateX(-50%)',
                        gap: 'var(--space-sm)',
                    }}
                >
                    <span className="text-small text-muted">Scroll down</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <FaArrowDown className="text-muted" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}

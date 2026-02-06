"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                height: isScrolled ? '4rem' : 'var(--navbar-height)',
                backgroundColor: isScrolled
                    ? 'rgba(10, 10, 15, 0.9)'
                    : 'rgba(10, 10, 15, 0.5)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: isScrolled
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid transparent',
            }}
        >
            <nav className="container h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative z-10">
                    <motion.span
                        className="text-2xl font-display font-bold gradient-text"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ fontSize: isScrolled ? '1.5rem' : '1.75rem', transition: 'font-size 0.3s ease' }}
                    >
                        KT.
                    </motion.span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center" style={{ gap: 'var(--space-lg)' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative text-small font-medium transition-colors"
                            style={{
                                color: pathname === link.href
                                    ? 'var(--color-accent-blue)'
                                    : 'var(--color-text-muted)',
                            }}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <motion.span
                                    layoutId="activeIndicator"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5"
                                    style={{
                                        background: 'linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-purple))',
                                        borderRadius: '2px',
                                    }}
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}

                    {/* CTA Button */}
                    <Link href="/contact" className="btn-primary text-small">
                        Let&apos;s Talk
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden relative z-10 p-2"
                    aria-label="Toggle menu"
                    style={{ color: 'var(--color-text)' }}
                >
                    {isMobileMenuOpen ? (
                        <HiX className="w-6 h-6" />
                    ) : (
                        <HiMenuAlt3 className="w-6 h-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 right-0"
                        style={{
                            backgroundColor: 'rgba(10, 10, 15, 0.98)',
                            backdropFilter: 'blur(12px)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div className="container stack" style={{ paddingBlock: 'var(--space-lg)' }}>
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block text-title font-medium transition-colors"
                                        style={{
                                            color: pathname === link.href
                                                ? 'var(--color-accent-blue)'
                                                : 'var(--color-text)',
                                            paddingBlock: 'var(--space-sm)',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <Link href="/contact" className="btn-primary text-center" style={{ marginTop: 'var(--space-md)' }}>
                                Let&apos;s Talk
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

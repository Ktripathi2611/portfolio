"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

const socialLinks = [
    { href: "https://github.com/Ktripathi2611", icon: FaGithub, label: "GitHub" },
    { href: "https://www.linkedin.com/in/kushal-tripathi-91a751285/", icon: FaLinkedinIn, label: "LinkedIn" },
    { href: "https://twitter.com/kushal_dev", icon: FaXTwitter, label: "X (Twitter)" },
    { href: "https://instagram.com/kushal_tripathi", icon: FaInstagram, label: "Instagram" },
    { href: "https://leetcode.com/kushaltripathi", icon: SiLeetcode, label: "LeetCode" },
    { href: "mailto:tripathikushal522@gmail.com", icon: FaEnvelope, label: "Email" },
];

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="relative"
            style={{
                marginTop: 'var(--space-section)',
                borderTop: '1px solid var(--color-glass-border)',
                backgroundColor: 'var(--color-bg-secondary)',
            }}
        >
            {/* Gradient line at top */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, var(--color-accent-blue), var(--color-accent-purple), transparent)' }}
            />

            <div className="container" style={{ paddingBlock: 'var(--space-2xl)' }}>
                <div
                    className="grid gap-12"
                    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))' }}
                >
                    {/* Brand */}
                    <div className="stack stack-md">
                        <Link href="/" className="inline-block">
                            <span className="text-heading font-display font-bold gradient-text">
                                Kushal Tripathi
                            </span>
                        </Link>
                        <p className="text-small text-muted" style={{ maxWidth: '20rem', lineHeight: 1.6 }}>
                            Python Developer & Backend Specialist based in Mumbai, India.
                            Building scalable solutions with Django, REST APIs, and modern web technologies.
                        </p>
                        <div className="flex items-center text-small text-muted" style={{ gap: 'var(--space-sm)' }}>
                            <FaMapMarkerAlt className="w-4 h-4 flex-shrink-0" />
                            <span>Mumbai, Maharashtra, India</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="stack stack-md">
                        <h3 className="text-title font-display font-semibold" style={{ color: 'var(--color-text)' }}>
                            Quick Links
                        </h3>
                        <ul className="stack stack-sm">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-small text-muted transition-colors inline-block"
                                        style={{ paddingBlock: '0.125rem' }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div className="stack stack-md">
                        <h3 className="text-title font-display font-semibold" style={{ color: 'var(--color-text)' }}>
                            Get In Touch
                        </h3>
                        <div className="stack stack-sm">
                            <a
                                href="mailto:tripathikushal522@gmail.com"
                                className="text-small text-muted transition-colors block"
                            >
                                tripathikushal522@gmail.com
                            </a>
                            <a
                                href="tel:+918097077787"
                                className="text-small text-muted transition-colors block"
                            >
                                +91 8097077787
                            </a>
                        </div>
                        <div className="flex flex-wrap" style={{ gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href.startsWith("http") ? "_blank" : undefined}
                                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-muted transition-colors"
                                    style={{
                                        backgroundColor: 'var(--color-glass)',
                                        border: '1px solid var(--color-glass-border)',
                                    }}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="flex flex-col md:flex-row items-center justify-between"
                    style={{
                        marginTop: 'var(--space-xl)',
                        paddingTop: 'var(--space-lg)',
                        borderTop: '1px solid var(--color-glass-border)',
                        gap: 'var(--space-md)',
                    }}
                >
                    <p className="text-small text-muted">
                        © {currentYear} Kushal Tripathi. All rights reserved.
                    </p>
                    <p className="text-small text-muted">
                        Built with{" "}
                        <span style={{ color: 'var(--color-accent-purple)' }}>Next.js</span>,{" "}
                        <span style={{ color: 'var(--color-accent-blue)' }}>Three.js</span> &{" "}
                        <span style={{ color: 'var(--color-accent-pink)' }}>Framer Motion</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

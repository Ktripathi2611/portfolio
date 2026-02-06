"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/layout/Section";
import ContentContainer from "@/components/layout/ContentContainer";
import PageTransition from "@/components/layout/PageTransition";
import GlassCard from "@/components/ui/GlassCard";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const contactInfo = [
    {
        icon: FaEnvelope,
        label: "Email",
        value: "tripathikushal522@gmail.com",
        href: "mailto:tripathikushal522@gmail.com",
    },
    {
        icon: FaPhone,
        label: "Phone",
        value: "+91 8097077787",
        href: "tel:+918097077787",
    },
    {
        icon: FaMapMarkerAlt,
        label: "Location",
        value: "Mumbai, India",
        href: null,
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitted(true);
        setIsSubmitting(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const inputStyles: React.CSSProperties = {
        width: '100%',
        padding: 'var(--space-sm) var(--space-md)',
        backgroundColor: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-glass-border)',
        borderRadius: '0.5rem',
        color: 'var(--color-text)',
        fontSize: 'var(--text-base)',
        outline: 'none',
        transition: 'border-color 0.2s ease',
    };

    return (
        <PageTransition>
            {/* Header */}
            <Section size="lg">
                <ContentContainer size="md">
                    <div className="stack stack-lg text-center">
                        <h1 className="text-display font-display">
                            Get In <span className="gradient-text">Touch</span>
                        </h1>
                        <p className="text-lg text-muted">
                            Have a project in mind or just want to say hello? I&apos;d love to
                            hear from you. Let&apos;s create something amazing together.
                        </p>
                    </div>
                </ContentContainer>
            </Section>

            {/* Contact Form & Info */}
            <Section size="md">
                <ContentContainer>
                    <div className="grid-2">
                        {/* Form */}
                        <GlassCard>
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="stack stack-lg text-center"
                                    style={{ paddingBlock: 'var(--space-xl)' }}
                                >
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: 'rgba(0, 212, 255, 0.2)',
                                            marginInline: 'auto',
                                        }}
                                    >
                                        <FaPaperPlane style={{ color: 'var(--color-accent-blue)', fontSize: '1.5rem' }} />
                                    </div>
                                    <h3 className="text-subheading font-display" style={{ color: 'var(--color-text)' }}>
                                        Message Sent!
                                    </h3>
                                    <p className="text-body text-muted">
                                        Thank you for reaching out. I&apos;ll get back to you soon.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="stack stack-lg">
                                    <h2 className="text-title font-display" style={{ color: 'var(--color-text)' }}>
                                        Send a Message
                                    </h2>

                                    <div className="grid-2">
                                        <div className="stack stack-sm">
                                            <label htmlFor="name" className="text-small text-muted">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your name"
                                                style={inputStyles}
                                            />
                                        </div>
                                        <div className="stack stack-sm">
                                            <label htmlFor="email" className="text-small text-muted">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your@email.com"
                                                style={inputStyles}
                                            />
                                        </div>
                                    </div>

                                    <div className="stack stack-sm">
                                        <label htmlFor="subject" className="text-small text-muted">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="What's this about?"
                                            style={inputStyles}
                                        />
                                    </div>

                                    <div className="stack stack-sm">
                                        <label htmlFor="message" className="text-small text-muted">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            placeholder="Your message..."
                                            style={{ ...inputStyles, resize: 'vertical', minHeight: '8rem' }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary"
                                        style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            )}
                        </GlassCard>

                        {/* Contact Info */}
                        <div className="stack stack-lg">
                            {/* Availability */}
                            <GlassCard>
                                <div className="stack stack-md">
                                    <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
                                        <span
                                            className="w-3 h-3 rounded-full animate-pulse"
                                            style={{ backgroundColor: '#22c55e' }}
                                        />
                                        <span className="text-body" style={{ color: 'var(--color-text)' }}>
                                            Available for opportunities
                                        </span>
                                    </div>
                                    <p className="text-small text-muted">
                                        Currently open to freelance projects, full-time positions, and
                                        interesting collaborations.
                                    </p>
                                </div>
                            </GlassCard>

                            {/* Contact Details */}
                            <GlassCard>
                                <div className="stack stack-lg">
                                    <h3 className="text-title font-display" style={{ color: 'var(--color-text)' }}>
                                        Contact Information
                                    </h3>
                                    <div className="stack stack-md">
                                        {contactInfo.map((info) => (
                                            <div
                                                key={info.label}
                                                className="flex items-center"
                                                style={{ gap: 'var(--space-md)' }}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2))',
                                                    }}
                                                >
                                                    <info.icon style={{ color: 'var(--color-accent-blue)' }} />
                                                </div>
                                                <div>
                                                    <p className="text-small text-muted">{info.label}</p>
                                                    {info.href ? (
                                                        <a
                                                            href={info.href}
                                                            className="text-body transition-colors"
                                                            style={{ color: 'var(--color-text)' }}
                                                        >
                                                            {info.value}
                                                        </a>
                                                    ) : (
                                                        <p className="text-body" style={{ color: 'var(--color-text)' }}>
                                                            {info.value}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Response Time */}
                            <GlassCard>
                                <div className="stack stack-sm">
                                    <h3 className="text-title font-display" style={{ color: 'var(--color-text)' }}>
                                        Response Time
                                    </h3>
                                    <p className="text-small text-muted">
                                        I typically respond within 24-48 hours. For urgent matters,
                                        feel free to reach out via phone.
                                    </p>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </ContentContainer>
            </Section>
        </PageTransition>
    );
}

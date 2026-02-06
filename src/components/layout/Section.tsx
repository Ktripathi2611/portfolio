"use client";

import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
    id?: string;
}

export default function Section({
    children,
    className = "",
    size = "md",
    id
}: SectionProps) {
    const sizeClasses = {
        sm: "section-sm",
        md: "section",
        lg: "section-lg",
    };

    return (
        <section id={id} className={`${sizeClasses[size]} ${className}`}>
            {children}
        </section>
    );
}

"use client";

import { ReactNode } from "react";

interface ContentContainerProps {
    children: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function ContentContainer({
    children,
    className = "",
    size = "lg"
}: ContentContainerProps) {
    const sizeClasses = {
        sm: "container container-sm",
        md: "container container-md",
        lg: "container",
        xl: "container container-xl",
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            {children}
        </div>
    );
}

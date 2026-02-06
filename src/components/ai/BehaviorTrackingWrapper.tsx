"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { behaviorTracker } from "@/lib/ai/BehaviorTracker";

/**
 * BehaviorTrackingWrapper - Tracks user interactions across the app
 */
export default function BehaviorTrackingWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Track page visits
    useEffect(() => {
        behaviorTracker.trackPageVisit(pathname);
    }, [pathname]);

    // Track scroll depth
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const depth = (scrolled / scrollHeight) * 100;

            behaviorTracker.trackScrollDepth(pathname, depth);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    // Track clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickTarget =
                target.getAttribute("aria-label") ||
                target.textContent?.trim().slice(0, 50) ||
                target.tagName;

            behaviorTracker.trackClick(clickTarget);
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return <>{children}</>;
}

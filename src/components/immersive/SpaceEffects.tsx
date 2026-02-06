"use client";

import { useEffect, useRef, useState } from "react";
import { renderLoop } from "@/lib/webgl/RenderLoopManager";
import { adaptiveFPS } from "@/lib/webgl/AdaptiveFPSController";
import type { PerformanceTier } from "@/lib/webgl/AdaptiveFPSController";

interface SpaceEffectsProps {
    enableShootingStars?: boolean;
    enableConstellation?: boolean;
    enableBlackHole?: boolean;
}

export default function SpaceEffects({
    enableShootingStars = true,
    enableConstellation = true,
    enableBlackHole = true,
}: SpaceEffectsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shootingStarsRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const [particleCount, setParticleCount] = useState(100);
    const [glowIntensity, setGlowIntensity] = useState(1);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Subscribe to adaptive FPS quality changes
        adaptiveFPS.subscribe('space-effects', (tier, settings) => {
            setParticleCount(settings.particleCount);
            setGlowIntensity(settings.glowIntensity);
        });

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Track mouse for effects
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Setup viewport visibility detection
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    adaptiveFPS.setViewportVisibility(entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        if (canvas) {
            observerRef.current.observe(canvas);
        }

        // Render function
        const render = (deltaTime: number, elapsedTime: number) => {
            if (!ctx || !canvas || !adaptiveFPS.shouldRender()) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Shooting stars (spawn rate based on particle count)
            if (enableShootingStars && Math.random() < 0.01 * (particleCount / 100)) {
                shootingStarsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.5,
                    vx: Math.random() * 5 + 3,
                    vy: Math.random() * 3 + 2,
                    life: 1,
                });
            }

            // Limit total stars
            if (shootingStarsRef.current.length > particleCount) {
                shootingStarsRef.current = shootingStarsRef.current.slice(-particleCount);
            }

            // Update and draw shooting stars
            shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
                star.x += star.vx;
                star.y += star.vy;
                star.life -= deltaTime * 0.5;

                if (star.life > 0) {
                    ctx.save();
                    ctx.globalAlpha = star.life * glowIntensity;
                    ctx.strokeStyle = "#00d4ff";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(star.x - star.vx * 10, star.y - star.vy * 10);
                    ctx.stroke();
                    ctx.restore();
                    return true;
                }
                return false;
            });

            // Black hole distortion effect on hover
            if (enableBlackHole && glowIntensity > 0.5) {
                const distanceToMouse = Math.sqrt(
                    Math.pow(mousePos.current.x - canvas.width / 2, 2) +
                    Math.pow(mousePos.current.y - canvas.height / 2, 2)
                );

                if (distanceToMouse < 200) {
                    const intensity = (1 - distanceToMouse / 200) * 0.5 * glowIntensity;

                    ctx.save();
                    ctx.globalAlpha = intensity;
                    ctx.fillStyle = "rgba(168, 85, 247, 0.1)";
                    ctx.beginPath();
                    ctx.arc(mousePos.current.x, mousePos.current.y, 100, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            // Constellation effect (connecting nearby stars)
            if (enableConstellation && glowIntensity > 0.6) {
                const stars = shootingStarsRef.current.slice(0, Math.min(20, particleCount / 5));
                ctx.save();
                ctx.strokeStyle = "rgba(0, 212, 255, 0.2)";
                ctx.lineWidth = 1;

                for (let i = 0; i < stars.length; i++) {
                    for (let j = i + 1; j < stars.length; j++) {
                        const distance = Math.sqrt(
                            Math.pow(stars[i].x - stars[j].x, 2) +
                            Math.pow(stars[i].y - stars[j].y, 2)
                        );

                        if (distance < 150) {
                            ctx.globalAlpha = (1 - distance / 150) * 0.3 * glowIntensity;
                            ctx.beginPath();
                            ctx.moveTo(stars[i].x, stars[i].y);
                            ctx.lineTo(stars[j].x, stars[j].y);
                            ctx.stroke();
                        }
                    }
                }
                ctx.restore();
            }
        };

        // Subscribe to render loop
        renderLoop.subscribe("space-effects", render, 1);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            renderLoop.unsubscribe("space-effects");
            adaptiveFPS.unsubscribe('space-effects');
            if (observerRef.current && canvas) {
                observerRef.current.unobserve(canvas);
            }
        };
    }, [enableShootingStars, enableConstellation, enableBlackHole, particleCount, glowIntensity]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
}

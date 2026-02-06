"use client";

import { useEffect, useState } from "react";
import { adaptiveFPS } from "@/lib/webgl/AdaptiveFPSController";
import type { PerformanceTier } from "@/lib/webgl/AdaptiveFPSController";
import { motion, AnimatePresence } from "framer-motion";

export default function PerformanceDebugPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const [tier, setTier] = useState<PerformanceTier>('medium');
    const [fps, setFps] = useState(60);
    const [settings, setSettings] = useState({
        particleCount: 0,
        targetFPS: 60,
        refreshRate: 60,
    });

    useEffect(() => {
        // Only show in development
        if (process.env.NODE_ENV !== 'development') return;

        // Toggle with Ctrl+Shift+P
        const handleKeyboard = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                setIsVisible((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyboard);

        // Subscribe to adaptive FPS updates
        adaptiveFPS.subscribe('debug-panel', (currentTier, qualitySettings) => {
            setTier(currentTier);
            setSettings({
                particleCount: qualitySettings.particleCount,
                targetFPS: qualitySettings.targetFPS,
                refreshRate: adaptiveFPS.getCapabilities().refreshRate,
            });
        });

        // Update FPS display
        const interval = setInterval(() => {
            const fpsStats = adaptiveFPS.getCurrentFPS();
            setFps(Math.round(fpsStats.current));
        }, 500);

        return () => {
            window.removeEventListener('keydown', handleKeyboard);
            adaptiveFPS.unsubscribe('debug-panel');
            clearInterval(interval);
        };
    }, []);

    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="fixed top-4 right-4 z-[1000] p-4 rounded-lg text-xs font-mono"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        border: "1px solid rgba(0, 212, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        minWidth: "200px",
                    }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-white">Performance</h3>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-white/50 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2">
                        {/* FPS */}
                        <div className="flex justify-between">
                            <span className="text-white/60">FPS:</span>
                            <span
                                className="font-bold"
                                style={{
                                    color: fps >= 55 ? '#00ff00' : fps >= 30 ? '#ffaa00' : '#ff0000',
                                }}
                            >
                                {fps}
                            </span>
                        </div>

                        {/* Tier */}
                        <div className="flex justify-between">
                            <span className="text-white/60">Tier:</span>
                            <span
                                className="font-bold uppercase"
                                style={{
                                    color:
                                        tier === 'high' ? '#00ff00' : tier === 'medium' ? '#ffaa00' : '#ff6600',
                                }}
                            >
                                {tier}
                            </span>
                        </div>

                        {/* Target FPS */}
                        <div className="flex justify-between">
                            <span className="text-white/60">Target:</span>
                            <span className="text-white">{settings.targetFPS} fps</span>
                        </div>

                        {/* Refresh Rate */}
                        <div className="flex justify-between">
                            <span className="text-white/60">Display:</span>
                            <span className="text-white">{settings.refreshRate}Hz</span>
                        </div>

                        {/* Particles */}
                        <div className="flex justify-between">
                            <span className="text-white/60">Particles:</span>
                            <span className="text-white">{settings.particleCount}</span>
                        </div>

                        {/* Device */}
                        <div className="flex justify-between">
                            <span className="text-white/60">Device:</span>
                            <span className="text-white">
                                {adaptiveFPS.getCapabilities().isMobile ? 'Mobile' : 'Desktop'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-white/40">
                        Press Ctrl+Shift+P to toggle
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

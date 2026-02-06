"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";

interface HeatmapToggleProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export default function HeatmapToggle({ enabled, onToggle }: HeatmapToggleProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 cursor-pointer"
            onClick={() => onToggle(!enabled)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`p-3 rounded-lg transition-all ${enabled
                                ? "bg-gradient-to-r from-orange-500 to-red-500"
                                : "bg-white/10"
                            }`}
                    >
                        <FaFire
                            className={`text-2xl transition-all ${enabled ? "text-white animate-pulse" : "text-white/60"
                                }`}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Heatmap Mode</h3>
                        <p className="text-xs text-white/60">
                            {enabled ? "Intensity-based glow active" : "Show activity density"}
                        </p>
                    </div>
                </div>

                {/* Toggle Switch */}
                <div
                    className={`w-14 h-7 rounded-full transition-all relative ${enabled ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-white/20"
                        }`}
                >
                    <motion.div
                        className="absolute top-1 w-5 h-5 bg-white rounded-full"
                        animate={{ left: enabled ? "30px" : "4px" }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

"use client";

import { motion } from "framer-motion";
import type { LanguageStats } from "@/lib/github/githubDataService";

interface LanguageChartProps {
    languages: LanguageStats[];
    onLanguageClick: (language: string) => void;
    selectedLanguage: string | null;
}

export default function LanguageChart({
    languages,
    onLanguageClick,
    selectedLanguage,
}: LanguageChartProps) {
    // Calculate donut segments
    const total = languages.reduce((sum, lang) => sum + lang.count, 0);
    let cumulativePercent = 0;

    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Language Distribution</h3>

            <div className="flex items-center justify-between gap-8">
                {/* Donut Chart */}
                <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {languages.map((lang, index) => {
                            const percent = (lang.count / total) * 100;
                            const circumference = 2 * Math.PI * 40; // radius = 40
                            const offset = (cumulativePercent / 100) * circumference;
                            const dashArray = `${(percent / 100) * circumference} ${circumference}`;

                            const segment = (
                                <motion.circle
                                    key={lang.language}
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke={lang.color}
                                    strokeWidth={selectedLanguage === lang.language ? "12" : "10"}
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={-offset}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: -offset }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className="cursor-pointer transition-all"
                                    onClick={() => onLanguageClick(lang.language)}
                                    whileHover={{ strokeWidth: 13 }}
                                    opacity={selectedLanguage && selectedLanguage !== lang.language ? 0.3 : 1}
                                />
                            );

                            cumulativePercent += percent;
                            return segment;
                        })}
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className="text-3xl font-bold text-white">{languages.length}</div>
                        <div className="text-xs text-white/60">Languages</div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {languages.map((lang) => (
                        <motion.div
                            key={lang.language}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onLanguageClick(lang.language)}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${selectedLanguage === lang.language
                                    ? "bg-white/10"
                                    : "hover:bg-white/5"
                                }`}
                            style={{
                                opacity: selectedLanguage && selectedLanguage !== lang.language ? 0.4 : 1,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: lang.color }}
                                />
                                <span className="text-sm text-white">{lang.language}</span>
                            </div>
                            <div className="text-sm text-white/60">{lang.percentage}%</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

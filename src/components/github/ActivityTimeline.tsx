"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaFilter, FaCalendar, FaCode, FaGithub } from "react-icons/fa";
import type { EnhancedCommit, LanguageStats } from "@/lib/github/githubDataService";

interface ActivityTimelineProps {
    commits: EnhancedCommit[];
    languages: LanguageStats[];
    onCommitClick: (commit: EnhancedCommit) => void;
    selectedCommit: EnhancedCommit | null;
}

export default function ActivityTimeline({
    commits,
    languages,
    onCommitClick,
    selectedCommit,
}: ActivityTimelineProps) {
    const [filter, setFilter] = useState<{
        repo: string | null;
        language: string | null;
    }>({ repo: null, language: null });

    // Get unique repos
    const uniqueRepos = Array.from(new Set(commits.map((c) => c.repo)));

    // Filter commits
    const filteredCommits = commits.filter((commit) => {
        if (filter.repo && commit.repo !== filter.repo) return false;
        if (filter.language && commit.language !== filter.language) return false;
        return true;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-md border-l border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Activity Timeline</h2>

                {/* Filters */}
                <div className="space-y-3">
                    {/* Repo Filter */}
                    <div>
                        <label className="block text-xs text-white/60 mb-1">
                            <FaGithub className="inline mr-1" /> Repository
                        </label>
                        <select
                            value={filter.repo || ""}
                            onChange={(e) => setFilter({ ...filter, repo: e.target.value || null })}
                            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Repos</option>
                            {uniqueRepos.map((repo) => (
                                <option key={repo} value={repo}>
                                    {repo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Language Filter */}
                    <div>
                        <label className="block text-xs text-white/60 mb-1">
                            <FaCode className="inline mr-1" /> Language
                        </label>
                        <select
                            value={filter.language || ""}
                            onChange={(e) => setFilter({ ...filter, language: e.target.value || null })}
                            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Languages</option>
                            {languages.map((lang) => (
                                <option key={lang.language} value={lang.language}>
                                    {lang.language}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(filter.repo || filter.language) && (
                        <button
                            onClick={() => setFilter({ repo: null, language: null })}
                            className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Commit List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredCommits.length === 0 ? (
                    <div className="text-center text-white/40 py-8">
                        No commits match the filters
                    </div>
                ) : (
                    filteredCommits.map((commit) => (
                        <motion.div
                            key={commit.sha}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onCommitClick(commit)}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${selectedCommit?.sha === commit.sha
                                    ? "bg-blue-500/20 border border-blue-500/50"
                                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                                }`}
                        >
                            {/* Repo + Language */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-white/80">{commit.repo}</span>
                                    {commit.language && (
                                        <span
                                            className="text-xs px-2 py-0.5 rounded"
                                            style={{
                                                backgroundColor: getLanguageColor(commit.language) + "33",
                                                color: getLanguageColor(commit.language),
                                            }}
                                        >
                                            {commit.language}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-white/40">{formatDate(commit.date)}</span>
                            </div>

                            {/* Commit Message */}
                            <p className="text-sm text-white/90 line-clamp-2">{commit.message}</p>

                            {/* Stars */}
                            {commit.stars > 0 && (
                                <div className="mt-2 text-xs text-yellow-400">
                                    ⭐ {commit.stars} stars
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Stats Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="text-xs text-white/60">
                    Showing {filteredCommits.length} of {commits.length} commits
                </div>
            </div>
        </div>
    );
}

function getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3572A5",
        Java: "#b07219",
        "C++": "#f34b7d",
        Go: "#00ADD8",
        Rust: "#dea584",
        HTML: "#e34c26",
        CSS: "#563d7c",
    };
    return colors[language] || "#888888";
}

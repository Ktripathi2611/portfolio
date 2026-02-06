"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaCodeBranch, FaExternalLinkAlt } from "react-icons/fa";
import type { GitHubRepo, LanguageStats } from "@/lib/github/githubDataService";

interface RepoTimelineProps {
    repos: GitHubRepo[];
    languages: LanguageStats[];
    onRepoClick: (repo: GitHubRepo) => void;
    selectedRepo: GitHubRepo | null;
}

export default function RepoTimeline({
    repos,
    languages,
    onRepoClick,
    selectedRepo,
}: RepoTimelineProps) {
    const [filter, setFilter] = useState<string | null>(null);

    // Filter repos by language
    const filteredRepos = repos.filter((repo) =>
        filter ? repo.language === filter : true
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-md border-l border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">My Repositories</h2>

                {/* Language Filter */}
                <div>
                    <label className="block text-xs text-white/60 mb-2">Filter by Language</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter(null)}
                            className={`px-3 py-1 rounded text-xs transition-all ${filter === null
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/10 text-white/70 hover:bg-white/20"
                                }`}
                        >
                            All
                        </button>
                        {languages.slice(0, 5).map((lang) => (
                            <button
                                key={lang.language}
                                onClick={() => setFilter(lang.language)}
                                className={`px-3 py-1 rounded text-xs transition-all ${filter === lang.language
                                        ? "text-white"
                                        : "text-white/70 hover:text-white"
                                    }`}
                                style={{
                                    backgroundColor:
                                        filter === lang.language
                                            ? lang.color
                                            : lang.color + "33",
                                }}
                            >
                                {lang.language}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Repo List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredRepos.length === 0 ? (
                    <div className="text-center text-white/40 py-8">
                        No repositories found
                    </div>
                ) : (
                    filteredRepos.map((repo) => (
                        <motion.div
                            key={repo.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onRepoClick(repo)}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedRepo?.id === repo.id
                                    ? "bg-blue-500/20 border border-blue-500/50"
                                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                                }`}
                        >
                            {/* Repo Name + Link */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-white">{repo.name}</span>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/50 hover:text-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FaExternalLinkAlt className="text-xs" />
                                </a>
                            </div>

                            {/* Description */}
                            {repo.description && (
                                <p className="text-sm text-white/60 mb-3 line-clamp-2">
                                    {repo.description}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <FaStar /> {repo.stargazers_count}
                                </span>
                                <span className="flex items-center gap-1 text-blue-400">
                                    <FaCodeBranch /> {repo.forks_count}
                                </span>
                                {repo.language && (
                                    <span
                                        className="px-2 py-0.5 rounded"
                                        style={{
                                            backgroundColor: getLanguageColor(repo.language) + "33",
                                            color: getLanguageColor(repo.language),
                                        }}
                                    >
                                        {repo.language}
                                    </span>
                                )}
                                <span className="text-white/40 ml-auto">
                                    {formatDate(repo.updated_at)}
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-white/10">
                <div className="text-xs text-white/60">
                    Showing {filteredRepos.length} of {repos.length} repositories
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
        Go: "#00ADD8",
        Rust: "#dea584",
        HTML: "#e34c26",
        CSS: "#563d7c",
    };
    return colors[language] || "#888888";
}

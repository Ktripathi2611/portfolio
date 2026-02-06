"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FaGithub, FaStar, FaCodeBranch, FaSyncAlt, FaBook } from "react-icons/fa";
import { fetchGitHubActivity } from "@/lib/github/githubDataService";
import type { GitHubActivityData, GitHubRepo } from "@/lib/github/githubDataService";
import RepoTimeline from "@/components/github/RepoTimeline";
import LanguageChart from "@/components/github/LanguageChart";
import HeatmapToggle from "@/components/github/HeatmapToggle";

// Lazy load the heavy 3D globe
const EnhancedGlobe = dynamic(() => import("@/components/github/EnhancedGlobe"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/50">Loading globe...</div>
        </div>
    ),
});

export default function GitHubActivityClient() {
    const [data, setData] = useState<GitHubActivityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
    const [heatmapMode, setHeatmapMode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const activityData = await fetchGitHubActivity();
            setData(activityData);
            setError(null);
        } catch (err) {
            setError("Failed to load GitHub data");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            localStorage.removeItem("github_repos_data");
            await loadData();
        } finally {
            setRefreshing(false);
        }
    };

    const handleRepoClick = (repo: GitHubRepo) => {
        setSelectedRepo(repo === selectedRepo ? null : repo);
    };

    const handleLanguageClick = (language: string) => {
        setSelectedLanguage(language === selectedLanguage ? null : language);
    };

    // Filter repos by selected language
    const filteredRepos = data?.repos.filter((r) =>
        selectedLanguage ? r.language === selectedLanguage : true
    ) || [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <div className="text-white/70">Loading GitHub repositories...</div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 mb-4">{error || "Failed to load data"}</div>
                    <button
                        onClick={loadData}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 px-4"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    My GitHub Repositories
                </h1>
                <p className="text-white/70 max-w-2xl mx-auto">
                    Explore my open-source projects across the globe. Each glowing marker
                    represents a repository. Click to learn more.
                </p>

                {/* Stats Bar */}
                <div className="flex items-center justify-center gap-8 mt-6 flex-wrap">
                    <div className="flex items-center gap-2 text-white/80">
                        <FaBook className="text-xl" />
                        <span>{data.totalRepos} repos</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                        <FaStar className="text-xl" />
                        <span>{data.totalStars} stars</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                        <FaCodeBranch className="text-xl" />
                        <span>{data.totalForks} forks</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <FaSyncAlt className={`${refreshing ? "animate-spin" : ""}`} />
                        <span className="text-sm">Refresh</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
                {/* Left: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <HeatmapToggle enabled={heatmapMode} onToggle={setHeatmapMode} />
                    <LanguageChart
                        languages={data.languages}
                        onLanguageClick={handleLanguageClick}
                        selectedLanguage={selectedLanguage}
                    />
                </div>

                {/* Center: Globe */}
                <div className="lg:col-span-2 h-[500px] bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                    <EnhancedGlobe
                        repos={filteredRepos}
                        selectedRepo={selectedRepo}
                        onRepoClick={handleRepoClick}
                        heatmapMode={heatmapMode}
                    />
                </div>

                {/* Right: Timeline */}
                <div className="lg:col-span-1 h-[500px] rounded-xl overflow-hidden">
                    <RepoTimeline
                        repos={filteredRepos}
                        languages={data.languages}
                        onRepoClick={handleRepoClick}
                        selectedRepo={selectedRepo}
                    />
                </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-white/40 text-sm mt-8 pb-8">
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </div>
        </div>
    );
}

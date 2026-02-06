"use client";

import dynamic from "next/dynamic";
import Section from "../layout/Section";
import ContentContainer from "../layout/ContentContainer";
import { FaGithub, FaStar, FaCodeBranch, FaBook } from "react-icons/fa";

const GitHubGlobe = dynamic(() => import("./GitHubGlobe"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center">
            <div className="text-white/50">Loading globe...</div>
        </div>
    ),
});

export default function GlobeSection() {
    return (
        <Section size="lg" id="github-activity">
            <ContentContainer size="lg">
                <div className="stack stack-xl text-center">
                    <h2 className="text-display font-display gradient-text">
                        Live GitHub Activity
                    </h2>
                    <p className="text-body text-muted" style={{ maxWidth: "50ch", marginInline: "auto" }}>
                        Explore my repositories across the globe. Each glowing marker represents a project colored by its primary language.
                    </p>

                    {/* Globe container */}
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            height: "500px",
                            background: "radial-gradient(circle at center, rgba(0, 50, 100, 0.15), transparent)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <GitHubGlobe />
                    </div>

                    {/* Interaction Guide Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                <span className="text-lg">🖱️</span>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-sm font-medium">Drag & Scroll</p>
                                <p className="text-white/50 text-xs">Rotate and zoom the globe</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <span className="text-lg">📍</span>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-sm font-medium">Hover Markers</p>
                                <p className="text-white/50 text-xs">View repository details</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                                <FaGithub className="text-lg text-white/70" />
                            </div>
                            <div className="text-left">
                                <p className="text-white text-sm font-medium">Click to Open</p>
                                <p className="text-white/50 text-xs">Visit repo on GitHub</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ContentContainer>
        </Section>
    );
}

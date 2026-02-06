"use client";

import dynamic from "next/dynamic";
import Section from "../layout/Section";
import ContentContainer from "../layout/ContentContainer";

// Lazy load the globe for better performance
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
                        Explore my recent contributions across the globe. Each glowing marker represents a commit or update to my projects.
                    </p>

                    {/* Globe container */}
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            height: "500px",
                            background: "radial-gradient(circle at center, rgba(0, 212, 255, 0.05), transparent)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <GitHubGlobe />
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center flex-wrap gap-4 text-sm text-muted">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    background: "#00d4ff",
                                    boxShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
                                }}
                            />
                            <span>Recent Commits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ background: "rgba(255, 255, 255, 0.3)" }}
                            />
                            <span>Hover for Details</span>
                        </div>
                    </div>
                </div>
            </ContentContainer>
        </Section>
    );
}

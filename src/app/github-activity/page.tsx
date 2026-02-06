import type { Metadata } from "next";
import GitHubActivityClient from "./GitHubActivityClient";

export const metadata: Metadata = {
    title: "Live GitHub Activity | Kushal Tripathi",
    description:
        "Explore my recent GitHub contributions visualized on an interactive 3D globe. See commits, languages, and project activity in real-time.",
    openGraph: {
        title: "Live GitHub Activity - Kushal Tripathi",
        description: "Interactive 3D visualization of GitHub contributions",
    },
};

export default function GitHubActivityPage() {
    return <GitHubActivityClient />;
}

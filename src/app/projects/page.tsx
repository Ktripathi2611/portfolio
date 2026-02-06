import { Metadata } from "next";
import Section from "@/components/layout/Section";
import ContentContainer from "@/components/layout/ContentContainer";
import PageTransition from "@/components/layout/PageTransition";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
    title: "Projects | Kushal Tripathi - Python & Django Portfolio",
    description:
        "Explore projects built by Kushal Tripathi, a Python Developer in Mumbai. Featuring Django applications, REST APIs, automation tools, and full-stack solutions.",
    alternates: {
        canonical: "https://kushaltripathi.vercel.app/projects",
    },
    openGraph: {
        title: "Projects | Kushal Tripathi - Python & Django Portfolio",
        description:
            "Explore projects built by Kushal Tripathi, a Python Developer in Mumbai.",
        url: "https://kushaltripathi.vercel.app/projects",
    },
};

export default function ProjectsPage() {
    const featuredProjects = projects.filter((p) => p.featured);
    const otherProjects = projects.filter((p) => !p.featured);

    return (
        <PageTransition>
            {/* Header */}
            <Section size="lg">
                <ContentContainer size="md">
                    <div className="stack stack-lg text-center">
                        <h1 className="text-display font-display">
                            My <span className="gradient-text">Projects</span>
                        </h1>
                        <p className="text-lg text-muted">
                            A collection of projects showcasing my expertise in Python, Django,
                            REST APIs, and full-stack development.
                        </p>
                    </div>
                </ContentContainer>
            </Section>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
                <Section size="sm">
                    <ContentContainer>
                        <div className="stack stack-xl">
                            <h2 className="text-subheading font-display flex items-center" style={{ gap: 'var(--space-sm)', color: 'var(--color-text)' }}>
                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ backgroundColor: 'var(--color-accent-purple)' }}
                                />
                                Featured Projects
                            </h2>
                            <div className="grid-auto">
                                {featuredProjects.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} index={index} />
                                ))}
                            </div>
                        </div>
                    </ContentContainer>
                </Section>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
                <Section size="sm">
                    <ContentContainer>
                        <div className="stack stack-xl">
                            <h2 className="text-subheading font-display flex items-center" style={{ gap: 'var(--space-sm)', color: 'var(--color-text)' }}>
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: 'var(--color-accent-blue)' }}
                                />
                                More Projects
                            </h2>
                            <div className="grid-auto">
                                {otherProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        index={index + featuredProjects.length}
                                    />
                                ))}
                            </div>
                        </div>
                    </ContentContainer>
                </Section>
            )}

            {/* Call to Action */}
            <Section size="md">
                <ContentContainer size="sm">
                    <div className="stack stack-md text-center">
                        <p className="text-body text-muted">
                            Interested in working together?
                        </p>
                        <a
                            href="https://github.com/Ktripathi2611"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-body font-medium transition-colors"
                            style={{ color: 'var(--color-accent-blue)' }}
                        >
                            View more on GitHub →
                        </a>
                    </div>
                </ContentContainer>
            </Section>
        </PageTransition>
    );
}

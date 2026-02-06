import { Metadata } from "next";
import Section from "@/components/layout/Section";
import ContentContainer from "@/components/layout/ContentContainer";
import PageTransition from "@/components/layout/PageTransition";
import TimelineItem from "@/components/ui/TimelineItem";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
    title: "Experience | Kushal Tripathi - Backend Developer",
    description:
        "Professional experience of Kushal Tripathi as a Python Developer and Backend Developer in Mumbai. Explore my journey in software development.",
    alternates: {
        canonical: "https://kushaltripathi.vercel.app/experience",
    },
    openGraph: {
        title: "Experience | Kushal Tripathi - Backend Developer",
        description:
            "Professional experience of Kushal Tripathi as a Python Developer and Backend Developer in Mumbai.",
        url: "https://kushaltripathi.vercel.app/experience",
    },
};

export default function ExperiencePage() {
    return (
        <PageTransition>
            {/* Header */}
            <Section size="lg">
                <ContentContainer size="md">
                    <div className="stack stack-lg text-center">
                        <h1 className="text-display font-display">
                            Professional <span className="gradient-text">Experience</span>
                        </h1>
                        <p className="text-lg text-muted">
                            My journey as a Python Developer and Backend Developer, building
                            scalable solutions and learning along the way.
                        </p>
                    </div>
                </ContentContainer>
            </Section>

            {/* Timeline */}
            <Section size="md">
                <ContentContainer size="md">
                    <div className="relative">
                        {/* Vertical line */}
                        <div
                            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
                            style={{
                                background: 'linear-gradient(to bottom, var(--color-accent-blue), var(--color-accent-purple), var(--color-accent-pink))',
                                transform: 'translateX(-50%)',
                            }}
                        />

                        {/* Timeline Items */}
                        <div className="stack stack-xl">
                            {experiences.map((experience, index) => (
                                <TimelineItem key={experience.id} experience={experience} index={index} />
                            ))}
                        </div>
                    </div>
                </ContentContainer>
            </Section>

            {/* Summary Stats */}
            <Section size="md">
                <ContentContainer size="md">
                    <div className="grid-auto">
                        {[
                            { value: "3+", label: "Years of Experience" },
                            { value: "10+", label: "Projects Delivered" },
                            { value: "5+", label: "Technologies Mastered" },
                            { value: "100%", label: "Client Satisfaction" },
                        ].map((stat, index) => (
                            <div key={index} className="glass-card text-center">
                                <div className="text-display font-display gradient-text">
                                    {stat.value}
                                </div>
                                <div className="text-small text-muted" style={{ marginTop: 'var(--space-sm)' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </ContentContainer>
            </Section>

            {/* Call to Action */}
            <Section size="sm">
                <ContentContainer size="sm">
                    <div className="stack stack-md text-center">
                        <p className="text-body text-muted">
                            Looking for a dedicated Python Developer?
                        </p>
                        <a
                            href="/contact"
                            className="text-body font-medium transition-colors"
                            style={{ color: 'var(--color-accent-blue)' }}
                        >
                            Let&apos;s work together →
                        </a>
                    </div>
                </ContentContainer>
            </Section>
        </PageTransition>
    );
}

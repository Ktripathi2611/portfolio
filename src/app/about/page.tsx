import { Metadata } from "next";
import Section from "@/components/layout/Section";
import ContentContainer from "@/components/layout/ContentContainer";
import PageTransition from "@/components/layout/PageTransition";
import GlassCard from "@/components/ui/GlassCard";
import SkillBar from "@/components/ui/SkillBar";
import { skills, skillCategories } from "@/data/skills";
import {
    SiPython,
    SiDjango,
    SiPostgresql,
    SiDocker,
    SiGit,
    SiJavascript,
    SiReact,
    SiTailwindcss,
} from "react-icons/si";

export const metadata: Metadata = {
    title: "About | Kushal Tripathi - Python Developer",
    description:
        "Learn about Kushal Tripathi, a Python Developer and Backend Engineer based in Mumbai, India. Discover my skills, experience, and passion for building scalable applications.",
    alternates: {
        canonical: "https://kushaltripathi.vercel.app/about",
    },
    openGraph: {
        title: "About | Kushal Tripathi - Python Developer",
        description:
            "Learn about Kushal Tripathi, a Python Developer and Backend Engineer based in Mumbai.",
        url: "https://kushaltripathi.vercel.app/about",
    },
};

const techIcons = [
    { icon: SiPython, name: "Python", color: "#3776AB" },
    { icon: SiDjango, name: "Django", color: "#092E20" },
    { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
    { icon: SiDocker, name: "Docker", color: "#2496ED" },
    { icon: SiGit, name: "Git", color: "#F05032" },
    { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
    { icon: SiReact, name: "React", color: "#61DAFB" },
    { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
];

export default function AboutPage() {
    return (
        <PageTransition>
            {/* Header */}
            <Section size="lg">
                <ContentContainer size="md">
                    <div className="stack stack-lg text-center">
                        <h1 className="text-display font-display">
                            About <span className="gradient-text">Me</span>
                        </h1>
                        <p className="text-lg text-muted">
                            Passionate about building scalable backend solutions and creating
                            impactful software.
                        </p>
                    </div>
                </ContentContainer>
            </Section>

            {/* Bio Section */}
            <Section size="md">
                <ContentContainer>
                    <div className="grid-2">
                        {/* Bio Card */}
                        <GlassCard>
                            <div className="stack stack-lg">
                                <div>
                                    <h2 className="text-subheading font-display" style={{ color: 'var(--color-text)' }}>
                                        Hello! I&apos;m Kushal
                                    </h2>
                                    <p className="text-body text-muted" style={{ marginTop: 'var(--space-md)' }}>
                                        A Python Developer based in Mumbai, India, with a passion for
                                        building robust backend systems and scalable web applications.
                                    </p>
                                </div>
                                <p className="text-body text-muted">
                                    I specialize in Django, REST APIs, database design, and
                                    automation. I love solving complex problems and turning ideas
                                    into efficient, maintainable code.
                                </p>
                                <p className="text-body text-muted">
                                    When I&apos;m not coding, you can find me exploring new
                                    technologies, contributing to open-source projects, or
                                    mentoring aspiring developers.
                                </p>
                            </div>
                        </GlassCard>

                        {/* Tech Stack */}
                        <GlassCard>
                            <div className="stack stack-lg">
                                <h3 className="text-title font-display" style={{ color: 'var(--color-text)' }}>
                                    Tech Stack
                                </h3>
                                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)' }}>
                                    {techIcons.map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="flex flex-col items-center text-center"
                                            style={{ gap: 'var(--space-sm)', padding: 'var(--space-sm)' }}
                                        >
                                            <tech.icon
                                                className="w-8 h-8"
                                                style={{ color: tech.color }}
                                            />
                                            <span className="text-small text-muted">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </ContentContainer>
            </Section>

            {/* Skills Section */}
            <Section size="md">
                <ContentContainer>
                    <div className="stack stack-xl">
                        <h2 className="text-heading font-display text-center">
                            Skills & <span className="gradient-text">Expertise</span>
                        </h2>

                        <div className="grid-3">
                            {Object.entries(skillCategories).map(([category, categoryName]) => (
                                <GlassCard key={category}>
                                    <div className="stack stack-lg">
                                        <h3 className="text-title font-display" style={{ color: 'var(--color-accent-blue)' }}>
                                            {categoryName}
                                        </h3>
                                        <div className="stack stack-md">
                                            {skills
                                                .filter((skill) => skill.category === category)
                                                .map((skill, index) => (
                                                    <SkillBar
                                                        key={skill.name}
                                                        name={skill.name}
                                                        level={skill.level}
                                                        color={index % 3 === 0 ? "blue" : index % 3 === 1 ? "purple" : "pink"}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                </ContentContainer>
            </Section>

            {/* Education */}
            <Section size="md">
                <ContentContainer size="md">
                    <div className="stack stack-xl">
                        <h2 className="text-heading font-display text-center">
                            Education
                        </h2>
                        <GlassCard>
                            <div className="flex items-start" style={{ gap: 'var(--space-lg)' }}>
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: 'var(--color-accent-purple)', marginTop: '0.5rem' }}
                                />
                                <div className="stack stack-sm">
                                    <h3 className="text-title font-display" style={{ color: 'var(--color-text)' }}>
                                        Bachelor of Technology in Computer Science
                                    </h3>
                                    <p className="text-body text-muted">
                                        University of Mumbai | 2019 - 2023
                                    </p>
                                    <p className="text-small text-muted">
                                        Focused on software engineering, data structures, algorithms,
                                        and web development. Graduated with honors.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </ContentContainer>
            </Section>
        </PageTransition>
    );
}

"use client";

import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Project } from "@/data/projects";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-card overflow-hidden group"
            style={{ padding: 0 }}
        >
            {/* Image placeholder */}
            <div
                className="relative overflow-hidden"
                style={{
                    height: '12rem',
                    backgroundColor: 'var(--color-bg-tertiary)',
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2))',
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className="font-display font-bold"
                        style={{
                            fontSize: 'var(--text-hero)',
                            color: 'rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        {project.title.charAt(0)}
                    </span>
                </div>
                {/* Overlay on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(to top, var(--color-bg), rgba(10, 10, 15, 0.5), transparent)',
                    }}
                />
            </div>

            {/* Content */}
            <div className="stack stack-md" style={{ padding: 'var(--space-lg)' }}>
                {/* Featured badge */}
                {project.featured && (
                    <span
                        className="text-small font-medium"
                        style={{
                            display: 'inline-block',
                            padding: 'var(--space-xs) var(--space-sm)',
                            backgroundColor: 'rgba(168, 85, 247, 0.2)',
                            color: 'var(--color-accent-purple)',
                            borderRadius: '0.25rem',
                            width: 'fit-content',
                        }}
                    >
                        Featured
                    </span>
                )}

                {/* Title */}
                <h3
                    className="text-title font-display group-hover:text-[var(--color-accent-blue)] transition-colors"
                    style={{ color: 'var(--color-text)' }}
                >
                    {project.title}
                </h3>

                {/* Description */}
                <p className="text-small text-muted line-clamp-2">
                    {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap" style={{ gap: 'var(--space-xs)' }}>
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="text-small"
                            style={{
                                padding: 'var(--space-xs) var(--space-sm)',
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: '0.25rem',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 4 && (
                        <span
                            className="text-small"
                            style={{
                                padding: 'var(--space-xs) var(--space-sm)',
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: '0.25rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                            }}
                        >
                            +{project.technologies.length - 4}
                        </span>
                    )}
                </div>

                {/* Links */}
                <div className="flex" style={{ gap: 'var(--space-lg)' }}>
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-small text-muted transition-colors"
                            style={{ gap: 'var(--space-sm)' }}
                        >
                            <FaGithub className="w-4 h-4" />
                            <span>Code</span>
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-small text-muted transition-colors"
                            style={{ gap: 'var(--space-sm)' }}
                        >
                            <FaExternalLinkAlt className="w-4 h-4" />
                            <span>Live Demo</span>
                        </a>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

"use client";

import { motion } from "framer-motion";
import { Experience } from "@/data/experience";

interface TimelineItemProps {
    experience: Experience;
    index: number;
}

export default function TimelineItem({ experience, index }: TimelineItemProps) {
    const isLeft = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex ${isLeft ? "md:justify-start" : "md:justify-end"}`}
        >
            {/* Timeline dot */}
            <div
                className="absolute left-1/2 w-4 h-4 rounded-full hidden md:block"
                style={{
                    background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
                    transform: 'translateX(-50%)',
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                }}
            />

            {/* Card */}
            <div
                className={`glass-card w-full md:w-[calc(50%-2rem)] ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
            >
                <div className="stack stack-md">
                    {/* Period */}
                    <span
                        className="text-small font-medium"
                        style={{ color: 'var(--color-accent-blue)' }}
                    >
                        {experience.period}
                    </span>

                    {/* Role */}
                    <h3 className="text-title font-display" style={{ color: 'var(--color-text)' }}>
                        {experience.title}
                    </h3>

                    {/* Company */}
                    <p className="text-body" style={{ color: 'var(--color-accent-purple)' }}>
                        {experience.company}
                        {experience.location && (
                            <span className="text-muted"> · {experience.location}</span>
                        )}
                    </p>

                    {/* Description */}
                    <p className="text-small text-muted">{experience.description}</p>

                    {/* Achievements */}
                    {experience.achievements && experience.achievements.length > 0 && (
                        <ul className="stack stack-sm" style={{ paddingLeft: 'var(--space-md)' }}>
                            {experience.achievements.map((achievement, i) => (
                                <li
                                    key={i}
                                    className="text-small text-muted"
                                    style={{ listStyleType: 'disc' }}
                                >
                                    {achievement}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Technologies */}
                    <div className="flex flex-wrap" style={{ gap: 'var(--space-xs)' }}>
                        {experience.technologies.map((tech) => (
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
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

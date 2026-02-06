export interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
    technologies: string[];
}

export const experiences: Experience[] = [
    {
        id: "exp-1",
        title: "Python Developer",
        company: "Freelance / Independent Projects",
        location: "Mumbai, India",
        period: "2023 - Present",
        description: "Building scalable backend solutions and full-stack applications for various clients, focusing on Django, REST APIs, and automation systems.",
        achievements: [
            "Developed and deployed 10+ production-ready web applications",
            "Built real-time collaborative tools using WebSocket technology",
            "Created automated data processing pipelines saving 50+ hours/week",
            "Implemented secure REST APIs with JWT authentication",
        ],
        technologies: ["Python", "Django", "FastAPI", "PostgreSQL", "Docker", "React"],
    },
    {
        id: "exp-2",
        title: "Backend Developer",
        company: "Project-Based Work",
        location: "Mumbai, India",
        period: "2022 - 2023",
        description: "Specialized in building robust backend systems and APIs for web applications, with focus on performance optimization and security.",
        achievements: [
            "Designed and implemented RESTful APIs for e-commerce platforms",
            "Optimized database queries reducing response time by 60%",
            "Integrated third-party services and payment gateways",
            "Set up CI/CD pipelines for automated deployment",
        ],
        technologies: ["Python", "Django REST Framework", "Redis", "Celery", "AWS"],
    },
    {
        id: "exp-3",
        title: "Full-Stack Developer",
        company: "Learning & Development",
        location: "Mumbai, India",
        period: "2021 - 2022",
        description: "Intensive learning period focusing on full-stack development, building personal projects to master modern web technologies.",
        achievements: [
            "Completed comprehensive Python and Django coursework",
            "Built multiple full-stack applications from scratch",
            "Learned React and Next.js for frontend development",
            "Contributed to open-source projects on GitHub",
        ],
        technologies: ["Python", "JavaScript", "React", "HTML/CSS", "Git"],
    },
];

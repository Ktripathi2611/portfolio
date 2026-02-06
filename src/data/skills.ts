export interface Skill {
    name: string;
    level: number; // 0-100
    category: "backend" | "frontend" | "database" | "devops" | "tools";
}

export const skills: Skill[] = [
    // Backend
    { name: "Python", level: 95, category: "backend" },
    { name: "Django", level: 90, category: "backend" },
    { name: "Django REST Framework", level: 88, category: "backend" },
    { name: "FastAPI", level: 80, category: "backend" },
    { name: "REST APIs", level: 92, category: "backend" },
    { name: "Celery", level: 75, category: "backend" },

    // Frontend
    { name: "JavaScript", level: 85, category: "frontend" },
    { name: "TypeScript", level: 78, category: "frontend" },
    { name: "React", level: 82, category: "frontend" },
    { name: "Next.js", level: 80, category: "frontend" },
    { name: "HTML/CSS", level: 90, category: "frontend" },
    { name: "Tailwind CSS", level: 85, category: "frontend" },

    // Database
    { name: "PostgreSQL", level: 88, category: "database" },
    { name: "MongoDB", level: 80, category: "database" },
    { name: "Redis", level: 75, category: "database" },
    { name: "MySQL", level: 82, category: "database" },

    // DevOps
    { name: "Docker", level: 82, category: "devops" },
    { name: "Git", level: 90, category: "devops" },
    { name: "Linux", level: 78, category: "devops" },
    { name: "AWS", level: 70, category: "devops" },
    { name: "CI/CD", level: 75, category: "devops" },

    // Tools
    { name: "VS Code", level: 95, category: "tools" },
    { name: "Postman", level: 90, category: "tools" },
    { name: "Selenium", level: 80, category: "tools" },
    { name: "BeautifulSoup", level: 85, category: "tools" },
];

export const skillCategories = {
    backend: "Backend Development",
    frontend: "Frontend Development",
    database: "Databases",
    devops: "DevOps & Tools",
    tools: "Development Tools",
};

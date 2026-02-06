export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    image: string;
    featured: boolean;
}

export const projects: Project[] = [
    {
        id: "codesync",
        title: "CodeSync - Real-Time Collaborative Editor",
        description: "A browser-based collaborative code editor with real-time synchronization and code execution.",
        longDescription: "Built a complete real-time collaborative code editing platform with WebSocket-based synchronization, Python/JavaScript code execution in sandboxed environments, and AI-powered code analysis using Hugging Face models.",
        technologies: ["Python", "Django", "React", "WebSocket", "Docker", "PostgreSQL"],
        githubUrl: "https://github.com/Ktripathi2611",
        featured: true,
        image: "/images/projects/codesync.jpg",
    },
    {
        id: "kisan-mitra",
        title: "Kisan Mitra - Farmer Assistance Platform",
        description: "Agricultural support platform connecting farmers with resources and market information.",
        longDescription: "Developed a comprehensive platform for farmers featuring weather forecasts, crop recommendations, market prices, and government scheme information with multi-language support.",
        technologies: ["Python", "Django", "REST API", "PostgreSQL", "React"],
        githubUrl: "https://github.com/Ktripathi2611",
        featured: true,
        image: "/images/projects/kisan-mitra.jpg",
    },
    {
        id: "price-tracker",
        title: "Price Tracker - E-commerce Monitor",
        description: "Automated price tracking system for e-commerce products with alerts.",
        longDescription: "Built a web scraping solution that monitors product prices across multiple e-commerce platforms and sends automated alerts when prices drop below specified thresholds.",
        technologies: ["Python", "BeautifulSoup", "Selenium", "MongoDB", "FastAPI"],
        githubUrl: "https://github.com/Ktripathi2611",
        featured: false,
        image: "/images/projects/price-tracker.jpg",
    },
    {
        id: "rest-api-framework",
        title: "REST API Framework",
        description: "Scalable REST API boilerplate with authentication and rate limiting.",
        longDescription: "Created a production-ready REST API framework with JWT authentication, role-based access control, rate limiting, caching, and comprehensive API documentation using OpenAPI.",
        technologies: ["Python", "Django REST Framework", "Redis", "PostgreSQL", "Docker"],
        githubUrl: "https://github.com/Ktripathi2611",
        featured: true,
        image: "/images/projects/rest-api.jpg",
    },
    {
        id: "automation-suite",
        title: "Automation Suite",
        description: "Collection of automation scripts for various business processes.",
        longDescription: "Developed a suite of automation tools including data processing pipelines, report generation systems, and workflow automation scripts that reduced manual work by 70%.",
        technologies: ["Python", "Pandas", "Selenium", "OpenPyXL", "Schedule"],
        githubUrl: "https://github.com/Ktripathi2611",
        featured: false,
        image: "/images/projects/automation.jpg",
    },
    {
        id: "portfolio-website",
        title: "Developer Portfolio",
        description: "Modern, animated developer portfolio with 3D elements.",
        longDescription: "This very portfolio you're viewing! Built with Next.js, Three.js, and Framer Motion featuring cinematic animations, 3D particle backgrounds, and optimal SEO implementation.",
        technologies: ["Next.js", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
        githubUrl: "https://github.com/Ktripathi2611",
        liveUrl: "https://kushaltripathi.vercel.app",
        featured: false,
        image: "/images/projects/portfolio.jpg",
    },
];

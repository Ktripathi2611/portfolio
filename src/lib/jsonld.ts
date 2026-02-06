// JSON-LD Structured Data for SEO
export const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kushal Tripathi",
    jobTitle: "Python Developer | Backend Developer | Full-Stack Developer",
    url: "https://kushaltripathi.vercel.app",
    email: "tripathikushal522@gmail.com",
    telephone: "+91 8097077787",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Andheri",
        addressRegion: "Mumbai, Maharashtra",
        addressCountry: "India",
    },
    sameAs: [
        "https://github.com/Ktripathi2611",
    ],
    knowsAbout: [
        "Python",
        "Django",
        "REST APIs",
        "Backend Development",
        "Full-Stack Development",
        "JavaScript",
        "React",
        "Next.js",
        "PostgreSQL",
        "MongoDB",
    ],
};

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kushal Tripathi Portfolio",
    url: "https://kushaltripathi.vercel.app",
    description: "Portfolio website of Kushal Tripathi - Python Developer and Backend Developer based in Mumbai, India",
    author: {
        "@type": "Person",
        name: "Kushal Tripathi",
    },
};

export const softwareDeveloperSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareDeveloper",
    name: "Kushal Tripathi",
    description: "Backend Developer specializing in Django, REST APIs, Automation & Scalable Systems",
    url: "https://kushaltripathi.vercel.app",
    email: "tripathikushal522@gmail.com",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "India",
    },
    knowsAbout: [
        "Python Development",
        "Django Framework",
        "REST API Development",
        "Backend Architecture",
        "Database Design",
        "System Automation",
    ],
};

// Function to get combined JSON-LD for head
export function getJsonLd() {
    return {
        "@context": "https://schema.org",
        "@graph": [personSchema, websiteSchema, softwareDeveloperSchema],
    };
}

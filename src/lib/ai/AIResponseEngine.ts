/**
 * AIResponseEngine - Contextual response generation based on user behavior
 */

import { UserProfile } from './BehaviorTracker';

interface AIResponse {
    greeting: string;
    suggestions: string[];
    quickActions: { label: string; action: string }[];
    tone: 'professional' | 'friendly' | 'enthusiastic';
}

interface ConversationContext {
    messageCount: number;
    topics: string[];
    lastTopic: string | null;
}

class AIResponseEngine {
    private static instance: AIResponseEngine;
    private context: ConversationContext = {
        messageCount: 0,
        topics: [],
        lastTopic: null,
    };

    private constructor() { }

    static getInstance(): AIResponseEngine {
        if (!AIResponseEngine.instance) {
            AIResponseEngine.instance = new AIResponseEngine();
        }
        return AIResponseEngine.instance;
    }

    /**
     * Generate personalized greeting based on user profile
     */
    generateGreeting(profile: UserProfile, isReturning: boolean): string {
        if (isReturning) {
            return "Welcome back! 👋 Great to see you again. What can I help you explore today?";
        }

        switch (profile.type) {
            case 'recruiter':
                return "Hello! I noticed you're exploring my professional background. Would you like a quick summary of my experience or my resume?";
            case 'developer':
                return "Hey fellow developer! 🚀 I see you're interested in the technical side. Want me to walk you through any of my projects?";
            case 'curious':
                return "Hi there! 👋 I'm Kushal's AI assistant. Feel free to ask me anything about his work, skills, or how to get in touch!";
            default:
                return "Welcome to my portfolio! 🌟 I'm here to help you navigate and answer any questions. What would you like to know?";
        }
    }

    /**
     * Generate suggestions based on profile
     */
    generateSuggestions(profile: UserProfile): string[] {
        const suggestions: string[] = [];

        switch (profile.type) {
            case 'recruiter':
                suggestions.push("📄 View my resume");
                suggestions.push("💼 See work experience");
                suggestions.push("📧 Get in touch");
                break;
            case 'developer':
                suggestions.push("🛠️ Explore projects");
                suggestions.push("⚡ View tech stack");
                suggestions.push("🔗 Check GitHub");
                break;
            default:
                suggestions.push("👋 About me");
                suggestions.push("🚀 View projects");
                suggestions.push("📬 Contact");
        }

        if (profile.interests.includes('backend')) {
            suggestions.push("🐍 Python & Django work");
        }
        if (profile.interests.includes('frontend')) {
            suggestions.push("⚛️ React & Next.js work");
        }

        return suggestions.slice(0, 4);
    }

    /**
     * Generate quick actions
     */
    generateQuickActions(profile: UserProfile): { label: string; action: string }[] {
        const actions: { label: string; action: string }[] = [];

        if (profile.type === 'recruiter') {
            actions.push({ label: "Download Resume", action: "download_resume" });
            actions.push({ label: "View LinkedIn", action: "open_linkedin" });
        }

        actions.push({ label: "View Projects", action: "navigate_projects" });
        actions.push({ label: "Contact Me", action: "navigate_contact" });

        return actions.slice(0, 3);
    }

    /**
     * Process user message and generate response
     */
    processMessage(message: string, profile: UserProfile): string {
        this.context.messageCount++;
        const lowerMessage = message.toLowerCase();

        // Greeting responses
        if (this.isGreeting(lowerMessage)) {
            return "Hello! 😊 How can I help you today? Feel free to ask about my projects, experience, or skills!";
        }

        // Project inquiries
        if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            this.context.lastTopic = 'projects';
            return "I've built various projects including web applications, REST APIs, and automation tools. My featured projects are on the Projects page. Want me to highlight something specific like Python/Django work or full-stack projects?";
        }

        // Experience inquiries
        if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
            this.context.lastTopic = 'experience';
            return "I have 3+ years of experience as a Python Developer and Backend Engineer. I've worked on freelance projects and built production-ready applications. Check out the Experience page for details!";
        }

        // Skills inquiries
        if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
            this.context.lastTopic = 'skills';
            return "My core skills include Python, Django, FastAPI, PostgreSQL, Docker, and React. I specialize in backend development but also do full-stack work. The About page has a detailed breakdown!";
        }

        // Contact inquiries
        if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('reach')) {
            this.context.lastTopic = 'contact';
            return "You can reach me at tripathikushal522@gmail.com or +91 8097077787. I'm currently open to freelance projects and full-time opportunities! The Contact page has a form too.";
        }

        // Resume inquiries
        if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
            return "I'd be happy to share my resume! You can download it or view my detailed experience on the Experience page. Would you like me to email you a copy?";
        }

        // Python/Django specific
        if (lowerMessage.includes('python') || lowerMessage.includes('django')) {
            return "Python and Django are my primary technologies! I've built REST APIs, automation scripts, web scrapers, and full applications. I love the Django ecosystem for its batteries-included approach.";
        }

        // Default response
        return "That's an interesting question! I can help with info about projects, experience, skills, or how to get in touch. What would you like to know more about?";
    }

    /**
     * Check if message is a greeting
     */
    private isGreeting(message: string): boolean {
        const greetings = ['hi', 'hello', 'hey', 'hola', 'greetings', 'howdy', "what's up", 'sup'];
        return greetings.some(g => message.includes(g));
    }

    /**
     * Generate full AI response object
     */
    generateResponse(profile: UserProfile, isReturning: boolean): AIResponse {
        return {
            greeting: this.generateGreeting(profile, isReturning),
            suggestions: this.generateSuggestions(profile),
            quickActions: this.generateQuickActions(profile),
            tone: profile.type === 'recruiter' ? 'professional' : 'friendly',
        };
    }
}

export const aiResponseEngine = AIResponseEngine.getInstance();
export type { AIResponse };
export default AIResponseEngine;

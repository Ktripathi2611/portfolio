/**
 * BehaviorTracker - Privacy-respecting session-only behavior tracking
 */

interface BehaviorData {
    pagesVisited: { path: string; timestamp: number; duration: number }[];
    scrollDepth: Record<string, number>;
    hoverFocus: { element: string; duration: number }[];
    clickPatterns: { target: string; timestamp: number }[];
    sessionStart: number;
    visitCount: number;
    lastVisit: number | null;
}

interface UserProfile {
    type: 'recruiter' | 'developer' | 'curious' | 'returning' | 'unknown';
    interests: string[];
    engagementLevel: 'high' | 'medium' | 'low';
    preferredProjects: string[];
}

const STORAGE_KEY = 'kt_portfolio_behavior';

class BehaviorTracker {
    private static instance: BehaviorTracker;
    private data: BehaviorData;
    private currentPage: string = '/';
    private pageEnterTime: number = 0;
    private hoverStartTime: number = 0;
    private currentHoverElement: string | null = null;

    private constructor() {
        this.data = this.loadFromStorage();
        this.data.sessionStart = Date.now();
        this.data.visitCount++;
        this.saveToStorage();
    }

    static getInstance(): BehaviorTracker {
        if (!BehaviorTracker.instance) {
            BehaviorTracker.instance = new BehaviorTracker();
        }
        return BehaviorTracker.instance;
    }

    /**
     * Load data from localStorage
     */
    private loadFromStorage(): BehaviorData {
        if (typeof window === 'undefined') {
            return this.getDefaultData();
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    ...this.getDefaultData(),
                    ...parsed,
                    lastVisit: parsed.sessionStart || null,
                };
            }
        } catch {
            // Ignore localStorage errors
        }
        return this.getDefaultData();
    }

    /**
     * Save data to localStorage
     */
    private saveToStorage(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch {
            // Ignore localStorage errors
        }
    }

    /**
     * Get default data structure
     */
    private getDefaultData(): BehaviorData {
        return {
            pagesVisited: [],
            scrollDepth: {},
            hoverFocus: [],
            clickPatterns: [],
            sessionStart: Date.now(),
            visitCount: 0,
            lastVisit: null,
        };
    }

    /**
     * Track page visit
     */
    trackPageVisit(path: string): void {
        // Record duration of previous page
        if (this.currentPage && this.pageEnterTime > 0) {
            const duration = Date.now() - this.pageEnterTime;
            const existingIndex = this.data.pagesVisited.findIndex(
                p => p.path === this.currentPage
            );

            if (existingIndex >= 0) {
                this.data.pagesVisited[existingIndex].duration += duration;
            } else {
                this.data.pagesVisited.push({
                    path: this.currentPage,
                    timestamp: this.pageEnterTime,
                    duration,
                });
            }
        }

        this.currentPage = path;
        this.pageEnterTime = Date.now();
        this.saveToStorage();
    }

    /**
     * Track scroll depth
     */
    trackScrollDepth(path: string, depth: number): void {
        const currentMax = this.data.scrollDepth[path] || 0;
        if (depth > currentMax) {
            this.data.scrollDepth[path] = Math.min(depth, 100);
            this.saveToStorage();
        }
    }

    /**
     * Track hover start
     */
    trackHoverStart(element: string): void {
        this.currentHoverElement = element;
        this.hoverStartTime = Date.now();
    }

    /**
     * Track hover end
     */
    trackHoverEnd(): void {
        if (this.currentHoverElement && this.hoverStartTime > 0) {
            const duration = Date.now() - this.hoverStartTime;
            if (duration > 500) { // Only track meaningful hovers
                this.data.hoverFocus.push({
                    element: this.currentHoverElement,
                    duration,
                });
                // Keep last 50 hovers
                if (this.data.hoverFocus.length > 50) {
                    this.data.hoverFocus.shift();
                }
                this.saveToStorage();
            }
        }
        this.currentHoverElement = null;
        this.hoverStartTime = 0;
    }

    /**
     * Track click
     */
    trackClick(target: string): void {
        this.data.clickPatterns.push({
            target,
            timestamp: Date.now(),
        });
        // Keep last 100 clicks
        if (this.data.clickPatterns.length > 100) {
            this.data.clickPatterns.shift();
        }
        this.saveToStorage();
    }

    /**
     * Analyze user and generate profile
     */
    analyzeUser(): UserProfile {
        const profile: UserProfile = {
            type: 'unknown',
            interests: [],
            engagementLevel: 'low',
            preferredProjects: [],
        };

        // Determine user type
        const projectsVisited = this.data.pagesVisited.some(p => p.path === '/projects');
        const experienceVisited = this.data.pagesVisited.some(p => p.path === '/experience');
        const aboutVisited = this.data.pagesVisited.some(p => p.path === '/about');
        const contactVisited = this.data.pagesVisited.some(p => p.path === '/contact');

        // Recruiter pattern: About + Experience + Contact
        if (experienceVisited && aboutVisited && contactVisited) {
            profile.type = 'recruiter';
        }
        // Developer pattern: Projects focus, deep scroll
        else if (projectsVisited && (this.data.scrollDepth['/projects'] || 0) > 50) {
            profile.type = 'developer';
        }
        // Returning visitor
        else if (this.data.visitCount > 1) {
            profile.type = 'returning';
        }
        // New curious visitor
        else if (this.data.pagesVisited.length >= 2) {
            profile.type = 'curious';
        }

        // Determine interests from hover patterns
        const backendHovers = this.data.hoverFocus.filter(h =>
            h.element.toLowerCase().includes('python') ||
            h.element.toLowerCase().includes('django') ||
            h.element.toLowerCase().includes('backend')
        ).length;

        const frontendHovers = this.data.hoverFocus.filter(h =>
            h.element.toLowerCase().includes('react') ||
            h.element.toLowerCase().includes('frontend') ||
            h.element.toLowerCase().includes('next')
        ).length;

        if (backendHovers > frontendHovers) {
            profile.interests.push('backend');
        }
        if (frontendHovers > backendHovers) {
            profile.interests.push('frontend');
        }

        // Determine engagement level
        const sessionDuration = Date.now() - this.data.sessionStart;
        const avgScrollDepth = Object.values(this.data.scrollDepth).reduce((a, b) => a + b, 0) /
            Math.max(Object.keys(this.data.scrollDepth).length, 1);

        if (sessionDuration > 120000 && avgScrollDepth > 60) {
            profile.engagementLevel = 'high';
        } else if (sessionDuration > 30000 || avgScrollDepth > 30) {
            profile.engagementLevel = 'medium';
        }

        return profile;
    }

    /**
     * Get raw behavior data
     */
    getData(): BehaviorData {
        return { ...this.data };
    }

    /**
     * Check if returning visitor
     */
    isReturningVisitor(): boolean {
        return this.data.visitCount > 1;
    }

    /**
     * Get time since last visit
     */
    getTimeSinceLastVisit(): number | null {
        if (!this.data.lastVisit) return null;
        return Date.now() - this.data.lastVisit;
    }
}

export const behaviorTracker = BehaviorTracker.getInstance();
export type { BehaviorData, UserProfile };
export default BehaviorTracker;

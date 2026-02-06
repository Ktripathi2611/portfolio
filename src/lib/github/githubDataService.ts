/**
 * Enhanced GitHub Data Service
 * Fetches repos, commits, languages, and contribution data
 */

export interface GitHubRepo {
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    html_url: string;
}

export interface EnhancedCommit {
    sha: string;
    message: string;
    date: string;
    repo: string;
    language: string | null;
    stars: number;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export interface LanguageStats {
    language: string;
    count: number;
    percentage: number;
    color: string;
}

export interface GitHubActivityData {
    commits: EnhancedCommit[];
    repos: GitHubRepo[];
    languages: LanguageStats[];
    totalStars: number;
    totalForks: number;
    lastUpdated: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Vue: '#41b883',
    React: '#61dafb',
};

const CACHE_KEY = 'github_activity_enhanced';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Get cached data from localStorage
 */
function getCachedData(): GitHubActivityData | null {
    if (typeof window === 'undefined') return null;

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp < CACHE_DURATION) {
            return data;
        }

        // Cache expired
        localStorage.removeItem(CACHE_KEY);
        return null;
    } catch {
        return null;
    }
}

/**
 * Cache data to localStorage
 */
function setCachedData(data: GitHubActivityData): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                data,
                timestamp: Date.now(),
            })
        );
    } catch {
        // Storage quota exceeded
    }
}

/**
 * Fetch GitHub activity data from API route
 */
export async function fetchGitHubActivity(): Promise<GitHubActivityData> {
    // Check cache first
    const cached = getCachedData();
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch('/api/github/activity');

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data: GitHubActivityData = await response.json();

        // Cache the result
        setCachedData(data);

        return data;
    } catch (error) {
        console.error('Failed to fetch GitHub activity:', error);

        // Return mock data as fallback
        return getMockData();
    }
}

/**
 * Get commit coordinates (geo-location simulation)
 */
export function getCommitCoordinates(commit: EnhancedCommit): { lat: number; lng: number } {
    return commit.coordinates;
}

/**
 * Get language color
 */
export function getLanguageColor(language: string | null): string {
    if (!language) return '#888888';
    return LANGUAGE_COLORS[language] || '#888888';
}

/**
 * Mock data for fallback
 */
function getMockData(): GitHubActivityData {
    const mockCommits: EnhancedCommit[] = [
        {
            sha: 'mock1',
            message: 'Add adaptive FPS system',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            repo: 'portfolio',
            language: 'TypeScript',
            stars: 15,
            coordinates: { lat: 28.6139, lng: 77.2090 }, // Delhi
        },
        {
            sha: 'mock2',
            message: 'Implement 3D globe visualization',
            date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            repo: 'portfolio',
            language: 'TypeScript',
            stars: 15,
            coordinates: { lat: 37.7749, lng: -122.4194 }, // San Francisco
        },
        {
            sha: 'mock3',
            message: 'Create AI assistant component',
            date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            repo: 'portfolio',
            language: 'TypeScript',
            stars: 15,
            coordinates: { lat: 51.5074, lng: -0.1278 }, // London
        },
    ];

    const mockLanguages: LanguageStats[] = [
        { language: 'TypeScript', count: 25, percentage: 60, color: LANGUAGE_COLORS.TypeScript },
        { language: 'JavaScript', count: 10, percentage: 24, color: LANGUAGE_COLORS.JavaScript },
        { language: 'Python', count: 5, percentage: 12, color: LANGUAGE_COLORS.Python },
        { language: 'CSS', count: 2, percentage: 4, color: LANGUAGE_COLORS.CSS },
    ];

    return {
        commits: mockCommits,
        repos: [],
        languages: mockLanguages,
        totalStars: 15,
        totalForks: 3,
        lastUpdated: new Date().toISOString(),
    };
}

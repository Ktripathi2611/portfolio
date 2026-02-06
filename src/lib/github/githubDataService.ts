/**
 * Enhanced GitHub Data Service
 * Fetches repos, languages, and contribution data
 */

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    html_url: string;
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
    repos: GitHubRepo[];
    languages: LanguageStats[];
    totalStars: number;
    totalForks: number;
    totalRepos: number;
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

const CACHE_KEY = 'github_repos_data';
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
 * Fetch GitHub data from API route
 */
export async function fetchGitHubActivity(): Promise<GitHubActivityData> {
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
        setCachedData(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
        return getMockData();
    }
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
    const mockRepos: GitHubRepo[] = [
        {
            id: 1,
            name: 'portfolio',
            full_name: 'Ktripathi2611/portfolio',
            description: 'My personal portfolio website with 3D effects',
            language: 'TypeScript',
            stargazers_count: 15,
            forks_count: 3,
            updated_at: new Date().toISOString(),
            html_url: 'https://github.com/Ktripathi2611/portfolio',
            coordinates: { lat: 28.6139, lng: 77.2090 },
        },
        {
            id: 2,
            name: 'react-globe',
            full_name: 'Ktripathi2611/react-globe',
            description: 'Interactive 3D globe component',
            language: 'JavaScript',
            stargazers_count: 8,
            forks_count: 2,
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            html_url: 'https://github.com/Ktripathi2611/react-globe',
            coordinates: { lat: 37.7749, lng: -122.4194 },
        },
        {
            id: 3,
            name: 'ai-assistant',
            full_name: 'Ktripathi2611/ai-assistant',
            description: 'AI-powered chat assistant',
            language: 'Python',
            stargazers_count: 12,
            forks_count: 4,
            updated_at: new Date(Date.now() - 172800000).toISOString(),
            html_url: 'https://github.com/Ktripathi2611/ai-assistant',
            coordinates: { lat: 51.5074, lng: -0.1278 },
        },
    ];

    const mockLanguages: LanguageStats[] = [
        { language: 'TypeScript', count: 8, percentage: 40, color: LANGUAGE_COLORS.TypeScript },
        { language: 'JavaScript', count: 5, percentage: 25, color: LANGUAGE_COLORS.JavaScript },
        { language: 'Python', count: 4, percentage: 20, color: LANGUAGE_COLORS.Python },
        { language: 'CSS', count: 3, percentage: 15, color: LANGUAGE_COLORS.CSS },
    ];

    return {
        repos: mockRepos,
        languages: mockLanguages,
        totalStars: 35,
        totalForks: 9,
        totalRepos: 3,
        lastUpdated: new Date().toISOString(),
    };
}

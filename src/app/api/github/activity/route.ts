import { NextResponse } from 'next/server';
import type { GitHubActivityData, GitHubRepo, LanguageStats } from '@/lib/github/githubDataService';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Ktripathi2611';

// In-memory cache for server-side
let serverCache: { data: GitHubActivityData | null; timestamp: number } = {
    data: null,
    timestamp: 0,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Cities for simulated repo locations
const CITIES = [
    { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
    { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
    { lat: 51.5074, lng: -0.1278, name: 'London' },
    { lat: 40.7128, lng: -74.0060, name: 'New York' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
    { lat: 52.5200, lng: 13.4050, name: 'Berlin' },
    { lat: 48.8566, lng: 2.3522, name: 'Paris' },
    { lat: 55.7558, lng: 37.6173, name: 'Moscow' },
    { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
    { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
    { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
];

/**
 * Generate coordinates for a repo based on its index
 */
function generateCoordinates(index: number): { lat: number; lng: number } {
    return CITIES[index % CITIES.length];
}

/**
 * Fetch user repositories from GitHub
 */
async function fetchRepos(): Promise<any[]> {
    const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
    };

    if (GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
        { headers, next: { revalidate: 900 } }
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Main API handler
 */
export async function GET() {
    const now = Date.now();

    // Check server cache
    if (serverCache.data && now - serverCache.timestamp < CACHE_DURATION) {
        return NextResponse.json(serverCache.data);
    }

    try {
        const rawRepos = await fetchRepos();

        // Calculate language statistics
        const languageCounts: Record<string, number> = {};
        let totalStars = 0;
        let totalForks = 0;

        // Transform repos with coordinates
        const repos: GitHubRepo[] = rawRepos.map((repo, index) => {
            if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;

            return {
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                updated_at: repo.updated_at,
                html_url: repo.html_url,
                coordinates: generateCoordinates(index),
            };
        });

        // Build language stats
        const totalReposWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0);
        const languages: LanguageStats[] = Object.entries(languageCounts)
            .map(([language, count]) => ({
                language,
                count,
                percentage: Math.round((count / totalReposWithLanguage) * 100),
                color: getLanguageColor(language),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        const activityData: GitHubActivityData = {
            repos,
            languages,
            totalStars,
            totalForks,
            totalRepos: repos.length,
            lastUpdated: new Date().toISOString(),
        };

        // Update server cache
        serverCache = {
            data: activityData,
            timestamp: now,
        };

        return NextResponse.json(activityData);
    } catch (error) {
        console.error('GitHub API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch GitHub data' },
            { status: 500 }
        );
    }
}

function getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
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
    };
    return colors[language] || '#888888';
}

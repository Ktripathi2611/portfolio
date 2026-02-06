import { NextResponse } from 'next/server';
import type { GitHubActivityData, EnhancedCommit, GitHubRepo, LanguageStats } from '@/lib/github/githubDataService';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Ktripathi2611';

// In-memory cache for server-side
let serverCache: { data: GitHubActivityData | null; timestamp: number } = {
    data: null,
    timestamp: 0,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Generate random coordinates for commits (simulated geo-location)
 */
function generateCoordinates(index: number): { lat: number; lng: number } {
    const cities = [
        { lat: 28.6139, lng: 77.2090 }, // Delhi
        { lat: 37.7749, lng: -122.4194 }, // San Francisco
        { lat: 51.5074, lng: -0.1278 }, // London
        { lat: 40.7128, lng: -74.0060 }, // New York
        { lat: 35.6762, lng: 139.6503 }, // Tokyo
        { lat: -33.8688, lng: 151.2093 }, // Sydney
        { lat: 52.5200, lng: 13.4050 }, // Berlin
        { lat: 48.8566, lng: 2.3522 }, // Paris
    ];

    return cities[index % cities.length];
}

/**
 * Fetch user repositories
 */
async function fetchRepos(): Promise<GitHubRepo[]> {
    const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
    };

    if (GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
        { headers, next: { revalidate: 900 } } // Cache for 15 minutes
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetch recent commits from a repository
 */
async function fetchRepoCommits(repo: string, maxCommits: number = 5): Promise<any[]> {
    const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
    };

    if (GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/commits?per_page=${maxCommits}`,
            { headers, next: { revalidate: 900 } }
        );

        if (!response.ok) return [];

        return response.json();
    } catch {
        return [];
    }
}

/**
 * Main API handler
 */
export async function GET() {
    // Check server cache
    const now = Date.now();
    if (serverCache.data && now - serverCache.timestamp < CACHE_DURATION) {
        return NextResponse.json(serverCache.data);
    }

    try {
        // Fetch repositories
        const repos = await fetchRepos();

        // Calculate language statistics
        const languageCounts: Record<string, number> = {};
        let totalStars = 0;
        let totalForks = 0;

        repos.forEach((repo) => {
            if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
        });

        const totalRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0);
        const languages: LanguageStats[] = Object.entries(languageCounts)
            .map(([language, count]) => ({
                language,
                count,
                percentage: Math.round((count / totalRepos) * 100),
                color: getLanguageColor(language),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 languages

        // Fetch commits from top repositories
        const topRepos = repos.slice(0, 10); // Top 10 repos
        const allCommits: EnhancedCommit[] = [];

        let commitIndex = 0;
        for (const repo of topRepos) {
            const commits = await fetchRepoCommits(repo.name, 5);

            commits.forEach((commit) => {
                allCommits.push({
                    sha: commit.sha,
                    message: commit.commit.message.split('\n')[0], // First line only
                    date: commit.commit.author.date,
                    repo: repo.name,
                    language: repo.language,
                    stars: repo.stargazers_count,
                    coordinates: generateCoordinates(commitIndex++),
                });
            });

            // Limit to 50 commits total
            if (allCommits.length >= 50) break;
        }

        // Sort by date
        allCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const activityData: GitHubActivityData = {
            commits: allCommits.slice(0, 50),
            repos: repos.slice(0, 20),
            languages,
            totalStars,
            totalForks,
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

/**
 * Get language color
 */
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

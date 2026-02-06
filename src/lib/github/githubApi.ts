/**
 * GitHub API Integration
 * Fetches recent commits and repository activity
 */

interface GitHubCommit {
    sha: string;
    message: string;
    author: string;
    date: string;
    repo: string;
    url: string;
}

interface GitHubActivity {
    commits: GitHubCommit[];
    lastUpdated: number;
}

const GITHUB_USERNAME = "Ktripathi2611";
const CACHE_KEY = "github_activity_cache";
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch recent commits from GitHub
 */
async function fetchRecentCommits(): Promise<GitHubCommit[]> {
    try {
        // Fetch user events (commits, pushes, etc.)
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
                next: { revalidate: 900 }, // Cache for 15 minutes
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const events = await response.json();
        const commits: GitHubCommit[] = [];

        for (const event of events) {
            if (event.type === "PushEvent" && event.payload.commits) {
                for (const commit of event.payload.commits) {
                    commits.push({
                        sha: commit.sha,
                        message: commit.message,
                        author: event.actor.login,
                        date: event.created_at,
                        repo: event.repo.name,
                        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
                    });

                    if (commits.length >= 20) break;
                }
            }
            if (commits.length >= 20) break;
        }

        return commits;
    } catch (error) {
        console.error("Error fetching GitHub activity:", error);
        return getMockCommits();
    }
}

/**
 * Get cached activity or fetch fresh data
 */
export async function getGitHubActivity(): Promise<GitHubActivity> {
    if (typeof window !== "undefined") {
        // Check cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const data: GitHubActivity = JSON.parse(cached);
            const age = Date.now() - data.lastUpdated;

            if (age < CACHE_DURATION) {
                return data;
            }
        }
    }

    // Fetch fresh data
    const commits = await fetchRecentCommits();
    const activity: GitHubActivity = {
        commits,
        lastUpdated: Date.now(),
    };

    // Cache the data
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(activity));
        } catch {
            // Ignore storage errors
        }
    }

    return activity;
}

/**
 * Mock commits for fallback
 */
function getMockCommits(): GitHubCommit[] {
    return [
        {
            sha: "abc123",
            message: "Add new feature: AI assistant integration",
            author: GITHUB_USERNAME,
            date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            repo: "Ktripathi2611/portfolio",
            url: "https://github.com/Ktripathi2611/portfolio",
        },
        {
            sha: "def456",
            message: "Refactor: Improve performance with lazy loading",
            author: GITHUB_USERNAME,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            repo: "Ktripathi2611/portfolio",
            url: "https://github.com/Ktripathi2611/portfolio",
        },
        {
            sha: "ghi789",
            message: "Fix: Resolve TypeScript errors in components",
            author: GITHUB_USERNAME,
            date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            repo: "Ktripathi2611/portfolio",
            url: "https://github.com/Ktripathi2611/portfolio",
        },
    ];
}

/**
 * Get geographic coordinates for commit visualization
 * In a real scenario, this could be based on commit metadata or default to user location
 */
export function getCommitCoordinates(commit: GitHubCommit): { lat: number; lng: number } {
    // Default to Mumbai, India (user location)
    // In production, you could parse location from commit metadata or use IP geolocation
    const locations = [
        { lat: 19.076, lng: 72.8777 }, // Mumbai
        { lat: 28.7041, lng: 77.1025 }, // Delhi
        { lat: 12.9716, lng: 77.5946 }, // Bangalore
        { lat: 22.5726, lng: 88.3639 }, // Kolkata
    ];

    // Simple hash to consistently assign locations
    const hash = commit.sha.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return locations[hash % locations.length];
}

export type { GitHubCommit, GitHubActivity };

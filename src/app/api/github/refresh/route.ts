import { NextResponse } from 'next/server';

/**
 * Manual refresh endpoint
 * Clears both server and client cache
 */
export async function POST() {
    try {
        // Clear server-side cache by forcing a fresh fetch
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github/activity`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to refresh data');
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: 'GitHub data refreshed',
            lastUpdated: data.lastUpdated,
        });
    } catch (error) {
        console.error('Refresh error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to refresh data' },
            { status: 500 }
        );
    }
}

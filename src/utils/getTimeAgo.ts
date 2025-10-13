export function getTimeAgo(isoDate: string): string {
    const published = new Date(isoDate);
    if (isNaN(published.getTime())) return 'Unknown time';

    const now = new Date();
    const diffMs = now.getTime() - published.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';        // less than 1 minute
    if (diffMinutes < 60) return `${diffMinutes}m ago`; // 1–59 minutes

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;    // 1–23 hours

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;                        // 1+ days
}

const PREFIX = "platformx:vpos:";

export function videoPositionKey(slug: string, lessonId: number): string {
    return `${PREFIX}${slug}:${lessonId}`;
}

export function readLocalVideoPosition(slug: string, lessonId: number): number | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(videoPositionKey(slug, lessonId));
        if (raw == null) return null;
        const n = parseFloat(raw);
        return Number.isFinite(n) && n >= 0 ? n : null;
    } catch {
        return null;
    }
}

export function writeLocalVideoPosition(slug: string, lessonId: number, seconds: number): void {
    if (typeof window === "undefined") return;
    try {
        const s = Math.max(0, Math.floor(seconds));
        localStorage.setItem(videoPositionKey(slug, lessonId), String(s));
    } catch {
        /* quota */
    }
}

export function clearLocalVideoPosition(slug: string, lessonId: number): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(videoPositionKey(slug, lessonId));
    } catch {
        /* ignore */
    }
}

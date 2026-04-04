const PREFIX = "platformx:notes:";

function key(slug: string, lessonId: number) {
    return `${PREFIX}${slug}:${lessonId}`;
}

export function readLessonNotes(slug: string, lessonId: number): string {
    if (typeof window === "undefined") return "";
    try {
        return localStorage.getItem(key(slug, lessonId)) ?? "";
    } catch {
        return "";
    }
}

export function writeLessonNotes(slug: string, lessonId: number, text: string): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(key(slug, lessonId), text);
    } catch {
        /* quota */
    }
}

const STORAGE_KEY = "platformx_learning_xp_v1";

export const XP_LESSON_COMPLETE = 12;
export const XP_QUIZ_PASS = 18;

export function getLearningXp(): number {
    if (typeof window === "undefined") return 0;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const n = raw ? parseInt(raw, 10) : 0;
        return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
        return 0;
    }
}

/** Adds XP and notifies listeners (same tab). Returns new total. */
export function addLearningXp(amount: number): number {
    if (typeof window === "undefined" || amount <= 0) return getLearningXp();
    const next = getLearningXp() + Math.round(amount);
    try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
        window.dispatchEvent(new CustomEvent("platformx-xp-updated", { detail: next }));
    } catch {
        /* ignore quota */
    }
    return next;
}

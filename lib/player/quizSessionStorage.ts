const PREFIX = "platformx:quiz:";

export function quizAnswersKey(slug: string, lessonId: number): string {
    return `${PREFIX}${slug}:${lessonId}`;
}

export type QuizAnswersMap = Record<string, string | number>;

export function readQuizAnswersDraft(slug: string, lessonId: number): QuizAnswersMap | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(quizAnswersKey(slug, lessonId));
        if (!raw) return null;
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as QuizAnswersMap;
    } catch {
        return null;
    }
}

export function writeQuizAnswersDraft(slug: string, lessonId: number, answers: QuizAnswersMap): void {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(quizAnswersKey(slug, lessonId), JSON.stringify(answers));
    } catch {
        /* quota */
    }
}

export function clearQuizAnswersDraft(slug: string, lessonId: number): void {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.removeItem(quizAnswersKey(slug, lessonId));
    } catch {
        /* ignore */
    }
}

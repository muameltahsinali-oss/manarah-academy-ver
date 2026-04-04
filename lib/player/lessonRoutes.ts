export type LessonLike = {
    id: number | string;
    lesson_type?: string | null;
};

export function lessonHref(slug: string, lesson: LessonLike): string {
    const id = Number(lesson.id);
    const t = lesson.lesson_type;
    if (t === "documentation") return `/learn/${slug}/docs/${id}`;
    if (t === "quiz") return `/learn/${slug}/quiz/${id}`;
    return `/learn/${slug}/video/${id}`;
}

"use client";

import { useCourseData, useProgress } from "@/lib/hooks/useCoursePlayer";
import { lessonHref, type LessonLike } from "@/lib/player/lessonRoutes";

export function useLessonPage(slug: string, lessonId: number) {
    const { data: res, isLoading, error, isError } = useCourseData(slug);
    const { data: progressRes } = useProgress(slug);

    const course = res?.data;
    const modules = course?.modules || [];
    const allLessons = modules.flatMap((m: { lessons?: unknown[] }) => m.lessons || []);
    const lesson = allLessons.find((l: { id?: unknown }) => Number(l.id) === lessonId);
    const lessonIndex = allLessons.findIndex((l: { id?: unknown }) => Number(l.id) === lessonId);
    const nextLesson = lessonIndex >= 0 ? allLessons[lessonIndex + 1] : undefined;
    const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : undefined;
    const currentModule = modules.find((m: { lessons?: { id?: unknown }[] }) =>
        m.lessons?.some((l: { id?: unknown }) => Number(l.id) === lessonId)
    );

    const completedLessonIds: number[] = progressRes?.data?.completed_lesson_ids || [];
    const isEnrolled = !!course?.is_enrolled;
    const currentLessonCompleted = completedLessonIds.includes(lessonId);

    const nextHref = nextLesson ? lessonHref(slug, nextLesson as LessonLike) : null;
    const prevHref = prevLesson ? lessonHref(slug, prevLesson as LessonLike) : null;

    /** يمكن الانتقال للدرس التالي فقط إذا اكتمل الدرس الحالي (نفس منطق الشريط الجانبي). */
    const canNavigateToNext = !!nextLesson && currentLessonCompleted;

    return {
        course,
        isLoading,
        isError,
        error,
        isEnrolled,
        modules,
        allLessons,
        lesson,
        lessonIndex,
        nextLesson,
        prevLesson,
        currentModule,
        completedLessonIds,
        currentLessonCompleted,
        nextHref,
        prevHref,
        canNavigateToNext,
    };
}

"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { LessonTabs } from "@/components/player/LessonTabs";
import { DocsCompletionDock } from "@/components/player/DocsCompletionDock";
import { PlayerNextLessonDock } from "@/components/player/PlayerNextLessonDock";
import { usePlayer } from "@/components/player/PlayerContext";
import { useMarkDocsLessonComplete } from "@/lib/hooks/useCoursePlayer";
import { useLessonPage } from "@/lib/hooks/useLessonPage";
import { DocsLessonViewer } from "@/components/player/DocsLessonViewer";
import { LessonPageLoading, LessonPageLocked, LessonPageNotFound } from "@/components/player/LessonPageShell";
import { lessonHref, type LessonLike } from "@/lib/player/lessonRoutes";

export default function DocsLessonPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const lessonIdParam = params.lessonId as string;
    const lessonId = Number(lessonIdParam);

    const { currentLessonId, setCurrentLessonId } = usePlayer();
    const { mutateAsync: markComplete, isPending } = useMarkDocsLessonComplete(slug);

    const {
        course,
        isLoading,
        error,
        isEnrolled,
        lesson,
        nextLesson,
        canNavigateToNext,
        completedLessonIds,
    } = useLessonPage(slug, lessonId);

    useEffect(() => {
        if (!Number.isNaN(lessonId) && currentLessonId !== lessonId) {
            setCurrentLessonId(lessonId);
        }
    }, [lessonId, currentLessonId, setCurrentLessonId]);

    const isCompleted = completedLessonIds.includes(lessonId);

    if (isLoading) {
        return <LessonPageLoading />;
    }

    if (error || !isEnrolled) {
        return <LessonPageLocked slug={slug} />;
    }

    if (!lesson) {
        return <LessonPageNotFound />;
    }

    if (lesson.lesson_type && lesson.lesson_type !== "documentation") {
        if (lesson.lesson_type === "video") {
            router.replace(`/learn/${slug}/video/${lesson.id}`);
        } else if (lesson.lesson_type === "quiz") {
            router.replace(`/learn/${slug}/quiz/${lesson.id}`);
        } else {
            router.replace(`/learn/${slug}`);
        }
        return null;
    }

    const helperTitle = isCompleted ? "تم إكمال الدرس ✅" : "هذا درس توثيق";
    const helperSub = isCompleted
        ? "يمكنك الآن الانتقال للدرس التالي."
        : "بعد الانتهاء من القراءة اضغط (تأكيد الإكمال) لفتح الدروس التالية.";

    const handleConfirmComplete = async () => {
        if (isCompleted) return;
        try {
            await markComplete(lessonId);
        } catch {
            /* toast في الـ hook */
        }
    };

    const courseTitle = course?.title;
    const nextDockHref = nextLesson ? lessonHref(slug, nextLesson as LessonLike) : null;
    const nextTitle = nextLesson ? (nextLesson as { title?: string }).title : null;

    return (
        <>
            <div className={`flex flex-col w-full ${!isCompleted ? "pb-28 md:pb-24" : "pb-24"}`}>
                <PlayerHeader />

                <div className="flex flex-col p-4 md:p-8 md:px-12 w-full max-w-4xl mx-auto gap-10">
                    <div className="p-4 rounded-[4px] border border-border/70 bg-white hidden md:block" dir="rtl">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="text-sm font-bold text-text">{helperTitle}</div>
                                <div className="text-xs text-text/60">{helperSub}</div>
                            </div>
                            <button
                                type="button"
                                onClick={handleConfirmComplete}
                                disabled={isPending || isCompleted}
                                className={`shrink-0 px-5 py-2 rounded-[4px] border text-sm font-bold transition-colors ${
                                    isCompleted
                                        ? "bg-accent/10 border-accent/30 text-accent"
                                        : "bg-primary text-white border-primary hover:bg-primary/90"
                                } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                                {isCompleted ? "مكتمل" : isPending ? "جاري التأكيد..." : "تأكيد الإكمال"}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 rounded-[4px] border border-border/70 bg-white md:hidden" dir="rtl">
                        <div className="text-sm font-bold text-text">{helperTitle}</div>
                        <div className="text-xs text-text/60 mt-1">{helperSub}</div>
                    </div>

                    <article
                        className="prose prose-sm md:prose max-w-none bg-white border border-border/40 rounded-[4px] p-6 text-right"
                        dir="rtl"
                        aria-labelledby="docs-lesson-title"
                    >
                        <h1 id="docs-lesson-title" className="text-2xl font-bold mb-4 text-text">
                            {lesson.title}
                        </h1>
                        {courseTitle && (
                            <p className="text-xs text-text/45 -mt-2 mb-4 font-mono">{courseTitle}</p>
                        )}
                        {lesson.docs_content ? (
                            <div className="-mt-2">
                                <DocsLessonViewer docsContent={lesson.docs_content} embedded />
                            </div>
                        ) : lesson.content ? (
                            <DocsLessonViewer docsContent={lesson.content} embedded />
                        ) : (
                            <p className="text-sm text-text/60">لم يتم إضافة محتوى توثيقي بعد لهذا الدرس.</p>
                        )}
                    </article>

                    <LessonTabs />
                </div>
            </div>

            <DocsCompletionDock
                isCompleted={isCompleted}
                isPending={isPending}
                onConfirm={handleConfirmComplete}
                className="md:hidden"
            />

            <PlayerNextLessonDock
                nextLessonTitle={nextTitle}
                nextHref={nextDockHref}
                canNavigate={!!canNavigateToNext && !!nextDockHref}
            />
        </>
    );
}

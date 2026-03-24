"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { LessonTabs } from "@/components/player/LessonTabs";
import { usePlayer } from "@/components/player/PlayerContext";
import { useCourseData, useMarkDocsLessonComplete } from "@/lib/hooks/useCoursePlayer";
import { Loader2, Lock } from "lucide-react";
import { useProgress } from "@/lib/hooks/useCoursePlayer";

export default function DocsLessonPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const lessonIdParam = params.lessonId as string;
    const lessonId = Number(lessonIdParam);

    const { currentLessonId, setCurrentLessonId } = usePlayer();
    const { data: res, isLoading, error } = useCourseData(slug);
    const { data: progressRes } = useProgress(slug);
    const { mutateAsync: markComplete, isPending } = useMarkDocsLessonComplete(slug);

    useEffect(() => {
        if (!Number.isNaN(lessonId) && currentLessonId !== lessonId) {
            setCurrentLessonId(lessonId);
        }
    }, [lessonId, currentLessonId, setCurrentLessonId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-text/60">جاري تحميل الدورة...</p>
            </div>
        );
    }

    if (error || !res?.data?.is_enrolled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
                <div className="p-4 bg-primary/5 rounded-full">
                    <Lock className="w-12 h-12 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-text mb-2">عذراً، لا يمكنك الوصول لهذه الصفحة</h2>
                    <p className="text-sm text-text/60 max-w-md mx-auto">
                        يجب عليك الاشتراك في الدورة أولاً لتتمكن من الوصول إلى المحتوى التعليمي.
                    </p>
                </div>
                <button
                    onClick={() => router.push(`/courses/${slug}`)}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-[4px] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    الذهاب لصفحة الدورة
                </button>
            </div>
        );
    }

    const modules = res?.data?.modules || [];
    const allLessons = modules.flatMap((m: any) => m.lessons || []);
    const lesson = allLessons.find((l: any) => Number(l.id) === lessonId);
    const completedLessonIds = progressRes?.data?.completed_lesson_ids || [];
    const isCompleted = completedLessonIds.includes(lessonId);

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-sm font-medium text-text/60">لم يتم العثور على هذا الدرس.</p>
            </div>
        );
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
    const helperSub = isCompleted ? "يمكنك الآن الانتقال للدرس التالي." : "بعد الانتهاء من القراءة اضغط (تأكيد الإكمال) لفتح الدروس التالية.";

    const handleConfirmComplete = async () => {
        if (isCompleted) return;
        try {
            await markComplete(lessonId);
        } catch {
            // toast is handled in hook
        }
    };

    return (
        <div className="flex flex-col w-full pb-20">
            <PlayerHeader />

            <div className="flex flex-col p-4 md:p-8 md:px-12 w-full max-w-4xl mx-auto gap-10">
                <div className="p-4 rounded-[4px] border border-border/70 bg-white" dir="rtl">
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

                <article className="prose prose-sm md:prose max-w-none bg-white border border-border/40 rounded-[4px] p-6 text-right" dir="rtl">
                    <h1 className="text-2xl font-bold mb-4 text-text">{lesson.title}</h1>
                    {/* Placeholder renderer – expects structured JSON (TipTap). For now we show raw JSON / HTML fallback. */}
                    {lesson.docs_content ? (
                        <pre className="text-xs bg-slate-50 p-3 rounded border border-border/40 overflow-x-auto">
                            {JSON.stringify(lesson.docs_content, null, 2)}
                        </pre>
                    ) : lesson.content ? (
                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    ) : (
                        <p className="text-sm text-text/60">لم يتم إضافة محتوى توثيقي بعد لهذا الدرس.</p>
                    )}
                </article>

                <LessonTabs />
            </div>
        </div>
    );
}


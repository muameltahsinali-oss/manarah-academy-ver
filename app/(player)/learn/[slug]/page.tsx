"use client";

import { useEffect } from "react";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { VideoContainer } from "@/components/player/VideoContainer";
import { LessonTabs } from "@/components/player/LessonTabs";
import { useParams, useRouter } from "next/navigation";
import { useCourseData } from "@/lib/hooks/useCoursePlayer";
import { usePlayer } from "@/components/player/PlayerContext";
import { Loader2, Lock } from "lucide-react";

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { setCurrentLessonId } = usePlayer();
    const { data: res, isLoading, error } = useCourseData(slug);

    // عند الدخول من "استئناف التعلم" إلى /learn/slug نوجّه مباشرة لصفحة الدرس الأول حسب نوعه (فيديو/اختبار/توثيق)
    useEffect(() => {
        if (!res?.data?.is_enrolled || !slug) return;
        const modules = res.data.modules || [];
        const firstModule = modules[0];
        if (!firstModule?.lessons?.length) return;
        const firstLesson = firstModule.lessons[0];
        const firstId = Number(firstLesson.id);
        const lessonType = firstLesson.lesson_type ?? "video";
        setCurrentLessonId(firstId);
        const href =
            lessonType === "documentation"
                ? `/learn/${slug}/docs/${firstId}`
                : lessonType === "quiz"
                    ? `/learn/${slug}/quiz/${firstId}`
                    : `/learn/${slug}/video/${firstId}`;
        router.replace(href);
    }, [res?.data?.is_enrolled, res?.data?.modules, slug, router, setCurrentLessonId]);

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
    const hasLessons = modules.some((m: any) => (m.lessons?.length ?? 0) > 0);
    // توجيه فوري لأول درس حسب نوعه؛ تجنّب عرض واجهة فيديو لدرس اختبار أو توثيق
    if (hasLessons) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-text/60">جاري التحويل للدرس...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full pb-20">
            <PlayerHeader />

            <div className="flex flex-col p-4 md:p-8 md:px-12 w-full max-w-6xl mx-auto gap-12">
                <VideoContainer />
                <LessonTabs />
            </div>
        </div>
    );
}

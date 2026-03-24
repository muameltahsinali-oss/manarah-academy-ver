"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { VideoContainer } from "@/components/player/VideoContainer";
import { LessonTabs } from "@/components/player/LessonTabs";
import { usePlayer } from "@/components/player/PlayerContext";
import { useCourseData } from "@/lib/hooks/useCoursePlayer";
import { Loader2, Lock } from "lucide-react";

export default function VideoLessonPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const lessonIdParam = params.lessonId as string;
    const lessonId = Number(lessonIdParam);

    const { currentLessonId, setCurrentLessonId } = usePlayer();
    const { data: res, isLoading, error } = useCourseData(slug);

    // Ensure the current lesson in context matches the URL
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

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-sm font-medium text-text/60">لم يتم العثور على هذا الدرس.</p>
            </div>
        );
    }

    // If the lesson is not a video, redirect to the appropriate page
    if (lesson.lesson_type && lesson.lesson_type !== "video") {
        if (lesson.lesson_type === "documentation") {
            router.replace(`/learn/${slug}/docs/${lesson.id}`);
        } else if (lesson.lesson_type === "quiz") {
            router.replace(`/learn/${slug}/quiz/${lesson.id}`);
        } else {
            router.replace(`/learn/${slug}`);
        }
        return null;
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


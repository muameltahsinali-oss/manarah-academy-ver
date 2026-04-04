"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { VideoContainer } from "@/components/player/VideoContainer";
import { LessonTabs } from "@/components/player/LessonTabs";
import { PlayerNextLessonDock } from "@/components/player/PlayerNextLessonDock";
import { usePlayer } from "@/components/player/PlayerContext";
import { useLessonPage } from "@/lib/hooks/useLessonPage";
import { LessonPageLoading, LessonPageLocked, LessonPageNotFound } from "@/components/player/LessonPageShell";
import { lessonHref, type LessonLike } from "@/lib/player/lessonRoutes";

export default function VideoLessonPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const lessonIdParam = params.lessonId as string;
    const lessonId = Number(lessonIdParam);

    const { currentLessonId, setCurrentLessonId } = usePlayer();
    const { isLoading, error, isEnrolled, lesson, nextLesson, canNavigateToNext } = useLessonPage(slug, lessonId);

    useEffect(() => {
        if (!Number.isNaN(lessonId) && currentLessonId !== lessonId) {
            setCurrentLessonId(lessonId);
        }
    }, [lessonId, currentLessonId, setCurrentLessonId]);

    if (isLoading) {
        return <LessonPageLoading />;
    }

    if (error || !isEnrolled) {
        return <LessonPageLocked slug={slug} />;
    }

    if (!lesson) {
        return <LessonPageNotFound />;
    }

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

    const nextDockHref = nextLesson ? lessonHref(slug, nextLesson as LessonLike) : null;
    const nextTitle = nextLesson ? (nextLesson as { title?: string }).title : null;

    return (
        <>
            <div className="flex flex-col w-full pb-28 md:pb-24">
                <PlayerHeader />

                <div className="flex flex-col p-4 md:p-8 md:px-12 w-full max-w-6xl mx-auto gap-12">
                    <VideoContainer />
                    <LessonTabs />
                </div>
            </div>

            <PlayerNextLessonDock
                nextLessonTitle={nextTitle}
                nextHref={nextDockHref}
                canNavigate={!!canNavigateToNext && !!nextDockHref}
            />
        </>
    );
}

"use client";

import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Maximize, Minimize } from "lucide-react";
import { usePlayer } from "./PlayerContext";
import { useParams, useRouter } from "next/navigation";
import { useCourseData, useProgress, useLessonMedia } from "@/lib/hooks/useCoursePlayer";
import { HlsPlayer } from "./HlsPlayer";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProgressTrack } from "@/lib/hooks/useProgressTrack";
import { useVideoEngagementTracker } from "@/lib/hooks/useVideoEngagementTracker";
import { lessonHref, type LessonLike } from "@/lib/player/lessonRoutes";
import { readLocalVideoPosition, writeLocalVideoPosition, clearLocalVideoPosition } from "@/lib/player/videoLocalResume";

export function VideoContainer() {
    const { isFocusMode, setIsFocusMode, currentLessonId, setCurrentLessonId } = usePlayer();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { data: courseRes } = useCourseData(slug);
    const { data: progressRes } = useProgress(slug);
    const { data: mediaData, isLoading: isLoadingMedia, isError: isMediaError } = useLessonMedia(currentLessonId);
    const track = useProgressTrack(slug);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [serverResume, setServerResume] = useState<number | null>(null);
    const [localResumeSnap, setLocalResumeSnap] = useState<number | null>(null);

    const modules = courseRes?.data?.modules || [];
    const allLessons = modules.flatMap((m: { lessons?: unknown[] }) => m.lessons || []);
    const completedLessonIds = progressRes?.data?.completed_lesson_ids || [];

    const currentLesson = allLessons.find((l: { id?: unknown }) => Number(l.id) === currentLessonId);
    const currentIndex = allLessons.findIndex((l: { id?: unknown }) => Number(l.id) === currentLessonId);

    const isCompleted = currentLessonId ? completedLessonIds.includes(currentLessonId) : false;

    useEffect(() => {
        if (!currentLessonId) return;
        setLocalResumeSnap(readLocalVideoPosition(slug, currentLessonId));
    }, [slug, currentLessonId]);

    useEffect(() => {
        if (!currentLessonId || !isCompleted) return;
        clearLocalVideoPosition(slug, currentLessonId);
    }, [slug, currentLessonId, isCompleted]);

    const handleVideoError = useCallback((message: string) => {
        toast.error(message);
    }, []);

    const handleNext = () => {
        if (currentIndex >= allLessons.length - 1) return;
        const next = allLessons[currentIndex + 1] as LessonLike;
        setCurrentLessonId(Number(next.id));
        router.push(lessonHref(slug, next));
    };

    const handlePrev = () => {
        if (currentIndex <= 0) return;
        const prev = allLessons[currentIndex - 1] as LessonLike;
        setCurrentLessonId(Number(prev.id));
        router.push(lessonHref(slug, prev));
    };

    const videoUrl = mediaData?.playback_url;

    const mergedResumeSeconds = useMemo(() => {
        const s = mediaData?.resume_from_seconds ?? serverResume ?? undefined;
        const l = localResumeSnap ?? undefined;
        if (typeof s === "number" && typeof l === "number") return Math.max(s, l);
        if (typeof s === "number") return s;
        if (typeof l === "number") return l;
        return undefined;
    }, [mediaData?.resume_from_seconds, serverResume, localResumeSnap]);

    const resumeFrom =
        typeof mergedResumeSeconds === "number" && mergedResumeSeconds > 0 ? mergedResumeSeconds : undefined;

    const tracker = useVideoEngagementTracker({
        lessonId: currentLessonId,
        videoRef,
        enabled: !!videoUrl && !!currentLessonId && !isCompleted,
        completionThresholdPct: 80,
        initialResumeSeconds: resumeFrom,
        onShouldSync: ({ watchedSeconds, totalSeconds, lastPositionSeconds }) => {
            if (!currentLessonId) return;
            track.mutate(
                {
                    lesson_id: currentLessonId,
                    event_type: "video",
                    watched_seconds: watchedSeconds,
                    total_duration_seconds: totalSeconds,
                    last_position_seconds: lastPositionSeconds,
                    client_event_at_ms: Date.now(),
                },
                {
                    onSuccess: (res: { success?: boolean; data?: { resume_from_seconds?: number } }) => {
                        if (res?.success && res.data) {
                            const r = res.data.resume_from_seconds ?? null;
                            setServerResume(r);
                            if (typeof r === "number" && r >= 0) {
                                writeLocalVideoPosition(slug, currentLessonId, r);
                            }
                        }
                    },
                }
            );
        },
    });

    useEffect(() => {
        const v = videoRef.current;
        if (!v || !currentLessonId || !videoUrl) return;
        let timeoutId: ReturnType<typeof setTimeout>;
        const flush = () => {
            writeLocalVideoPosition(slug, currentLessonId, v.currentTime);
        };
        const onTime = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(flush, 5000);
        };
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("pause", flush);
        return () => {
            clearTimeout(timeoutId);
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("pause", flush);
        };
    }, [slug, currentLessonId, videoUrl]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="w-full"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-text/50 hidden md:block truncate max-w-[70%] text-right" dir="rtl">
                    {currentLesson?.title || "الدرس"}
                </div>
                <button
                    type="button"
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className="flex items-center gap-2 text-xs font-bold text-text/60 hover:text-primary transition-colors hidden md:flex ml-auto border border-border/60 hover:border-primary/40 px-4 py-2 rounded-[4px]"
                >
                    {isFocusMode ? (
                        <>
                            <Minimize className="w-3.5 h-3.5" /> إلغاء التركيز
                        </>
                    ) : (
                        <>
                            <Maximize className="w-3.5 h-3.5" /> وضع التركيز
                        </>
                    )}
                </button>
            </div>

            <div className="relative w-full aspect-video bg-black rounded-[4px] border border-border/80 overflow-hidden shadow-2xl">
                {isLoadingMedia ? (
                    <div className="absolute inset-0 flex flex-col gap-3 p-6 bg-zinc-900/95">
                        <div className="h-4 w-1/3 rounded bg-zinc-700/80 animate-pulse" />
                        <div className="flex-1 min-h-[120px] rounded-md bg-zinc-800/90 animate-pulse" />
                        <div className="h-3 w-1/4 rounded bg-zinc-700/60 animate-pulse" />
                    </div>
                ) : videoUrl ? (
                    <HlsPlayer url={videoUrl} onError={handleVideoError} videoRef={videoRef} />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                        <div className="text-center">
                            <img
                                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2000"
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm grayscale"
                            />
                            <p className="relative z-10 text-white/60 font-mono text-sm px-4">
                                {isMediaError ? "غير مصرح لك بمشاهدة هذا الفيديو" : "عذراً، فيديو هذا الدرس غير متوفر حالياً."}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 p-4 rounded-[4px] border border-border/70 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3" dir="rtl">
                <div className="flex flex-col gap-1">
                    <div className="text-sm font-bold text-text">
                        {isCompleted ? "تم إكمال الدرس تلقائيًا ✅" : `تمت مشاهدة ${tracker.percentage}% من هذا الدرس`}
                    </div>
                    {!isCompleted && (
                        <div className="text-xs text-text/60">
                            شاهد 80% على الأقل لإكمال الدرس. السحب للأمام لا يُحسب ضمن المشاهدة. يُستأنف من آخر موضع محفوظ.
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-40 h-1.5 bg-border/40 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${isCompleted ? "bg-accent" : "bg-primary"} transition-all duration-300`}
                            style={{ width: `${isCompleted ? 100 : tracker.percentage}%` }}
                        />
                    </div>
                    <div className={`font-mono text-xs font-bold ${isCompleted ? "text-accent" : "text-primary"}`}>
                        {isCompleted ? "100%" : `${tracker.percentage}%`}
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-6 gap-4" dir="rtl">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentIndex <= 0}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-border/80 text-sm font-bold text-text/70 hover:text-text hover:bg-black/5 rounded-[4px] transition-colors group disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        السابق
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentIndex >= allLessons.length - 1 || !isCompleted}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-border/80 text-sm font-bold text-text hover:text-primary hover:border-primary/40 hover:bg-primary/5 rounded-[4px] transition-colors group disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        التالي
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    </button>
                </div>

                <div className="w-full md:w-auto flex items-center">
                    {isCompleted && (
                        <div className="w-full md:w-auto px-5 py-2 rounded-[4px] border border-accent/30 bg-accent/10 text-accent text-sm font-bold text-center">
                            اكتمل الدرس ✅
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

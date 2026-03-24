"use client";

import { usePlayer } from "./PlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, Lock, PanelRightClose, FileText, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

type LessonStatus = "completed" | "active" | "locked";

interface Lesson {
    id: number;
    title: string;
    duration: string;
    status: LessonStatus;
    lesson_type?: string;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

import { useParams, useRouter, usePathname } from "next/navigation";
import { useCourseData, useProgress } from "@/lib/hooks/useCoursePlayer";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

export function CourseSidebar() {
    const { isSidebarOpen, setIsSidebarOpen, currentLessonId, setCurrentLessonId } = usePlayer();
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();
    const pathname = usePathname();
    const { data: res, isLoading: isCourseLoading } = useCourseData(slug);
    const { data: progressRes, isLoading: isProgressLoading } = useProgress(slug);

    const courseData: Module[] = res?.data?.modules || [];
    const completedLessonIds = progressRes?.data?.completed_lesson_ids || [];
    const [openModules, setOpenModules] = useState<number[]>([]);
    const activeLessonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (courseData.length === 0) return;

        // Open the first module by default if none are open
        if (openModules.length === 0) {
            setOpenModules([courseData[0].id]);
        }

        // عند عدم وجود درس محدد: نحدد أول درس ونوجّه حسب نوعه (فيديو/اختبار/توثيق)
        if (currentLessonId === null) {
            const firstModule = courseData[0];
            if (firstModule.lessons && firstModule.lessons.length > 0) {
                const firstLesson = firstModule.lessons[0];
                const firstId = Number(firstLesson.id);
                setCurrentLessonId(firstId);

                // إذا كنا على المسار الأساسي /learn/slug بدون video|quiz|docs، نوجّه لصفحة الدرس المناسبة
                const basePath = `/learn/${slug}`;
                const onBasePath = pathname === basePath || pathname === basePath + "/";
                if (onBasePath && slug) {
                    const lessonType = (firstLesson as Lesson).lesson_type ?? "video";
                    const href =
                        lessonType === "documentation"
                            ? `/learn/${slug}/docs/${firstId}`
                            : lessonType === "quiz"
                                ? `/learn/${slug}/quiz/${firstId}`
                                : `/learn/${slug}/video/${firstId}`;
                    router.replace(href);
                }
            }
        } else {
            // Ensure the module containing the current lesson is open
            const activeModule = courseData.find(m =>
                m.lessons?.some(l => Number(l.id) === currentLessonId)
            );
            if (activeModule && !openModules.includes(activeModule.id)) {
                setOpenModules(prev => [...prev, activeModule.id]);
            }
        }
    }, [courseData, currentLessonId, pathname, slug, router]);

    // Auto-scroll to active lesson
    useEffect(() => {
        if (activeLessonRef.current) {
            activeLessonRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentLessonId, openModules]);

    const toggleModule = (id: number) => {
        setOpenModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    if (isCourseLoading) {
        return (
            <aside className="h-full flex flex-col bg-background w-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </aside>
        );
    }

    return (
        <aside className="h-full flex flex-col bg-background w-full overflow-y-auto border-l border-border/60 shadow-sm">
            <div className="p-6 border-b border-border/80 bg-white sticky top-0 z-10 flex items-start justify-between">
                <div>
                    <h2 className="text-base font-bold tracking-tight mb-1 cursor-default text-text/90">
                        {res?.data?.title || "الدورة الحالية"}
                    </h2>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-text/50 uppercase tracking-widest">
                        <span>{courseData.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} دروس</span>
                        <span>•</span>
                        <span>{courseData.length} وحدات</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1.5 text-text/40 hover:text-primary hover:bg-primary/5 rounded-[4px] hidden md:block transition-all"
                >
                    <PanelRightClose className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 py-4">
                {courseData.map((module, mIdx) => {
                    const isOpen = openModules.includes(module.id);

                    return (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: mIdx * 0.05 }}
                            className="border-b border-border/30 last:border-0"
                        >
                            <button
                                onClick={() => toggleModule(module.id)}
                                className={`flex items-center justify-between w-full p-4 transition-all text-right group ${isOpen ? 'bg-primary/5' : 'hover:bg-black/5'}`}
                            >
                                <h3 className={`text-xs font-bold transition-colors ${isOpen ? 'text-primary' : 'text-text/70 group-hover:text-text'}`}>
                                    {module.title}
                                </h3>
                                <ChevronDown className={`w-4 h-4 text-text/30 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="overflow-hidden bg-white/50"
                                    >
                                        <div className="flex flex-col pb-2">
                                            {module.lessons?.map((lesson) => {
                                                const lessonId = Number(lesson.id);
                                                const isActive = currentLessonId === lessonId;
                                                const isCompleted = completedLessonIds.includes(lessonId);
                                                const isLocked = lesson.status === "locked" && !isCompleted;

                                                // STRICT gating: cannot go beyond the current lesson unless it is completed.
                                                const currentIdx = currentLessonId
                                                    ? courseData.flatMap((m) => m.lessons || []).findIndex((l) => Number(l.id) === currentLessonId)
                                                    : -1;
                                                const thisIdx = courseData.flatMap((m) => m.lessons || []).findIndex((l) => Number(l.id) === lessonId);
                                                const currentIsCompleted = currentLessonId ? completedLessonIds.includes(currentLessonId) : false;
                                                const isBeyondCurrent = currentIdx >= 0 && thisIdx > currentIdx;
                                                const strictBlocked = isBeyondCurrent && !currentIsCompleted;

                                                const href =
                                                    lesson.lesson_type === "documentation"
                                                        ? `/learn/${slug}/docs/${lessonId}`
                                                        : lesson.lesson_type === "quiz"
                                                            ? `/learn/${slug}/quiz/${lessonId}`
                                                            : `/learn/${slug}/video/${lessonId}`;

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        ref={isActive ? activeLessonRef : null}
                                                        onClick={() => {
                                                            setCurrentLessonId(lessonId);
                                                            router.push(href);
                                                        }}
                                                        disabled={isLocked || strictBlocked}
                                                        className={`flex items-start gap-3 px-4 py-3.5 text-right transition-all border-l-2 relative group ${isActive
                                                            ? "bg-primary/10 border-primary"
                                                            : "border-transparent hover:bg-primary/5"
                                                            } ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                                                            }`}
                                                    >
                                                        <div className="shrink-0 mt-1 flex items-center justify-center w-5 h-5">
                                                            {isCompleted ? (
                                                                <div className="w-2 h-2 rounded-full bg-accent ring-4 ring-accent/10" />
                                                            ) : lesson.lesson_type === "documentation" ? (
                                                                <FileText className="w-4 h-4 text-text/30 group-hover:text-primary transition-colors" />
                                                            ) : lesson.lesson_type === "quiz" ? (
                                                                <HelpCircle className="w-4 h-4 text-text/30 group-hover:text-primary transition-colors" />
                                                            ) : isActive ? (
                                                                <PlayCircle className="w-4 h-4 text-primary fill-primary/10 animate-pulse" />
                                                            ) : (
                                                                <PlayCircle className="w-4 h-4 text-text/20 group-hover:text-primary transition-colors" />
                                                            )}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className={`text-[13px] leading-tight mb-1 transition-colors ${isActive ? "font-bold text-primary" :
                                                                isLocked ? "font-medium text-text/40" :
                                                                    "font-medium text-text/70 group-hover:text-text"
                                                                }`}>
                                                                {lesson.title}
                                                            </div>
                                                            <div className="text-[9px] font-mono text-text/40 tracking-wider">
                                                                {lesson.duration}
                                                            </div>
                                                            {strictBlocked && (
                                                                <div className="mt-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
                                                                    أكمل الدرس الحالي لفتح الدروس التالية
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>
        </aside>
    );
}

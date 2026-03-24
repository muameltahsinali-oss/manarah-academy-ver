"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, Lock, MonitorPlay, Clock, Users, FileText, HelpCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Lesson {
    id: number;
    title: string;
    duration: string;
    status: "active" | "locked" | "completed";
    lesson_type?: string;
    duration_seconds?: number;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface CourseCurriculumProps {
    courseId?: number;
    courseSlug?: string;
    modules?: Module[];
    isEnrolled?: boolean;
    courseDuration?: string | null;
    studentsCount?: number | null;
}

export function CourseCurriculum({
    courseId,
    courseSlug,
    modules = [],
    isEnrolled = false,
    courseDuration,
    studentsCount,
}: CourseCurriculumProps) {
    const [openModules, setOpenModules] = useState<number[]>(modules.length > 0 ? [modules[0].id] : []);

    const toggleModule = (id: number) => {
        setOpenModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    if (modules.length === 0) {
        return (
            <div className="p-8 text-center bg-white border border-dashed border-border/80 rounded-[4px]">
                <p className="text-sm text-text/40 font-medium">المنهج الدراسي غير متوفر حالياً.</p>
            </div>
        );
    }

    const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const totalModules = modules.length;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full relative"
        >
            <h2 className="text-2xl font-bold tracking-tight mb-8">المنهج الدراسي</h2>

            <div className="border border-border/80 bg-white rounded-[4px] overflow-hidden">
                <div className="p-4 bg-background border-b border-border/80 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-text/60">
                    <div className="flex items-center gap-2">
                        <MonitorPlay className="w-4 h-4" />
                        <span>الوحدات: {totalModules}</span>
                        <span className="w-px h-4 bg-border/60" />
                        <span>الدروس: {totalLessons}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {courseDuration && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {courseDuration}
                            </span>
                        )}
                        {typeof studentsCount === "number" && (
                            <span className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" />
                                {studentsCount.toLocaleString("ar-EG")} طالب
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    {modules.map((module) => {
                        const isOpen = openModules.includes(module.id);

                        return (
                            <div key={module.id} className="border-b border-border/40 last:border-0">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="flex items-center justify-between w-full p-6 text-right transition-colors hover:bg-black/5 group"
                                >
                                    <h3 className="font-bold text-text group-hover:text-primary transition-colors">
                                        {module.title}
                                    </h3>
                                    <ChevronDown className={`w-5 h-5 text-text/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col px-6 pb-6 pt-2">
                                                {module.lessons?.map((lesson: any) => {
                                                    const lessonType: string | undefined =
                                                        lesson.lesson_type || lesson.type || lesson.media_type || undefined;

                                                    const typeLabel =
                                                        lessonType === "video"
                                                            ? "فيديو"
                                                            : lessonType === "documentation"
                                                                ? "توثيق"
                                                                : lessonType === "quiz"
                                                                    ? "اختبار"
                                                                    : lessonType;

                                                    const href =
                                                        !isEnrolled || lesson.status === "locked" || !courseSlug
                                                            ? null
                                                            : lessonType === "documentation"
                                                                ? `/learn/${courseSlug}/docs/${lesson.id}`
                                                                : lessonType === "quiz"
                                                                    ? `/learn/${courseSlug}/quiz/${lesson.id}`
                                                                    : `/learn/${courseSlug}/video/${lesson.id}`;

                                                    const showDuration =
                                                        lessonType === "video" && (lesson.duration_seconds || lesson.duration)
                                                            ? lesson.duration && lesson.duration !== "00:00" && lesson.duration !== "—"
                                                                ? lesson.duration
                                                                : typeof lesson.duration_seconds === "number" && lesson.duration_seconds > 0
                                                                    ? new Date(lesson.duration_seconds * 1000).toISOString().substring(14, 19)
                                                                    : ""
                                                            : "";

                                                    const lessonContent = (
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-4">
                                                                {lesson.status === 'locked' ? (
                                                                    <Lock className="w-4 h-4 text-text/40 shrink-0" />
                                                                ) : (
                                                                    <>
                                                                        {lessonType === "documentation" ? (
                                                                            <FileText className="w-4 h-4 shrink-0 text-primary" />
                                                                        ) : lessonType === "quiz" ? (
                                                                            <HelpCircle className="w-4 h-4 shrink-0 text-primary" />
                                                                        ) : (
                                                                            <PlayCircle className={`w-4 h-4 shrink-0 ${lesson.status === 'completed' ? 'text-accent' : 'text-primary'}`} />
                                                                        )}
                                                                    </>
                                                                )}
                                                                <div className="flex flex-col gap-1">
                                                                    <span className={`text-sm ${lesson.status === 'locked' ? 'text-text/70' : 'text-text font-medium group-hover/lesson:text-primary transition-colors'}`}>
                                                                        {lesson.title}
                                                                    </span>
                                                                    {typeLabel && (
                                                                        <span className="text-[11px] font-mono text-text/40">
                                                                            {typeLabel}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {showDuration && (
                                                                <span className="text-xs font-mono text-text/50 shrink-0">
                                                                    {showDuration}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );

                                                    return (
                                                        <div
                                                            key={lesson.id}
                                                            className={`flex items-center py-4 border-b border-border/40 last:border-0 group/lesson ${lesson.status === 'locked' ? 'opacity-60' : 'cursor-pointer'}`}
                                                        >
                                                            {href ? (
                                                                <Link href={href} className="w-full">
                                                                    {lessonContent}
                                                                </Link>
                                                            ) : (
                                                                lessonContent
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>
        </motion.section>
    );
}

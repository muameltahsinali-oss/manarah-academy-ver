"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, Award } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCourseData } from "@/lib/hooks/useCoursePlayer";
import { usePlayer } from "./PlayerContext";
import { downloadCertificate } from "@/lib/hooks/useCertificates";
import { CourseProgressBar } from "@/components/engagement/CourseProgressBar";

export function PlayerHeader() {
    const { isFocusMode, isSidebarOpen, setIsSidebarOpen } = usePlayer();
    const params = useParams();
    const slug = params.slug as string;
    const { data: courseData, isLoading } = useCourseData(slug);
    const { currentLessonId } = usePlayer();

    const title = courseData?.data?.title || "جاري التحميل...";
    const progress = courseData?.data?.enrollment_progress || 0;
    const certificateId = courseData?.data?.certificate_id;

    // Find current module and lesson for the header title
    const currentLesson = courseData?.data?.modules
        ?.flatMap((m: any) => m.lessons)
        ?.find((l: any) => Number(l.id) === currentLessonId);

    const currentModule = courseData?.data?.modules
        ?.find((m: any) => m.lessons.some((l: any) => Number(l.id) === currentLessonId));

    const breadcrumbParts = [
        courseData?.data?.title,
        currentModule?.title,
        currentLesson?.title,
    ].filter(Boolean) as string[];

    return (
        <AnimatePresence>
            {!isFocusMode && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 md:p-8 md:px-12 border-b border-border/80 origin-top"
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            {/* Toggle Sidebar Button if sidebar is closed */}
                            <AnimatePresence>
                                {!isSidebarOpen && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="hidden md:flex items-center justify-center w-8 h-8 rounded-[4px] border border-border/80 text-text/60 hover:text-text hover:bg-black/5 transition-colors"
                                    >
                                        <Menu className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            <Link
                                href="/dashboard"
                                className="hidden md:flex items-center gap-1.5 text-xs text-text/50 hover:text-text transition-colors w-fit"
                            >
                                <ArrowRight className="w-3.5 h-3.5" />
                                العودة للوحة التحكم
                            </Link>
                        </div>

                        <div className="min-w-0">
                            {breadcrumbParts.length > 1 && (
                                <p
                                    className="text-[11px] text-text/45 mb-2 leading-relaxed truncate max-w-full"
                                    dir="rtl"
                                    title={breadcrumbParts.join(" › ")}
                                >
                                    {breadcrumbParts.map((part, i) => (
                                        <span key={`${i}-${part.slice(0, 12)}`}>
                                            {i > 0 && <span className="text-text/30 mx-1.5">›</span>}
                                            <span className={i === breadcrumbParts.length - 1 ? "text-text/55 font-medium" : ""}>
                                                {part}
                                            </span>
                                        </span>
                                    ))}
                                </p>
                            )}
                            {breadcrumbParts.length < 2 && (
                                <div className="text-xs font-mono text-text/50 uppercase tracking-widest mb-1">
                                    {currentModule ? currentModule.title : "الوحدة الحالية"}
                                </div>
                            )}
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
                                {currentLesson ? currentLesson.title : title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 shrink-0">
                        {certificateId && (
                            <button
                                onClick={() => downloadCertificate(certificateId)}
                                className="group flex items-center gap-2 px-4 h-10 bg-accent text-white text-xs font-bold rounded-[4px] hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                            >
                                <Award className="w-4 h-4 transition-transform group-hover:scale-110" />
                                تحميل الشهادة
                            </button>
                        )}
                        <div className="w-full max-w-[220px] md:w-56 md:max-w-none">
                            <CourseProgressBar
                                value={progress}
                                size="sm"
                                showMilestones
                                showEncouragement
                                label="تقدم الدورة"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

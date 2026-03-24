"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentDashboard } from "@/lib/hooks/useDashboard";
import { Loader2, ArrowLeft } from "lucide-react";

export function LearningPathWidget() {
    const { data: res, isLoading } = useStudentDashboard();
    const stats = res?.data;

    // Until real learning paths API exists, approximate path progress from dashboard stats
    const activeCourses = stats?.active_courses ?? 0;
    const completedCourses = stats?.completed_courses ?? 0;
    const totalCourses = activeCourses + completedCourses;
    const averageProgress = stats?.average_progress ?? 0;

    if (isLoading) {
        return (
            <div className="w-full bg-white border border-border/80 rounded-[4px] p-6 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary/50" />
            </div>
        );
    }

    // If we have no data at all, don't render the widget
    if (!totalCourses && !averageProgress) {
        return null;
    }

    const displayPercent = Math.round(averageProgress);

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full bg-white border border-border/80 rounded-[4px] p-4 md:p-6 lg:p-7 flex flex-col md:flex-row items-center gap-4 md:gap-6"
        >
            {/* Progress ring */}
            <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="text-border/40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="text-primary"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - displayPercent / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                    <span className="text-xs font-mono text-text/50 uppercase tracking-[0.18em] mb-1">
                        المسار
                    </span>
                    <span className="text-2xl font-bold text-text">{displayPercent}%</span>
                </div>
            </div>

            {/* Text & actions */}
            <div className="flex-1 flex flex-col gap-2 text-right md:text-right" dir="rtl">
                <h2 className="text-lg font-bold tracking-tight text-text">
                    تقدّمك في الرحلة الهندسية
                </h2>
                <p className="text-sm text-text/60">
                    {totalCourses > 0
                        ? `أكملت ${completedCourses} من ${totalCourses} دورة في مسارك الحالي. استمر في التحرك للأمام حتى تصل إلى 100٪.`
                        : "ابدأ مسارك الآن عبر اختيار أول دورة في الكتالوج."}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 justify-start md:justify-end">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center h-9 px-3 rounded-[4px] border border-border text-xs font-bold text-text hover:bg-black/5 transition-colors"
                    >
                        عرض لوحة التقدّم
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center h-9 px-3 rounded-[4px] bg-primary text-xs font-bold text-white hover:bg-primary/90 transition-colors group"
                    >
                        اختيار الدورة التالية
                        <ArrowLeft className="w-3.5 h-3.5 ms-1 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </motion.section>
    );
}


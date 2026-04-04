"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { encouragementForProgress } from "@/lib/engagement/progressMessaging";

type Props = {
    averageProgress: number;
    lastCourseSlug: string | null | undefined;
    lastCourseTitle: string | null | undefined;
    hasCourses: boolean;
};

export function MotivationBanner({ averageProgress, lastCourseSlug, lastCourseTitle, hasCourses }: Props) {
    const pct = Math.round(averageProgress);
    const line = hasCourses ? encouragementForProgress(pct) : "ابدأ رحلتك التعليمية اليوم — خطوة بخطوة.";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-l from-primary/[0.07] via-white to-white p-5 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.08)] md:p-6"
        >
            <div className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-text md:text-base">{line}</p>
                        {hasCourses && lastCourseSlug && lastCourseTitle && pct < 100 && (
                            <p className="mt-1 text-xs text-text/55">
                                تابع: <span className="font-semibold text-text/75">{lastCourseTitle}</span>
                            </p>
                        )}
                    </div>
                </div>
                {hasCourses && lastCourseSlug && pct < 100 && (
                    <Link
                        href={`/learn/${lastCourseSlug}`}
                        className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                    >
                        واصل التعلّم
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                )}
                {hasCourses && (!lastCourseSlug || pct >= 100) && (
                    <Link
                        href="/dashboard/courses"
                        className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border/70 bg-white px-5 text-sm font-bold text-text shadow-sm transition hover:bg-slate-50"
                    >
                        دوراتي
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                )}
                {!hasCourses && (
                    <Link
                        href="/courses"
                        className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border/70 bg-white px-5 text-sm font-bold text-text shadow-sm transition hover:bg-slate-50"
                    >
                        تصفّح الدورات
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                )}
            </div>
        </motion.div>
    );
}

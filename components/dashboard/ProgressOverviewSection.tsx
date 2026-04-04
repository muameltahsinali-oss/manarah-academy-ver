"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useStudentDashboard } from "@/lib/hooks/useDashboard";

const R = 56;
const STROKE = 6;
const C = 2 * Math.PI * R;

function CircularProgress({ value }: { value: number }) {
    const pct = Math.max(0, Math.min(100, value));
    const mv = useMotionValue(0);
    const spring = useSpring(mv, { stiffness: 90, damping: 22 });

    useEffect(() => {
        mv.set(pct);
    }, [pct, mv]);

    const offset = useTransform(spring, (v) => C * (1 - v / 100));

    return (
        <div className="relative mx-auto h-[140px] w-[140px] md:h-[160px] md:w-[160px]">
            <svg className="-rotate-90 transform" viewBox="0 0 128 128" aria-hidden>
                <circle cx="64" cy="64" r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} className="text-border/50" />
                <motion.circle
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    className="text-primary"
                    strokeDasharray={C}
                    style={{ strokeDashoffset: offset }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span
                    className="text-3xl font-bold tabular-nums text-primary md:text-4xl"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                >
                    {pct % 1 === 0 ? pct : pct.toFixed(1)}
                </motion.span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text/45">%</span>
            </div>
        </div>
    );
}

function StreakPill({ current }: { current: number }) {
    if (current <= 0) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white px-3 py-1 text-xs font-medium text-text/55 shadow-sm">
                <span aria-hidden>🔥</span>
                ابدأ سلسلة اليوم
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-gradient-to-l from-amber-500/[0.07] to-transparent px-3 py-1 text-xs font-semibold text-text/80 shadow-sm">
            <span aria-hidden>🔥</span>
            {current} {current === 1 ? "يوم" : "أيام"} متتالية
        </span>
    );
}

export function ProgressOverviewSection() {
    const { data: res, isLoading } = useStudentDashboard();
    const stats = res?.data;
    const streakCurrent = stats?.streak?.current ?? 0;

    if (isLoading) {
        return (
            <div
                className="w-full rounded-[4px] border border-border/80 bg-white p-5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] md:p-8"
                aria-busy
                aria-label="جاري تحميل التقدم"
            >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <div className="h-6 w-40 animate-pulse rounded bg-border/45" />
                        <div className="h-4 w-56 max-w-full animate-pulse rounded bg-border/30" />
                    </div>
                    <div className="h-8 w-32 animate-pulse rounded-full bg-border/35" />
                </div>
                <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
                    <div className="mx-auto flex h-[140px] w-[140px] items-center justify-center rounded-full border border-border/50 md:h-[160px] md:w-[160px]">
                        <div className="h-16 w-16 animate-pulse rounded-full bg-border/40" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-[4px] border border-border/60 bg-background/80 px-4 py-4">
                                <div className="mb-2 h-3 w-16 animate-pulse rounded bg-border/40" />
                                <div className="h-8 w-12 animate-pulse rounded bg-border/35" />
                                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-border/30" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const avg = stats?.average_progress ?? 0;
    const completed = stats?.completed_courses ?? 0;
    const active = stats?.active_courses ?? 0;
    const weekly = stats?.weekly_completed_lessons ?? 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-[4px] border border-border/80 bg-white p-5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] md:p-8"
        >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-text md:text-xl">نظرة على تقدّمك</h2>
                    <p className="mt-1 text-xs text-text/55 md:text-sm">ملخص سريع لمسارك التعليمي.</p>
                </div>
                <StreakPill current={streakCurrent} />
            </div>

            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
                <div className="flex flex-col items-center">
                    <CircularProgress value={typeof avg === "number" ? avg : 0} />
                    <p className="mt-3 max-w-[12rem] text-center text-xs leading-relaxed text-text/55">
                        متوسط التقدّم عبر جميع دوراتك المسجّلة
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                        { label: "دورات مكتملة", value: completed, hint: "دورة أنهيتها بالكامل" },
                        { label: "دورات نشطة", value: active, hint: "ما زلت تعمل عليها" },
                        { label: "دروس هذا الأسبوع", value: weekly, hint: "آخر 7 أيام" },
                    ].map((row) => (
                        <div
                            key={row.label}
                            className="group rounded-[4px] border border-border/60 bg-background/80 px-4 py-4 transition-colors hover:border-primary/15 hover:bg-white"
                        >
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text/45">{row.label}</p>
                            <p className="mt-2 text-2xl font-bold tabular-nums text-text md:text-3xl">{row.value}</p>
                            <p className="mt-1 text-[11px] text-text/45">{row.hint}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}

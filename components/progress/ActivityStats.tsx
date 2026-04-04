"use client";

import { motion } from "framer-motion";
import { Flame, Timer, Zap, BarChart3 } from "lucide-react";
import { useLearningXp } from "@/lib/engagement/useLearningXp";
import { buildLast7DaysActivity } from "@/lib/progress/weekActivity";

type Activity = { at?: string | null };

type Props = {
    weeklyLessons: number;
    streakDays: number;
    recentActivities: Activity[];
};

export function ActivityStats({ weeklyLessons, streakDays, recentActivities }: Props) {
    const xp = useLearningXp();
    const series = buildLast7DaysActivity(recentActivities);
    const max = Math.max(1, ...series.map((s) => s.count));

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.1)] md:p-6"
        >
            <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-text/40" strokeWidth={1.75} />
                    <h2 className="text-base font-bold text-text md:text-lg">النشاط والوقت</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-slate-50/60 px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-text/45">
                        <Timer className="h-3.5 w-3.5" />
                        دروس (7 أيام)
                    </div>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-text">{weeklyLessons}</p>
                    <p className="text-[11px] text-text/45">إكمالات مسجّلة هذا الأسبوع</p>
                </div>
                <div className="rounded-xl border border-orange-500/15 bg-orange-500/[0.05] px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-text/45">
                        <Flame className="h-3.5 w-3.5 text-orange-600/80" />
                        السلسلة
                    </div>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-text">{streakDays}</p>
                    <p className="text-[11px] text-text/45">أيام متتالية للتعلّم</p>
                </div>
                <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.06] px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-text/45">
                        <Zap className="h-3.5 w-3.5 text-amber-700/80" />
                        نقاط النشاط
                    </div>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-text">{xp}</p>
                    <p className="text-[11px] text-text/45">من إكمال الدروس والاختبارات</p>
                </div>
            </div>

            <div className="mt-6">
                <p className="mb-3 text-xs font-semibold text-text/50">نشاط آخر 7 أيام (دروس مكتملة)</p>
                <div className="flex h-36 items-end gap-1.5 md:gap-2" dir="ltr">
                    {series.map((d, i) => {
                        const hPx = Math.max(d.count > 0 ? 6 : 3, (d.count / max) * 92);
                        return (
                            <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                                <motion.div
                                    className="w-full max-w-[2.25rem] rounded-t-md bg-primary/85"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${hPx}px` }}
                                    transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <span className="text-[9px] font-mono text-text/45">{d.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}

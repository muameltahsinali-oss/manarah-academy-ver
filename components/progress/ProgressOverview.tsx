"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Library } from "lucide-react";

type Props = {
    totalEnrolled: number;
    completedCourses: number;
    overallPercent: number;
};

export function ProgressOverview({ totalEnrolled, completedCourses, overallPercent }: Props) {
    const pct = Math.max(0, Math.min(100, Math.round(overallPercent)));
    const r = 44;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - pct / 100);

    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.1)] md:p-7"
        >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-6">
                    <div className="relative h-28 w-28 shrink-0">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                            <circle cx="50" cy="50" r={r} className="fill-none stroke-border/45" strokeWidth="10" />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r={r}
                                className="fill-none stroke-primary"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={c}
                                initial={{ strokeDashoffset: c }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold tabular-nums text-text">{pct}</span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-text/45">%</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text md:text-xl">نظرة على تقدّمك</h2>
                        <p className="mt-1 max-w-sm text-sm leading-relaxed text-text/60">
                            متوسط إنجازك عبر جميع دوراتك المسجّلة. كل درس يحرّك هذه النسبة.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <StatPill icon={Library} label="مسجّلة" value={totalEnrolled} />
                    <StatPill icon={CheckCircle2} label="مكتملة" value={completedCourses} accent />
                    <StatPill icon={BookOpen} label="نشطة" value={Math.max(0, totalEnrolled - completedCourses)} />
                </div>
            </div>
        </motion.section>
    );
}

function StatPill({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: typeof BookOpen;
    label: string;
    value: number;
    accent?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border px-3 py-3 text-center md:px-4 ${
                accent ? "border-primary/25 bg-primary/[0.04]" : "border-border/50 bg-slate-50/50"
            }`}
        >
            <Icon className={`mx-auto mb-2 h-4 w-4 ${accent ? "text-primary" : "text-text/40"}`} strokeWidth={1.75} />
            <div className="text-[10px] font-bold uppercase tracking-wide text-text/45">{label}</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${accent ? "text-primary" : "text-text"}`}>{value}</div>
        </div>
    );
}

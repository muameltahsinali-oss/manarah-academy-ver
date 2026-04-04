"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PROGRESS_MILESTONES } from "@/lib/engagement/progressMessaging";

type Props = {
    overallPercent: number;
};

export function MilestonesSection({ overallPercent }: Props) {
    const p = Math.max(0, Math.min(100, Math.round(overallPercent)));

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.1)] md:p-6"
        >
            <h2 className="mb-4 text-base font-bold text-text md:text-lg">معالم التقدّم العام</h2>
            <p className="mb-6 text-sm leading-relaxed text-text/55">
                تتبّع متوسط إنجازك عبر كل دوراتك. كل مرحلة تفتح شعوراً بإغلاق دائرة وتحفّزك على المتابعة.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
                {PROGRESS_MILESTONES.map((m, i) => {
                    const done = p >= m;
                    return (
                        <motion.div
                            key={m}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 * i }}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                                done ? "border-primary/30 bg-primary/[0.04]" : "border-border/50 bg-slate-50/40"
                            }`}
                        >
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                                    done ? "border-primary bg-primary text-white" : "border-border/70 bg-white text-text/25"
                                }`}
                            >
                                {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <span className="text-xs font-bold">{m}%</span>}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-text">{m}%</div>
                                <div className="text-[11px] text-text/45">
                                    {m === 25 && "انطلاقة قوية"}
                                    {m === 50 && "منتصف المسار"}
                                    {m === 75 && "اقتراب من الإكمال"}
                                    {m === 100 && "إكمال كامل"}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}

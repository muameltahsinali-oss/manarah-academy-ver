"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, ArrowLeft } from "lucide-react";
import type { BadgeItem } from "@/components/badges/BadgeCard";

type Props = {
    badges: BadgeItem[];
};

export function BadgesPreview({ badges }: Props) {
    const earned = badges.filter((b) => b.is_earned);
    const sorted = [...earned].sort((a, b) => {
        const ta = a.earned_at ? new Date(a.earned_at).getTime() : 0;
        const tb = b.earned_at ? new Date(b.earned_at).getTime() : 0;
        return tb - ta;
    });
    const recent = sorted[0];
    const preview = sorted.slice(0, 4);

    if (earned.length === 0) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-border/70 bg-slate-50/50 p-6 text-center"
            >
                <Award className="mx-auto mb-3 h-10 w-10 text-text/25" strokeWidth={1.25} />
                <p className="text-sm font-semibold text-text/70">لا توجد أوسمة بعد</p>
                <p className="mt-1 text-xs text-text/45">أكمل الدروس والاختبارات لظهور إنجازاتك هنا.</p>
                <Link
                    href="/dashboard/badges"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    صفحة الأوسمة
                    <ArrowLeft className="h-3 w-3" />
                </Link>
            </motion.section>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.1)] md:p-6"
        >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-600/80" strokeWidth={1.75} />
                    <h2 className="text-base font-bold text-text md:text-lg">الإنجازات</h2>
                </div>
                <Link href="/dashboard/badges" className="text-xs font-bold text-primary hover:underline">
                    عرض الكل
                </Link>
            </div>

            {recent && (
                <p className="mb-4 rounded-xl border border-amber-500/15 bg-amber-500/[0.06] px-3 py-2 text-xs text-text/75">
                    <span className="font-semibold text-amber-900/90">آخر وسام:</span> {recent.name}
                </p>
            )}

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {preview.map((b, i) => (
                    <motion.div
                        key={b.id}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * i }}
                        className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-slate-50/60 p-2 text-center"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                            {b.icon_url ? (
                                <img src={b.icon_url} alt="" className="h-8 w-8 object-contain" />
                            ) : (
                                <Award className="h-6 w-6 text-primary/70" />
                            )}
                        </div>
                        <span className="line-clamp-2 text-[10px] font-semibold leading-tight text-text/80">{b.name}</span>
                    </motion.div>
                ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-text/45">
                {earned.length} وساماً مكتسباً
            </p>
        </motion.section>
    );
}

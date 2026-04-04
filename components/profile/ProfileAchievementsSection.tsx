"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useBadges } from "@/lib/hooks/useBadges";
import { BadgeCard, type BadgeItem } from "@/components/badges/BadgeCard";
import { BadgeDetailModal } from "@/components/badges/BadgeDetailModal";

function sortBadges(badges: BadgeItem[]): BadgeItem[] {
    return [...badges].sort((a, b) => {
        const ae = a.is_earned ? 1 : 0;
        const be = b.is_earned ? 1 : 0;
        if (ae !== be) return be - ae;
        return a.id - b.id;
    });
}

const LIMIT = 6;

export function ProfileAchievementsSection() {
    const { data: badgesRes, isLoading, isError, refetch } = useBadges();
    const [detailBadge, setDetailBadge] = useState<BadgeItem | null>(null);

    const badges: BadgeItem[] = badgesRes?.data ?? [];
    const earnedCount = badges.filter((b) => b.is_earned).length;

    const preview = useMemo(() => sortBadges(badges).slice(0, LIMIT), [badges]);

    if (isLoading) {
        return (
            <section className="rounded-[4px] border border-border/80 bg-white p-6 md:p-8">
                <div className="mb-6 h-6 w-40 animate-pulse rounded bg-border/50" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square animate-pulse rounded-[4px] bg-border/40" />
                    ))}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-[4px] border border-destructive/20 bg-destructive/5 p-6 text-center md:p-8">
                <p className="text-sm text-destructive">تعذر تحميل الأوسمة.</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-3 text-sm font-bold text-primary underline-offset-4 hover:underline"
                >
                    إعادة المحاولة
                </button>
            </section>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            id="achievements"
            className="scroll-mt-28 rounded-[4px] border border-border/80 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] md:scroll-mt-24 md:p-8"
        >
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-text md:text-xl">الإنجازات</h2>
                    <p className="mt-1 text-sm text-text/60">
                        لديك <span className="font-semibold tabular-nums text-text">{earnedCount}</span>{" "}
                        {earnedCount === 1 ? "وساماً" : "أوسمة"} من أصل {badges.length}.
                    </p>
                </div>
                <Link
                    href="/dashboard/badges"
                    className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/85"
                >
                    عرض الكل
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </Link>
            </div>

            {preview.length === 0 ? (
                <p className="py-8 text-center text-sm text-text/55">لا توجد أوسمة متاحة بعد.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {preview.map((badge, index) => (
                        <BadgeCard key={badge.id} badge={badge} index={index} animate onOpenDetail={setDetailBadge} />
                    ))}
                </div>
            )}

            <BadgeDetailModal badge={detailBadge} open={detailBadge !== null} onClose={() => setDetailBadge(null)} />
        </motion.section>
    );
}

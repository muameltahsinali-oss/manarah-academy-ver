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

export function BadgesPreview() {
    const { data: badgesRes, isLoading, isError } = useBadges();
    const [detailBadge, setDetailBadge] = useState<BadgeItem | null>(null);

    const preview = useMemo(() => {
        const badges: BadgeItem[] = badgesRes?.data ?? [];
        return sortBadges(badges).slice(0, 3);
    }, [badgesRes?.data]);

    if (isLoading) {
        return (
            <div className="flex min-h-[120px] items-center justify-center rounded-[4px] border border-border/80 bg-white p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
            </div>
        );
    }

    if (isError || preview.length === 0) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[4px] border border-border/80 bg-white p-5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] md:p-6"
        >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-base font-bold tracking-tight text-text md:text-lg">لمحة عن أوسمتك</h2>
                    <p className="text-xs text-text/55 md:text-sm">أحدث إنجازاتك في التعلّم.</p>
                </div>
                <Link
                    href="/dashboard/profile#achievements"
                    className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/85"
                >
                    عرض الكل
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {preview.map((badge, index) => (
                    <BadgeCard key={badge.id} badge={badge} index={index} animate onOpenDetail={setDetailBadge} />
                ))}
            </div>

            <BadgeDetailModal badge={detailBadge} open={detailBadge !== null} onClose={() => setDetailBadge(null)} />
        </motion.section>
    );
}

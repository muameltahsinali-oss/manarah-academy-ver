"use client";

import { useBadges } from "@/lib/hooks/useBadges";
import { Award, Loader2, Sparkles, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { BadgeCard, type BadgeItem } from "@/components/badges/BadgeCard";
import { BadgeDetailModal } from "@/components/badges/BadgeDetailModal";
import { useMemo, useState } from "react";

const CATEGORY_LABELS: Record<string, string> = {
    learning: "التعلم",
    consistency: "الانتظام",
    skill: "المهارات",
    fun: "المرح",
};

const CATEGORY_ORDER = ["learning", "consistency", "skill", "fun"];

function progressRatio(b: BadgeItem): number {
    if (b.is_earned) return 1;
    if (
        typeof b.progress_current === "number" &&
        typeof b.progress_target === "number" &&
        b.progress_target > 0
    ) {
        return b.progress_current / b.progress_target;
    }
    return 0;
}

function sortBadgesForDisplay(badges: BadgeItem[]): BadgeItem[] {
    return [...badges].sort((a, b) => {
        const ae = a.is_earned ? 1 : 0;
        const be = b.is_earned ? 1 : 0;
        if (ae !== be) return be - ae;
        if (a.is_earned && b.is_earned && a.earned_at && b.earned_at) {
            return new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime();
        }
        const pa = progressRatio(a);
        const pb = progressRatio(b);
        if (pb !== pa) return pb - pa;
        return a.id - b.id;
    });
}

function pickNextBadge(badges: BadgeItem[]): BadgeItem | null {
    const locked = badges.filter((b) => !b.is_earned);
    if (locked.length === 0) return null;
    return locked.reduce((best, b) => {
        const rb = progressRatio(b);
        const rBest = progressRatio(best);
        if (rb > rBest) return b;
        if (rb === rBest && b.id < best.id) return b;
        return best;
    }, locked[0]);
}

export function BadgesSection({ variant = "widget" }: { variant?: "widget" | "page" }) {
    const { data: badgesRes, isLoading, isError } = useBadges();
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [detailBadge, setDetailBadge] = useState<BadgeItem | null>(null);

    const badges: BadgeItem[] = badgesRes?.data ?? [];

    const filteredBadges = useMemo(() => {
        const list = categoryFilter ? badges.filter((b) => b.category === categoryFilter) : badges;
        return sortBadgesForDisplay(list);
    }, [badges, categoryFilter]);

    const earnedCount = badges.filter((b) => b.is_earned).length;
    const totalPoints = badges.filter((b) => b.is_earned).reduce((s, b) => s + (b.points ?? 0), 0);
    const nextBadge = useMemo(() => pickNextBadge(badges), [badges]);
    const nextPct =
        nextBadge &&
        typeof nextBadge.progress_current === "number" &&
        typeof nextBadge.progress_target === "number" &&
        nextBadge.progress_target > 0
            ? Math.min(100, Math.round((nextBadge.progress_current / nextBadge.progress_target) * 100))
            : null;

    if (isLoading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center p-12">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-text/50">جاري تحميل الأوسمة...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <motion.div
                {...getFadeUp(0, 0.4)}
                className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive"
            >
                تعذر تحميل الأوسمة. حاول مرة أخرى لاحقاً.
            </motion.div>
        );
    }

    if (badges.length === 0) {
        if (variant === "widget") return null;
        return (
            <motion.div
                {...getFadeUp(0, 0.5)}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-white py-24 text-center"
            >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">لا توجد أوسمة متاحة بعد</h3>
                <p className="max-w-md text-sm text-text/60">
                    سيتم إضافة المزيد من الإنجازات قريباً. استمر في التعلم لاكتساب أول وسام.
                </p>
            </motion.div>
        );
    }

    return (
        <section className="flex flex-col gap-5 md:gap-7">
            <motion.div {...getFadeUp(0, 0.4)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-text md:text-xl">
                            {variant === "page" && <Sparkles className="h-5 w-5 text-amber-500/90" strokeWidth={1.75} />}
                            الإنجازات والأوسمة
                        </h2>
                        <p className="mt-1 text-sm text-text/55">
                            لقد حصلت على{" "}
                            <span className="font-semibold tabular-nums text-text">{earnedCount}</span>{" "}
                            {earnedCount === 1 ? "وساماً" : "أوسمة"}
                            {badges.length > 0 && (
                                <>
                                    {" "}
                                    من أصل <span className="tabular-nums">{badges.length}</span>
                                </>
                            )}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text/45">
                        <span className="rounded-full border border-border/60 bg-white px-3 py-1.5 font-mono tabular-nums shadow-sm">
                            {earnedCount}/{badges.length}
                        </span>
                        {variant === "page" && (
                            <span className="rounded-full border border-border/60 bg-white px-3 py-1.5 tabular-nums shadow-sm">
                                {totalPoints} نقطة
                            </span>
                        )}
                    </div>
                </div>

                {variant === "page" && nextBadge && (
                    <div className="rounded-2xl border border-border/50 bg-gradient-to-l from-slate-50/80 to-white p-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] md:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Target className="h-5 w-5" strokeWidth={1.75} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-text/45">التالي</p>
                                    <p className="truncate font-semibold text-text">{nextBadge.name}</p>
                                </div>
                            </div>
                            {nextPct !== null ? (
                                <div className="w-full sm:max-w-xs sm:flex-1">
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <motion.div
                                            className="h-full rounded-full bg-primary/85"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${nextPct}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-[11px] text-text/50 tabular-nums">
                                        {nextBadge.progress_current} / {nextBadge.progress_target} · {nextPct}%
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-text/50">واصل التعلم للاقتراب من هذا الوسام</p>
                            )}
                        </div>
                    </div>
                )}

                {variant === "page" && (
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setCategoryFilter(null)}
                            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                                categoryFilter === null
                                    ? "bg-text text-white shadow-sm"
                                    : "border border-border/60 bg-white text-text/70 hover:bg-slate-50"
                            }`}
                        >
                            الكل
                        </button>
                        {CATEGORY_ORDER.filter((c) => badges.some((b) => b.category === c)).map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategoryFilter(cat)}
                                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                                    categoryFilter === cat
                                        ? "bg-text text-white shadow-sm"
                                        : "border border-border/60 bg-white text-text/70 hover:bg-slate-50"
                                }`}
                            >
                                {CATEGORY_LABELS[cat] ?? cat}
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            <motion.div
                layout
                className={`grid gap-4 md:gap-5 ${
                    variant === "page"
                        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                }`}
            >
                <AnimatePresence mode="popLayout">
                    {filteredBadges.map((badge, index) => (
                        <BadgeCard
                            key={badge.id}
                            badge={badge}
                            index={index}
                            animate
                            onOpenDetail={setDetailBadge}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <BadgeDetailModal badge={detailBadge} open={detailBadge !== null} onClose={() => setDetailBadge(null)} />

            {variant === "page" && filteredBadges.length === 0 && categoryFilter && (
                <motion.p {...getFadeUp(0, 0.3)} className="py-8 text-center text-sm text-text/50">
                    لا توجد أوسمة في هذه الفئة.
                </motion.p>
            )}
        </section>
    );
}

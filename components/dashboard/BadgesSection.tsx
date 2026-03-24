"use client";

import { useBadges } from "@/lib/hooks/useBadges";
import { Award, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { BadgeCard, type BadgeItem } from "@/components/badges/BadgeCard";
import { useState } from "react";

const CATEGORY_LABELS: Record<string, string> = {
    learning: "التعلم",
    consistency: "الانتظام",
    skill: "المهارات",
    fun: "المرح",
};

const CATEGORY_ORDER = ["learning", "consistency", "skill", "fun"];

export function BadgesSection({ variant = "widget" }: { variant?: "widget" | "page" }) {
    const { data: badgesRes, isLoading, isError } = useBadges();
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const badges: BadgeItem[] = badgesRes?.data ?? [];

    const filteredBadges = categoryFilter
        ? badges.filter((b) => b.category === categoryFilter)
        : badges;

    const earnedCount = badges.filter((b) => b.is_earned).length;
    const totalPoints = badges.filter((b) => b.is_earned).reduce((s, b) => s + (b.points ?? 0), 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 min-h-[200px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-sm text-text/50">جاري تحميل الأوسمة...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <motion.div {...getFadeUp(0, 0.4)} className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
                تعذر تحميل الأوسمة. حاول مرة أخرى لاحقاً.
            </motion.div>
        );
    }

    if (badges.length === 0) {
        if (variant === "widget") return null;
        return (
            <motion.div
                {...getFadeUp(0, 0.5)}
                className="flex flex-col items-center justify-center py-24 text-center border border-border/80 bg-white rounded-2xl"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Award className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">لا توجد أوسمة متاحة بعد</h3>
                <p className="text-sm text-text/60 max-w-md">
                    سيتم إضافة المزيد من الإنجازات والأوسمة قريباً. استمر في التعلم لاكتساب أول وسام.
                </p>
            </motion.div>
        );
    }

    return (
        <section className="flex flex-col gap-4 md:gap-6">
            <motion.div {...getFadeUp(0, 0.4)} className="flex flex-col gap-3 md:gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-text flex items-center gap-2">
                        {variant === "page" && <Sparkles className="w-5 h-5 text-amber-500" />}
                        الإنجازات والأوسمة
                    </h2>
                    <span className="text-xs font-mono text-text/50 lowercase tracking-widest">
                        {earnedCount} / {badges.length} مكتسبة
                    </span>
                </div>

                {variant === "page" && (
                    <>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                                <span className="text-2xl font-bold text-primary">{totalPoints}</span>
                                <span className="text-xs text-text/60 mr-2">نقطة إجمالية</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCategoryFilter(null)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        categoryFilter === null
                                            ? "bg-primary text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    الكل
                                </button>
                                {CATEGORY_ORDER.filter((c) => badges.some((b) => b.category === c)).map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            categoryFilter === cat
                                                ? "bg-primary text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                    >
                                        {CATEGORY_LABELS[cat] ?? cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </motion.div>

            <motion.div
                layout
                className={`grid gap-4 ${
                    variant === "page"
                        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                }`}
            >
                <AnimatePresence mode="popLayout">
                    {filteredBadges.map((badge, index) => (
                        <BadgeCard key={badge.id} badge={badge} index={index} animate />
                    ))}
                </AnimatePresence>
            </motion.div>

            {variant === "page" && filteredBadges.length === 0 && categoryFilter && (
                <motion.p {...getFadeUp(0, 0.3)} className="text-sm text-text/50 text-center py-8">
                    لا توجد أوسمة في هذه الفئة.
                </motion.p>
            )}
        </section>
    );
}

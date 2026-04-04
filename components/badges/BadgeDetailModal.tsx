"use client";

import { useEffect } from "react";
import { X, Lock, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { BadgeItem } from "@/components/badges/BadgeCard";

const RARITY_LABEL: Record<string, string> = {
    common: "عادي",
    rare: "نادر",
    epic: "ملحمي",
    legendary: "أسطوري",
};

function progressPct(badge: BadgeItem): number {
    const c = badge.progress_current;
    const t = badge.progress_target;
    if (typeof c !== "number" || typeof t !== "number" || t <= 0) return 0;
    return Math.min(100, Math.round((c / t) * 100));
}

export function BadgeDetailModal({
    badge,
    open,
    onClose,
}: {
    badge: BadgeItem | null;
    open: boolean;
    onClose: () => void;
}) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open || !badge) return null;

    const earned = badge.is_earned ?? false;
    const rarity = badge.rarity || "common";
    const rarityLabel = RARITY_LABEL[rarity] ?? rarity;
    const hint = badge.criteria_hint || `المتطلب: ${badge.criteria_value}`;
    const pct = progressPct(badge);
    const showProgress = !earned && typeof badge.progress_current === "number" && typeof badge.progress_target === "number" && badge.progress_target > 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.button
                type="button"
                aria-label="إغلاق"
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
            />
            <motion.div
                role="dialog"
                aria-modal
                aria-labelledby="badge-detail-title"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.12)]"
            >
                        <div
                            className={`absolute inset-x-0 top-0 h-28 ${
                                earned
                                    ? "bg-gradient-to-b from-primary/[0.07] to-transparent"
                                    : "bg-gradient-to-b from-slate-100/80 to-transparent"
                            }`}
                        />

                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-white/90 text-text/60 shadow-sm transition hover:bg-white hover:text-text"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="relative px-6 pb-6 pt-10 text-center">
                            <div
                                className={`mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-2xl border ${
                                    earned
                                        ? "border-primary/20 bg-white shadow-[0_0_36px_-6px_rgba(0,0,0,0.12)] ring-1 ring-primary/10"
                                        : "border-border/70 bg-slate-50 grayscale"
                                }`}
                            >
                                {badge.icon_url ? (
                                    <img
                                        src={badge.icon_url}
                                        alt=""
                                        className={`h-16 w-16 object-contain ${earned ? "" : "opacity-60"}`}
                                    />
                                ) : (
                                    <Sparkles className={`h-12 w-12 ${earned ? "text-primary/80" : "text-slate-400"}`} />
                                )}
                                {!earned && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/55 backdrop-blur-[1px]">
                                        <Lock className="h-7 w-7 text-slate-500/90" strokeWidth={1.75} />
                                    </div>
                                )}
                            </div>

                            <h2 id="badge-detail-title" className="text-lg font-bold text-text tracking-tight">
                                {badge.name}
                            </h2>
                            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text/45">{rarityLabel}</p>

                            <p className="mt-4 text-sm leading-relaxed text-text/70">{badge.description || "لا يوجد وصف إضافي."}</p>

                            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-text/55">
                                <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold tabular-nums text-text/70">
                                    {badge.points} نقطة
                                </span>
                                {earned && badge.earned_at && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-700/90">
                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                        {new Date(badge.earned_at).toLocaleDateString("ar-SA", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                )}
                            </div>

                            {!earned && (
                                <div className="mt-6 rounded-xl border border-amber-500/15 bg-amber-500/[0.06] px-4 py-3 text-right">
                                    <p className="text-xs font-medium text-amber-900/80">{hint}</p>
                                    {showProgress && (
                                        <div className="mt-3">
                                            <div className="h-2 overflow-hidden rounded-full bg-white/80">
                                                <div
                                                    className="h-full rounded-full bg-primary/80 transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <p className="mt-1.5 text-[11px] text-text/50 tabular-nums">
                                                {badge.progress_current} / {badge.progress_target}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
            </motion.div>
        </div>
    );
}

"use client";

import { Award, Lock } from "lucide-react";
import { motion } from "framer-motion";

const RARITY_STYLES: Record<
    string,
    { ring: string; iconBg: string; title: string; label: string; glow: string; progress: string }
> = {
    common: {
        ring: "ring-slate-200/90",
        iconBg: "bg-slate-50",
        title: "text-slate-800",
        label: "text-slate-500",
        glow: "shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)]",
        progress: "bg-slate-500",
    },
    rare: {
        ring: "ring-primary/20",
        iconBg: "bg-primary/[0.06]",
        title: "text-text",
        label: "text-primary/80",
        glow: "shadow-[0_14px_44px_-10px_rgba(0,0,0,0.1)]",
        progress: "bg-primary",
    },
    epic: {
        ring: "ring-violet-200/70",
        iconBg: "bg-violet-50",
        title: "text-violet-950/90",
        label: "text-violet-600/90",
        glow: "shadow-[0_14px_44px_-10px_rgba(91,33,182,0.12)]",
        progress: "bg-violet-500",
    },
    legendary: {
        ring: "ring-amber-200/80",
        iconBg: "bg-amber-50/90",
        title: "text-amber-950/90",
        label: "text-amber-700/85",
        glow: "shadow-[0_16px_48px_-12px_rgba(180,83,9,0.14)]",
        progress: "bg-amber-500",
    },
};

export interface BadgeItem {
    id: number;
    name: string;
    description?: string | null;
    icon_url?: string | null;
    type: string;
    criteria_value: number;
    criteria_hint?: string | null;
    points: number;
    rarity?: string;
    category?: string;
    is_earned?: boolean;
    earned_at?: string | null;
    progress_current?: number;
    progress_target?: number;
}

export function BadgeCard({
    badge,
    index = 0,
    animate = true,
    onOpenDetail,
}: {
    badge: BadgeItem;
    index?: number;
    animate?: boolean;
    onOpenDetail?: (b: BadgeItem) => void;
}) {
    const earned = badge.is_earned ?? false;
    const rarity = (badge.rarity || "common") as keyof typeof RARITY_STYLES;
    const style = RARITY_STYLES[rarity] ?? RARITY_STYLES.common;
    const showProgress =
        !earned &&
        typeof badge.progress_current === "number" &&
        typeof badge.progress_target === "number" &&
        badge.progress_target > 0 &&
        badge.progress_current >= 0;
    const progressPct = showProgress
        ? Math.min(100, Math.round((badge.progress_current! / badge.progress_target!) * 100))
        : 0;

    const card = (
        <button
            type="button"
            onClick={() => onOpenDetail?.(badge)}
            className={[
                "group relative w-full text-right transition-all duration-300",
                "rounded-2xl border p-4 md:p-5",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40",
                earned
                    ? `border-border/50 bg-white ${style.glow} ring-1 ${style.ring} hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.14)]`
                    : "border-border/40 bg-white/95 hover:border-border/70 hover:bg-white",
            ].join(" ")}
        >
            {/* Unlocked soft glow */}
            {earned && (
                <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-70 blur-xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                        background:
                            rarity === "legendary"
                                ? "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.14), transparent 55%)"
                                : rarity === "epic"
                                  ? "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12), transparent 55%)"
                                  : "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.04), transparent 60%)",
                    }}
                />
            )}

            <div className="relative flex flex-col items-center gap-3">
                <div
                    className={[
                        "relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border",
                        earned ? `${style.iconBg} border-white/60` : "border-border/50 bg-slate-50",
                        !earned && "backdrop-blur-[0.5px]",
                    ].join(" ")}
                >
                    {badge.icon_url ? (
                        <img
                            src={badge.icon_url}
                            alt=""
                            className={[
                                "h-11 w-11 object-contain transition duration-300",
                                earned ? "drop-shadow-sm group-hover:scale-[1.04]" : "grayscale opacity-75 blur-[0.3px]",
                            ].join(" ")}
                        />
                    ) : earned ? (
                        <Award className={`h-9 w-9 ${style.label}`} strokeWidth={1.5} />
                    ) : (
                        <Award className="h-9 w-9 text-slate-400" strokeWidth={1.5} />
                    )}

                    {!earned && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/65 backdrop-blur-[2px]">
                            <Lock className="h-6 w-6 text-slate-500/90" strokeWidth={1.75} aria-hidden />
                        </div>
                    )}
                </div>

                <div className="w-full min-w-0 space-y-1">
                    <h3
                        className={`line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug md:text-[0.95rem] ${
                            earned ? style.title : "text-slate-600"
                        }`}
                    >
                        {badge.name}
                    </h3>
                    <p className={`line-clamp-2 text-[11px] leading-relaxed md:text-xs ${earned ? "text-text/55" : "text-text/45"}`}>
                        {badge.description || "اضغط للتفاصيل"}
                    </p>
                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-0.5">
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                                earned ? "bg-slate-100 text-text/65" : "bg-slate-100/80 text-text/50"
                            }`}
                        >
                            {badge.points} نقطة
                        </span>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                earned ? `${style.label} bg-white/80` : "bg-slate-50 text-slate-500"
                            }`}
                        >
                            {earned ? "مفتوح" : "مقفل"}
                        </span>
                    </div>
                </div>

                {showProgress && (
                    <div className="w-full pt-1">
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                                className={`h-full rounded-full ${style.progress}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                        <p className="mt-1 text-[10px] text-text/45 tabular-nums">
                            {badge.progress_current} / {badge.progress_target}
                        </p>
                    </div>
                )}
            </div>
        </button>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
            >
                {card}
            </motion.div>
        );
    }

    return card;
}

"use client";

import { Award, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const RARITY_STYLES: Record<string, { bg: string; border: string; text: string; glow?: string; label: string; progress: string }> = {
    common: { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700", label: "عادي", progress: "bg-slate-500" },
    rare: { bg: "bg-accent/10", border: "border-accent/40", text: "text-accent", label: "نادر", progress: "bg-accent" },
    epic: { bg: "bg-purple-50", border: "border-purple-400", text: "text-purple-700", glow: "shadow-purple-200", label: "ملحمي", progress: "bg-purple-500" },
    legendary: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-800", glow: "shadow-amber-200", label: "أسطوري", progress: "bg-amber-500" },
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
}: {
    badge: BadgeItem;
    index?: number;
    animate?: boolean;
}) {
    const earned = badge.is_earned ?? false;
    const rarity = (badge.rarity || "common") as keyof typeof RARITY_STYLES;
    const style = RARITY_STYLES[rarity] ?? RARITY_STYLES.common;
    const hint = badge.criteria_hint || `المتطلب: ${badge.criteria_value}`;
    const showProgress = !earned && typeof badge.progress_current === "number" && typeof badge.progress_target === "number" && badge.progress_target > 0 && badge.progress_current >= 0;
    const progressPct = showProgress ? Math.min(100, Math.round((badge.progress_current! / badge.progress_target!) * 100)) : 0;

    const content = (
        <div
            className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 group ${
                earned
                    ? `${style.bg} ${style.border} ${style.glow ?? ""} shadow-md hover:shadow-lg hover:scale-[1.02]`
                    : "bg-white/80 border-border/50 hover:border-border hover:bg-white grayscale-[0.6] hover:grayscale-[0.4]"
            }`}
        >
            <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden ${
                    earned ? style.bg : "bg-slate-100"
                }`}
            >
                {badge.icon_url ? (
                    earned ? (
                        <motion.img
                            src={badge.icon_url}
                            alt={badge.name}
                            className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                            animate={{ scale: [1, 1.08, 1], y: [0, -2, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ) : (
                        <img src={badge.icon_url} alt={badge.name} className="w-10 h-10 object-contain" />
                    )
                ) : earned ? (
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Award className={`w-8 h-8 ${style.text}`} />
                    </motion.div>
                ) : (
                    <Award className="w-8 h-8 text-slate-400" />
                )}
                {!earned && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                        <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                )}
            </div>
            <div className="text-center w-full min-w-0">
                <h3 className={`font-bold text-sm line-clamp-2 ${earned ? style.text : "text-slate-600"}`}>
                    {badge.name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{badge.points} نقطة</p>
                {badge.rarity && (
                    <span className={`text-[9px] font-medium mt-1 block ${earned ? style.text : "text-slate-400"}`}>
                        {style.label}
                    </span>
                )}
                {earned && badge.earned_at && (
                    <p className="text-[9px] text-slate-500 mt-1 font-medium">
                        {new Date(badge.earned_at).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                )}
                {showProgress && (
                    <div className="mt-2 w-full">
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${style.progress}`}
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <p className="text-[9px] text-slate-500 mt-0.5">
                            {badge.progress_current} / {badge.progress_target}
                        </p>
                    </div>
                )}
            </div>
            {/* Tooltip - RTL friendly */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center shadow-xl border border-slate-700">
                <p className="font-bold mb-1">{badge.name}</p>
                <p className="opacity-90 text-[11px] leading-relaxed">{badge.description || ""}</p>
                {earned && badge.earned_at && (
                    <p className="mt-2 pt-2 border-t border-white/20 text-emerald-300 text-[10px] flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        مُكتسبة في {new Date(badge.earned_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                )}
                {!earned && (
                    <p className="mt-2 pt-2 border-t border-white/20 text-amber-300 text-[10px] font-medium">
                        🔓 {hint}
                    </p>
                )}
            </div>
            {earned && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md" title="مُكتسبة">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
            )}
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
}

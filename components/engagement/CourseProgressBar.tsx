"use client";

import { motion } from "framer-motion";
import { encouragementForProgress } from "@/lib/engagement/progressMessaging";

const TICKS = [25, 50, 75, 100];

export function CourseProgressBar({
    value,
    className = "",
    showMilestones = true,
    showEncouragement = false,
    size = "md",
    label = "التقدم",
}: {
    value: number;
    className?: string;
    showMilestones?: boolean;
    showEncouragement?: boolean;
    size?: "sm" | "md";
    label?: string;
}) {
    const pct = Math.max(0, Math.min(100, Math.round(value)));
    const h = size === "sm" ? "h-1.5" : "h-2";
    const mono = size === "sm" ? "text-xs" : "text-sm";

    return (
        <div className={`w-full ${className}`}>
            <div className="mb-1 flex items-center justify-between gap-2">
                <span className={`font-bold text-text/55 ${size === "sm" ? "text-[10px]" : "text-xs"}`}>{label}</span>
                <span className={`font-mono font-bold text-primary ${mono}`}>{pct}%</span>
            </div>
            <div className={`relative w-full ${h} overflow-hidden rounded-full bg-border/35`}>
                <motion.div
                    className={`${h} rounded-full bg-gradient-to-l from-primary to-primary/85`}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
            {showMilestones && (
                <div className="mt-2 flex justify-between gap-1 px-0.5" aria-hidden>
                    {TICKS.map((t) => (
                        <span
                            key={t}
                            title={`${t}%`}
                            className={`text-[9px] font-mono tabular-nums ${
                                pct >= t ? "font-semibold text-primary/80" : "text-text/30"
                            }`}
                        >
                            {t}%
                        </span>
                    ))}
                </div>
            )}
            {showEncouragement && (
                <p className="mt-2 text-[11px] leading-relaxed text-text/45 md:text-xs">{encouragementForProgress(pct)}</p>
            )}
        </div>
    );
}

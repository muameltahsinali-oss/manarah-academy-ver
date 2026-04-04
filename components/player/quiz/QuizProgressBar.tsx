"use client";

import { motion } from "framer-motion";

export function QuizProgressBar({
    currentIndex,
    total,
}: {
    currentIndex: number;
    total: number;
}) {
    const safeTotal = Math.max(1, total);
    const progressPercent = Math.round(((currentIndex + 1) / safeTotal) * 100);

    return (
        <div className="w-full">
            <div className="h-2 w-full rounded-full bg-border/30 overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-text/50">
                <span>
                    {currentIndex + 1} / {safeTotal}
                </span>
                <span>{progressPercent}%</span>
            </div>
        </div>
    );
}


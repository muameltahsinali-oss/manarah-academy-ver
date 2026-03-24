"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { BadgeItem } from "./BadgeCard";

const RARITY_COLORS: Record<string, string> = {
    common: "from-slate-500 to-slate-600",
    rare: "from-accent to-accent/80",
    epic: "from-purple-500 to-purple-600",
    legendary: "from-amber-400 to-amber-600",
};

const BURST_COUNT = 10;
const burstAngles = Array.from({ length: BURST_COUNT }, (_, i) => (i / BURST_COUNT) * 360);

export function BadgeUnlockToast({ badge }: { badge: BadgeItem }) {
    const rarity = badge.rarity || "common";
    const gradient = RARITY_COLORS[rarity] || RARITY_COLORS.common;

    // تشغيل صوت احتفالي عند ظهور الوسام
    useEffect(() => {
        try {
            const audio = new Audio("/sounds/badge-unlock.mp3");
            audio.volume = 0.7;
            audio.play().catch(() => {
                // تجاهل الخطأ في حال منع المتصفح التشغيل التلقائي
            });
        } catch {
            // تجاهل أي خطأ بدون كسر الواجهة
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/95 border border-primary/20 shadow-lg min-w-[280px] max-w-[360px] overflow-visible"
        >
            {/* انفجار صغير حول الأيقونة */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-start">
                <div className="relative w-20 h-20 -ml-3">
                    {burstAngles.map((deg, i) => {
                        const r = 34;
                        const tx = Math.cos((deg * Math.PI) / 180) * r;
                        const ty = Math.sin((deg * Math.PI) / 180) * r;
                        return (
                            <motion.div
                                key={i}
                                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                                animate={{ x: tx, y: ty, scale: 1, opacity: 0 }}
                                transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.02 }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* أيقونة الوسام */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
            >
                {badge.icon_url ? (
                    <motion.img
                        src={badge.icon_url}
                        alt={badge.name}
                        className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                        animate={{ scale: [1, 1.08, 1], rotate: [-3, 3, -3] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                ) : (
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], rotate: [-4, 4, -4] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Award className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </motion.div>
                )}
            </motion.div>

            {/* نص الوسام */}
            <div className="relative z-10 flex-1 min-w-0 text-right">
                <p className="text-[11px] text-primary/80 font-semibold mb-0.5">
                    حصلت على وسام جديد
                </p>
                <p className="text-sm font-bold text-slate-900 truncate">{badge.name}</p>
                {badge.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {badge.description}
                    </p>
                )}
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                    {badge.rarity && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {badge.rarity === "legendary"
                                ? "أسطوري"
                                : badge.rarity === "epic"
                                ? "ملحمي"
                                : badge.rarity === "rare"
                                ? "نادر"
                                : "عادي"}
                        </span>
                    )}
                    {badge.points ? (
                        <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary font-semibold">
                            +{badge.points} نقطة
                        </span>
                    ) : null}
                </div>
            </div>
        </motion.div>
    );
}

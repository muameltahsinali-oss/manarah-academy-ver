"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 1.5 }: { value: number, duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);

            // easeOutExpo
            const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            setCount(value * easeOut);

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    // Format to 1 decimal place if it's a float, otherwise integer
    const formatted = value % 1 !== 0
        ? count.toFixed(1)
        : Math.round(count).toString();

    return <span className="font-mono">{formatted}</span>;
}

import { useStudentDashboard } from "@/lib/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export function KPIRow() {
    const { data: res, isLoading } = useStudentDashboard();
    const stats = res?.data;

    const metrics = [
        { title: "دروس مكتملة هذا الأسبوع", value: stats?.weekly_completed_lessons ?? 0, suffix: "" },
        { title: "نسبة الإنجاز", value: stats?.average_progress ?? 0, suffix: "%" },
        { title: "الدورات النشطة", value: stats?.active_courses ?? 0, suffix: "" },
        { title: "الدورات المكتملة", value: stats?.completed_courses ?? 0, suffix: "" },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 md:h-32 bg-white border border-border/80 rounded-[4px] animate-pulse flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary/20" />
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {metrics.map((metric, idx) => (
                <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                    className="relative p-4 md:p-6 bg-white border border-border/80 rounded-[4px] overflow-hidden group hover:border-text/20 transition-colors"
                >
                    {/* Cyan Indicator Line */}
                    <div className="absolute top-0 right-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors" />

                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-text/60 mb-2 md:mb-3 line-clamp-2">
                        {metric.title}
                    </h3>
                    <div className="text-2xl md:text-4xl font-bold flex items-baseline gap-1 flex-wrap">
                        <AnimatedCounter value={metric.value} />
                        {metric.suffix && (
                            <span className="text-base md:text-xl text-text/50 font-normal">{metric.suffix}</span>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

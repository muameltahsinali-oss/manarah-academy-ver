"use client";

import { motion } from "framer-motion";
import { useStudentDashboard } from "@/lib/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export function AnalyticsSection() {
    const { data: res, isLoading } = useStudentDashboard();
    const weeklyLessons = res?.data?.weekly_completed_lessons ?? 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="w-full bg-white border border-border/80 rounded-[4px] p-4 md:p-6 lg:p-8 overflow-hidden"
        >
            <div className="flex justify-between items-end mb-4 md:mb-6">
                <div className="min-w-0">
                    <h2 className="text-base md:text-lg font-bold tracking-tight mb-0.5 md:mb-1">النشاط هذا الأسبوع</h2>
                    <p className="text-xs md:text-sm text-text/60">الدروس المكتملة خلال آخر 7 أيام</p>
                </div>
            </div>

            {isLoading ? (
                <div className="h-36 md:h-48 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                </div>
            ) : (
                <div className="relative h-36 md:h-48 w-full">
                    {/* Background ring and streak */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-border/60 relative">
                            <div className="absolute inset-2 rounded-full border-4 border-primary/30 border-t-primary" />
                        </div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <span className="text-xs font-mono text-text/50 uppercase tracking-[0.18em]">
                            دروس هذا الأسبوع
                        </span>
                        <span className="text-4xl md:text-5xl font-bold text-primary font-mono">
                            {weeklyLessons}
                        </span>
                        <span className="text-xs text-text/50">
                            سلسلة تعلّم نشطة
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

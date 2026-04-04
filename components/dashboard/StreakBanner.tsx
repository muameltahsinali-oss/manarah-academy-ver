"use client";

import { motion } from "framer-motion";
import { useStudentDashboard } from "@/lib/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export function StreakBanner() {
  const { data: res, isLoading } = useStudentDashboard();
  const streak = res?.data?.streak;
  const current = streak?.current ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[4.5rem] rounded-[4px] border border-border/80 bg-white px-4 py-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary/25" />
      </div>
    );
  }

  if (current <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[4px] border border-border/80 bg-gradient-to-l from-amber-500/5 to-transparent px-4 py-3 md:px-5 md:py-4"
      >
        <p className="text-sm md:text-base text-text/80">
          ابدأ سلسلة تعلم اليوم — أكمل درساً أو اختباراً ليبدأ العدّ 🔥
        </p>
      </motion.div>
    );
  }

  const milestone =
    current >= 30 ? 30 : current >= 7 ? 7 : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[4px] border border-amber-500/25 bg-gradient-to-l from-amber-500/10 via-orange-500/5 to-transparent px-4 py-3 md:px-5 md:py-4"
    >
      <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-amber-400/15 blur-2xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <motion.span
            className="text-3xl md:text-4xl shrink-0"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            aria-hidden
          >
            🔥
          </motion.span>
          <div className="min-w-0">
            <p className="text-base md:text-lg font-bold text-text leading-tight">
              أنت على سلسلة من {current} {current === 1 ? "يوم" : "أيام"} 🔥
            </p>
            {milestone && current === milestone && (
              <p className="text-xs md:text-sm text-amber-800/90 mt-0.5 font-medium">
                {milestone === 30
                  ? "إنجاز رائع — 30 يوماً متتالياً!"
                  : "أسبوع كامل — استمر!"}
              </p>
            )}
          </div>
        </div>
        {streak?.longest != null && streak.longest > 0 && (
          <p className="text-xs md:text-sm text-text/55 whitespace-nowrap sm:text-left">
            أطول سلسلة: {streak.longest} يوماً
          </p>
        )}
      </div>
    </motion.div>
  );
}

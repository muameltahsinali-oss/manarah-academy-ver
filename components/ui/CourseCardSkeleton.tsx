"use client";

import { motion } from "framer-motion";

export function CourseCardSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay }}
            className="h-full border border-border rounded-[4px] overflow-hidden bg-white"
        >
            <div className="w-full aspect-video bg-border/30 animate-pulse" />
            <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between">
                    <div className="h-6 w-16 bg-border/40 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-border/30 rounded animate-pulse" />
                </div>
                <div className="h-6 w-3/4 bg-border/40 rounded animate-pulse" />
                <div className="h-4 w-full bg-border/30 rounded animate-pulse" />
                <div className="h-4 w-2/3 max-w-[200px] bg-border/30 rounded animate-pulse" />
                <div className="pt-4 border-t border-border grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-4 bg-border/30 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

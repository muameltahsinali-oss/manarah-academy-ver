"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CourseOutcomesProps {
    outcomes?: string[];
}

export function CourseOutcomes({ outcomes = [] }: CourseOutcomesProps) {
    if (outcomes.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full p-8 border border-border/80 rounded-[4px] bg-white"
        >
            <h2 className="text-xl font-bold tracking-tight mb-6">ماذا ستتعلم؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                        <div className="mt-1 shrink-0 p-1 bg-primary/10 rounded-full text-primary">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium text-text/80 leading-relaxed">
                            {outcome}
                        </span>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}

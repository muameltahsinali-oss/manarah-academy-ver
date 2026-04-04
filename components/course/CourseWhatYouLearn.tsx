"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
};

interface CourseWhatYouLearnProps {
    outcomes?: string[];
}

/**
 * "What you'll learn" — نتائج تعلّم واضحة ومركّزة على الفائدة.
 */
export function CourseWhatYouLearn({ outcomes = [] }: CourseWhatYouLearnProps) {
    const list = outcomes.map((o) => o.trim()).filter(Boolean);
    if (list.length === 0) {
        return null;
    }

    return (
        <motion.section
            id="what-you-learn"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            className="scroll-mt-24 w-full rounded-[4px] border border-border bg-white p-6 md:p-8 shadow-sm shadow-secondary/5"
        >
            <div className="mb-6 md:mb-8">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary/90">النتائج</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-text md:text-[26px]">ماذا ستتعلّم؟</h2>
                <p className="mt-2 max-w-2xl text-sm text-text/65 leading-relaxed">
                    نقاط عملية تركّز على ما ستتمكّن منه بعد إكمال الدورة — وليس مجرد عناوين.
                </p>
            </div>

            <motion.ul
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-20px" }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4"
            >
                {list.map((line, idx) => (
                    <motion.li key={`${idx}-${line.slice(0, 24)}`} variants={item} className="flex gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-primary/10 text-primary">
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                        </span>
                        <span className="text-sm font-medium leading-relaxed text-text/85">{line}</span>
                    </motion.li>
                ))}
            </motion.ul>
        </motion.section>
    );
}

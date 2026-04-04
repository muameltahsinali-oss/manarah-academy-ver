"use client";

import { motion, useReducedMotion } from "framer-motion";

/** الجزء الداخلي للـ loader داخل نفس إطار الـ hero (بدون شريط علوي مكرر). */
export function HeroLoaderBody() {
    const reduce = useReducedMotion();

    return (
        <motion.div
            className="relative flex min-h-[min(70vh,600px)] flex-1 flex-col items-center justify-center gap-5 bg-gradient-to-br from-primary/[0.07] via-background/92 to-accent/[0.06] px-6 py-16 md:min-h-[560px]"
            initial={reduce ? false : { opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
            transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                className="relative h-14 w-14"
                animate={reduce ? { scale: [1, 1.02, 1] } : { scale: [1, 1.04, 1] }}
                transition={
                    reduce
                        ? { duration: 0 }
                        : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                }
                aria-hidden
            >
                <motion.div
                    className="absolute inset-0"
                    animate={reduce ? { rotate: 0 } : { rotate: 360 }}
                    transition={
                        reduce ? { duration: 0 } : { duration: 1.05, repeat: Infinity, ease: "linear" }
                    }
                >
                    <div className="absolute inset-0 rounded-full border-2 border-primary/18" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary" />
                </motion.div>
                <div className="absolute inset-2 rounded-full bg-primary/8 blur-xl" />
            </motion.div>
            <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-text/45">
                جاري التحميل
            </p>
        </motion.div>
    );
}

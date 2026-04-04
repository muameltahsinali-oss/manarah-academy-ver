"use client";

import { motion } from "framer-motion";

export function DashboardHeader() {
    return (
        <motion.div
            className="mb-4 flex flex-col gap-1.5 md:mb-10 md:gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        >
            <h1 className="text-xl font-bold tracking-tight text-text md:text-3xl lg:text-4xl">لوحة التحكم</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-text/70 md:text-base lg:text-lg">
                مرحباً بك مجدداً. ركّز على آخر دورة، تابع تقدّمك، واكمل خطوتك التالية بثقة.
            </p>
        </motion.div>
    );
}

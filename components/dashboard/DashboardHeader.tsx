"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useStudentDashboard } from "@/lib/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export function DashboardHeader() {
    const { data: res, isLoading } = useStudentDashboard();
    const lastCourseSlug = res?.data?.last_course_slug;

    return (
        <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-text mb-1 md:mb-2">
                    لوحة التحكم
                </h1>
                <p className="text-text/70 text-sm md:text-base lg:text-lg">
                    مرحباً بك مجدداً. تتبع تقدمك واستئنف رحلتك الهندسية.
                </p>
            </div>

            {isLoading ? (
                <div className="flex h-11 min-h-[2.75rem] w-full md:w-32 items-center justify-center bg-black/5 rounded-[4px] shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin text-text/20" />
                </div>
            ) : lastCourseSlug ? (
                <Link
                    href={`/learn/${lastCourseSlug}`}
                    className="group flex h-11 min-h-[2.75rem] items-center justify-center gap-2 rounded-[4px] bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 active:scale-[0.98] w-full md:w-auto shrink-0 touch-manipulation"
                >
                    استئناف التعلم
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </Link>
            ) : null}
        </motion.div>
    );
}


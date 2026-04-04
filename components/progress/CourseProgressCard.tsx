"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { CourseProgressBar } from "@/components/engagement/CourseProgressBar";

export type ProgressCourse = {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string | null;
    instructor: string;
    progress?: number;
    status: string;
    updated_at?: string | null;
};

export function CourseProgressCard({ course, index = 0 }: { course: ProgressCourse; index?: number }) {
    const progress = typeof course.progress === "number" ? course.progress : 0;
    const isDone = course.status === "completed";

    let lastLabel = "—";
    if (course.updated_at) {
        try {
            lastLabel = formatDistanceToNow(new Date(course.updated_at), { addSuffix: true, locale: ar });
        } catch {
            lastLabel = "مؤخراً";
        }
    }

    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_10px_36px_-18px_rgba(0,0,0,0.09)] transition hover:border-border hover:shadow-[0_16px_44px_-20px_rgba(0,0,0,0.12)]"
        >
            {course.thumbnail_url ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-border/20">
                    <img
                        src={course.thumbnail_url}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
            ) : (
                <div className="h-2 bg-gradient-to-l from-primary/15 to-transparent" />
            )}

            <div className="flex flex-1 flex-col p-4 md:p-5">
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-text md:text-lg">{course.title}</h3>
                <p className="mt-1 text-xs text-text/50">{course.instructor}</p>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-text/45">
                    <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                    <span>آخر نشاط: {lastLabel}</span>
                </div>

                <div className="mt-4 flex-1">
                    <CourseProgressBar
                        value={progress}
                        size="sm"
                        showMilestones={!isDone}
                        showEncouragement={false}
                        label="التقدم"
                    />
                </div>

                <Link
                    href={`/learn/${course.slug}`}
                    className={`mt-5 flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
                        isDone
                            ? "border border-border/60 bg-slate-50 text-text hover:bg-slate-100"
                            : "bg-primary text-white hover:bg-primary/90"
                    }`}
                >
                    {isDone ? "مراجعة الدورة" : "متابعة التعلّم"}
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </Link>
            </div>
        </motion.article>
    );
}

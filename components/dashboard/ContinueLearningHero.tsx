"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useStudentDashboard, useStudentCourses } from "@/lib/hooks/useDashboard";
import { CourseProgressBar } from "@/components/engagement/CourseProgressBar";
import { isBackendImageUrl } from "@/lib/utils/image";

type EnrolledCourse = {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string | null;
    instructor: string;
    duration?: string;
    status: string;
    progress?: number;
    updated_at?: string | null;
};

const DEFAULT_THUMB =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200";

function ContinueLearningHeroSkeleton() {
    return (
        <div
            className="w-full overflow-hidden rounded-[4px] border border-border/80 bg-white shadow-[0_4px_24px_-12px_rgba(0,0,0,0.06)]"
            aria-busy
            aria-label="جاري التحميل"
        >
            <div className="aspect-video w-full animate-pulse bg-border/35 md:aspect-auto md:h-[200px] md:rounded-none" />
            <div className="flex flex-col gap-4 p-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,280px)] md:items-center md:gap-8 md:p-8">
                <div className="flex min-w-0 flex-col gap-3">
                    <div className="h-3 w-24 animate-pulse rounded bg-border/45" />
                    <div className="h-7 w-full max-w-md animate-pulse rounded bg-border/40" />
                    <div className="h-4 w-40 animate-pulse rounded bg-border/30" />
                    <div className="h-2.5 w-full animate-pulse rounded-full bg-border/35" />
                    <div className="h-12 w-full max-w-xs animate-pulse rounded-[4px] bg-border/40" />
                </div>
            </div>
        </div>
    );
}

function pickContinueCourse(courses: EnrolledCourse[], lastSlug: string | null | undefined): EnrolledCourse | null {
    if (!courses.length) return null;

    const open = courses.filter((c) => c.status !== "completed" && (c.progress ?? 0) < 100);
    const pool = open.length > 0 ? open : courses;

    if (lastSlug) {
        const match = pool.find((c) => c.slug === lastSlug);
        if (match) return match;
    }

    const sorted = [...pool].sort((a, b) => {
        const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return tb - ta;
    });
    return sorted[0] ?? null;
}

export function ContinueLearningHero() {
    const { data: dashRes, isLoading: dashLoading } = useStudentDashboard();
    const { data: coursesRes, isLoading: coursesLoading } = useStudentCourses();

    const lastSlug = dashRes?.data?.last_course_slug;
    const courses: EnrolledCourse[] = coursesRes?.data || [];
    const course = pickContinueCourse(courses, lastSlug);

    const loading = dashLoading || coursesLoading;

    if (loading) {
        return <ContinueLearningHeroSkeleton />;
    }

    if (!course) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-[4px] border border-border/80 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.06)] md:p-8"
            >
                <div className="absolute inset-0 bg-gradient-to-l from-primary/[0.04] to-transparent pointer-events-none" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4 min-w-0">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[4px] border border-border/60 bg-background">
                            <BookOpen className="h-7 w-7 text-primary/50" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold tracking-tight text-text md:text-xl">ابدأ رحلتك التعليمية</h2>
                            <p className="mt-1 text-sm text-text/60">سجّل في دورة من الكتالوج وستظهر هنا لاستئناف التعلم بسهولة.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
                        <Link
                            href="/courses"
                            className="inline-flex h-12 min-h-[3rem] items-center justify-center rounded-[4px] bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 active:scale-[0.99] touch-manipulation"
                        >
                            تصفح الدورات
                        </Link>
                        <Link
                            href="/dashboard/courses"
                            className="inline-flex h-12 min-h-[3rem] items-center justify-center rounded-[4px] border border-border/80 bg-white px-6 text-sm font-bold text-text/80 transition-colors hover:bg-black/[0.03] active:scale-[0.99] touch-manipulation"
                        >
                            دوراتي
                        </Link>
                    </div>
                </div>
            </motion.section>
        );
    }

    const progress = Math.min(100, Math.max(0, course.progress ?? 0));
    const thumb = course.thumbnail_url || DEFAULT_THUMB;

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[4px] border border-border/80 bg-white shadow-[0_8px_32px_-16px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.1)]"
        >
            <div className="absolute inset-0 bg-gradient-to-l from-primary/[0.06] via-transparent to-transparent pointer-events-none" />
            {/* Mobile: صورة أولاً ثم المحتوى والزر في أسفل الإطار لسهولة الإبهام */}
            <div className="relative flex flex-col gap-5 p-5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,280px)] md:items-center md:gap-8 md:p-8">
                <Link
                    href={`/learn/${course.slug}`}
                    className="relative order-1 aspect-video w-full overflow-hidden rounded-[4px] border border-border/60 bg-background md:order-2 md:aspect-auto md:h-[200px]"
                >
                    <Image
                        src={thumb}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out active:scale-[0.99]"
                        sizes="(max-width: 768px) 100vw, 320px"
                        unoptimized={isBackendImageUrl(thumb)}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_THUMB;
                        }}
                    />
                </Link>

                <div className="order-2 flex min-w-0 flex-col gap-4 md:order-1">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text/45 md:text-xs">استمر في التعلّم</p>
                        <h2 className="mt-1 text-xl font-bold tracking-tight text-text md:text-2xl line-clamp-2">{course.title}</h2>
                        <p className="mt-1 text-sm text-text/55 truncate">مع {course.instructor}</p>
                    </div>
                    <CourseProgressBar value={progress} size="md" showMilestones={false} label="تقدّمك في الدورة" />
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <motion.div className="w-full sm:w-auto sm:flex-1" whileTap={{ scale: 0.98 }}>
                            <Link
                                href={`/learn/${course.slug}`}
                                className="group flex h-12 min-h-[3rem] w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 sm:min-w-[200px] touch-manipulation"
                            >
                                متابعة التعلّم
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                            </Link>
                        </motion.div>
                        <Link
                            href="/dashboard/courses"
                            className="py-3 text-center text-sm font-bold text-primary/90 underline-offset-4 transition-colors hover:text-primary hover:underline sm:py-2 sm:text-left touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start"
                        >
                            كل دوراتي
                        </Link>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

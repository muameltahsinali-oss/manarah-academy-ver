"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Loader2, Rocket } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useStudentDashboard, useStudentCourses } from "@/lib/hooks/useDashboard";
import { useBadges } from "@/lib/hooks/useBadges";
import { ProgressOverview } from "@/components/progress/ProgressOverview";
import { MotivationBanner } from "@/components/progress/MotivationBanner";
import { CourseProgressCard, type ProgressCourse } from "@/components/progress/CourseProgressCard";
import { ActivityStats } from "@/components/progress/ActivityStats";
import { MilestonesSection } from "@/components/progress/MilestonesSection";
import { BadgesPreview } from "@/components/progress/BadgesPreview";

function sortCoursesForDisplay(list: ProgressCourse[]): ProgressCourse[] {
    const rank = (s: string) => (s === "completed" ? 2 : s === "in-progress" ? 0 : 1);
    return [...list].sort((a, b) => {
        const dr = rank(a.status) - rank(b.status);
        if (dr !== 0) return dr;
        const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return tb - ta;
    });
}

export function ProgressClient() {
    const { data: dashRes, isLoading: dashLoading, isError: dashError } = useStudentDashboard();
    const { data: coursesRes, isLoading: coursesLoading } = useStudentCourses();
    const { data: badgesRes, isLoading: badgesLoading } = useBadges();

    const stats = dashRes?.data;
    const rawCourses: ProgressCourse[] = coursesRes?.data ?? [];
    const courses = useMemo(() => sortCoursesForDisplay(rawCourses), [rawCourses]);
    const badges = badgesRes?.data ?? [];

    const totalEnrolled = courses.length;
    const completedCourses = stats?.completed_courses ?? courses.filter((c) => c.status === "completed").length;
    const overallPercent = typeof stats?.average_progress === "number" ? stats.average_progress : 0;
    const weeklyLessons = stats?.weekly_completed_lessons ?? 0;
    const streakDays = stats?.streak?.current ?? 0;
    const recentActivities = stats?.recent_activities ?? [];
    const lastSlug = stats?.last_course_slug;
    const lastTitle = useMemo(() => {
        if (!lastSlug) return null;
        const c = courses.find((x) => x.slug === lastSlug);
        return c?.title ?? null;
    }, [courses, lastSlug]);

    const loading = dashLoading || coursesLoading || badgesLoading;

    if (loading) {
        return (
            <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                <p className="text-sm text-text/50">جاري تحميل لوحة التقدّم...</p>
            </div>
        );
    }

    if (dashError) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-destructive md:px-6">
                تعذر تحميل البيانات. حاول مرة أخرى.
            </div>
        );
    }

    if (totalEnrolled === 0) {
        return (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
                <motion.div {...getFadeUp(0, 0.45)}>
                    <h1 className="text-3xl font-bold tracking-tight text-text md:text-4xl">تقدّمي</h1>
                    <p className="mt-2 text-sm text-text/60">تتبّع إنجازك فور اشتراكك بأول دورة.</p>
                </motion.div>
                <motion.div
                    {...getFadeUp(0.1, 0.5)}
                    className="flex flex-col items-center rounded-2xl border border-border/60 bg-white px-8 py-16 text-center shadow-[0_16px_48px_-24px_rgba(0,0,0,0.1)]"
                >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                        <Rocket className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold text-text">ابدأ دورتك الأولى 🚀</h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-text/60">
                        لم نجد أي دورة مسجّلة بعد. اختر دورة من الكتالوج وابدأ — ستظهر هنا نسب الإنجاز، النشاط، والأوسمة.
                    </p>
                    <Link
                        href="/courses"
                        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        تصفّح الدورات
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:gap-10 md:px-6 md:py-10">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-3xl font-bold tracking-tight text-text md:text-4xl">تقدّمي</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text/60 md:text-base">
                    لوحة واحدة لتجيب: إلى أين وصلت؟ ماذا أنجزت؟ وما الخطوة التالية؟
                </p>
            </motion.div>

            <MotivationBanner
                averageProgress={overallPercent}
                lastCourseSlug={lastSlug}
                lastCourseTitle={lastTitle}
                hasCourses={totalEnrolled > 0}
            />

            <ProgressOverview
                totalEnrolled={totalEnrolled}
                completedCourses={completedCourses}
                overallPercent={overallPercent}
            />

            <section>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 text-lg font-bold text-text md:text-xl"
                >
                    دوراتي
                </motion.h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {courses.map((course, idx) => (
                        <CourseProgressCard key={course.id} course={course} index={idx} />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ActivityStats
                    weeklyLessons={weeklyLessons}
                    streakDays={streakDays}
                    recentActivities={recentActivities as Array<{ at?: string | null }>}
                />
                <MilestonesSection overallPercent={overallPercent} />
            </div>

            <BadgesPreview badges={badges} />
        </div>
    );
}

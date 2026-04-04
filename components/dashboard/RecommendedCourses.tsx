"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseCardSkeleton } from "@/components/ui/CourseCardSkeleton";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCoursesWithEnabled, useRecommendedCourses } from "@/lib/hooks/useCoursePlayer";
import { mapApiCourseToFeaturedCard } from "@/lib/recommendations/mapCourse";
import { CourseRecommendationRail } from "@/components/recommendations/CourseRecommendationRail";

export function RecommendedCourses() {
    const { user } = useAuth();
    const interests = user?.interests || [];
    const hasInterests = Array.isArray(interests) && interests.length > 0;

    const personalized = !!user && hasInterests;

    const { data: recRes, isLoading: recLoading } = useRecommendedCourses(personalized);
    const { data: catRes, isLoading: catLoading } = useCoursesWithEnabled(!personalized);

    const isLoading = personalized ? recLoading : catLoading;

    if (isLoading) {
        return (
            <section className="w-full" aria-busy aria-label="جاري تحميل المقترحات">
                <div className="mb-6 h-7 w-44 animate-pulse rounded bg-border/40" />
                <div className="-mx-1 flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin] snap-x snap-mandatory md:mx-0 md:grid md:snap-none md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-[min(100%,300px)] shrink-0 snap-start md:w-auto md:shrink"
                        >
                            <CourseCardSkeleton delay={i * 0.06} />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (personalized) {
        const d = recRes?.data;
        const forYou = (d?.for_you ?? []).map((row: { course: Record<string, unknown>; reason_label?: string }) =>
            mapApiCourseToFeaturedCard(row.course, row.reason_label)
        );
        const because = (d?.because_you_learned ?? []).map(
            (row: { course: Record<string, unknown>; reason_label?: string }) =>
                mapApiCourseToFeaturedCard(row.course, row.reason_label)
        );
        const continueRows = d?.continue_learning ?? [];
        const continueCards = continueRows.map(
            (row: { course: Record<string, unknown>; progress: number }) => ({
                ...mapApiCourseToFeaturedCard(row.course),
                recommendationHint: `متابعة التعلّم — ${row.progress}% مكتمل`,
            })
        );

        if (forYou.length === 0 && because.length === 0 && continueCards.length === 0) {
            return null;
        }

        return (
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full"
            >
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-text md:text-xl">مقترحة لك</h2>
                        <p className="text-xs text-text/60 md:text-sm">بناءً على تعلّمك واهتماماتك.</p>
                    </div>
                    <Link
                        href="/courses"
                        className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80"
                    >
                        تصفح الكتالوج
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                </div>

                {continueCards.length > 0 && (
                    <CourseRecommendationRail
                        title="واصل التعلّم"
                        subtitle="دورات بدأتها."
                        courses={continueCards}
                    />
                )}
                {forYou.length > 0 && <CourseRecommendationRail courses={forYou} />}
                {because.length > 0 && (
                    <CourseRecommendationRail
                        title="لأنك تعلّمت سابقاً"
                        subtitle="نفس المجال بعد إكمال دورات."
                        courses={because}
                    />
                )}
            </motion.section>
        );
    }

    const raw = catRes?.data;
    const list = Array.isArray(raw) ? raw : (raw as { data?: unknown[] })?.data ?? [];
    const catalog = (list as Record<string, unknown>[]).slice(0, 6).map((c) => mapApiCourseToFeaturedCard(c));

    if (catalog.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-text md:text-xl">مقترحة لك</h2>
                    <p className="text-xs text-text/60 md:text-sm">دورات من الكتالوج — أضف اهتماماتك من الإعدادات لتوصيات أدق.</p>
                </div>
                <Link href="/courses" className="text-sm font-bold text-primary hover:underline">
                    عرض الكل
                </Link>
            </div>
            <CourseRecommendationRail title="" courses={catalog} />
        </motion.section>
    );
}

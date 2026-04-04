"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CourseCardSkeleton } from "@/components/ui/CourseCardSkeleton";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCoursesWithEnabled, useRecommendedCourses } from "@/lib/hooks/useCoursePlayer";
import { mapApiCourseToFeaturedCard } from "@/lib/recommendations/mapCourse";
import { CourseRecommendationRail } from "@/components/recommendations/CourseRecommendationRail";

export function FeaturedCoursesSection({ forceCatalog = false }: { forceCatalog?: boolean }) {
    const { user, isAuthenticated } = useAuth();
    const interests = user?.interests || [];
    const personalized =
        !forceCatalog && isAuthenticated && Array.isArray(interests) && interests.length > 0;

    const { data: featuredRes, isLoading: isFeaturedLoading } = useCoursesWithEnabled(!personalized);
    const { data: recommendedRes, isLoading: isRecommendedLoading } = useRecommendedCourses(personalized);

    const isLoading = personalized ? isRecommendedLoading : isFeaturedLoading;

    return (
        <Section spacing="xl" id="courses" className="bg-background border-b border-border">
            <Container>
                <div className="mb-10 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
                    <div>
                        {personalized ? (
                            <>
                                <h2 className="mb-4 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                                    موصى لك شخصياً
                                </h2>
                                <h3 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
                                    دورات تلائم اهتماماتك ومسارك.
                                </h3>
                            </>
                        ) : (
                            <>
                                <h2 className="mb-4 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                                    الكتالوج
                                </h2>
                                <h3 className="text-3xl font-bold tracking-tight text-text md:text-4xl">دورات هندسية.</h3>
                            </>
                        )}
                    </div>
                    <Link
                        href="/courses"
                        className="group inline-flex items-center gap-1 pb-1 text-sm font-bold text-primary transition-colors hover:text-primary/80"
                    >
                        تصفح الكتالوج بالكامل
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-y-[2px] group-hover:-translate-x-[2px]" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <CourseCardSkeleton key={i} delay={i * 0.06} />
                        ))}
                    </div>
                ) : personalized ? (
                    <PersonalizedRails data={recommendedRes?.data} />
                ) : (
                    <CatalogGrid data={featuredRes?.data} />
                )}
            </Container>
        </Section>
    );
}

function PersonalizedRails({ data }: { data?: Record<string, unknown> }) {
    const forYou = ((data?.for_you as { course: Record<string, unknown>; reason_label?: string }[]) ?? []).map(
        (row) => mapApiCourseToFeaturedCard(row.course, row.reason_label)
    );
    const because = (
        (data?.because_you_learned as { course: Record<string, unknown>; reason_label?: string }[]) ?? []
    ).map((row) => mapApiCourseToFeaturedCard(row.course, row.reason_label));
    const popular = ((data?.popular as { course: Record<string, unknown>; reason_label?: string }[]) ?? []).map(
        (row) => mapApiCourseToFeaturedCard(row.course, row.reason_label)
    );

    const primary = forYou.length > 0 ? forYou : popular;

    if (primary.length === 0 && because.length === 0) {
        return (
            <div className="rounded-[4px] border border-border bg-white p-8 text-center text-sm text-text/60">
                لا توجد توصيات كافية بعد. سجّل اهتماماتك أو تصفّح الكتالوج.
            </div>
        );
    }

    return (
        <>
            {primary.length > 0 && (
                <CourseRecommendationRail
                    title="موصى لك"
                    subtitle="ترتيب ذكي — ليس عشوائياً."
                    courses={primary.slice(0, 9)}
                />
            )}
            {because.length > 0 && (
                <CourseRecommendationRail
                    title="لأنك تعلّمت سابقاً"
                    subtitle="متابعة منطقية لمسارك."
                    courses={because.slice(0, 6)}
                />
            )}
        </>
    );
}

function CatalogGrid({ data }: { data?: unknown }) {
    const raw = data as { data?: unknown[] } | unknown[] | undefined;
    const list = Array.isArray(raw) ? raw : raw?.data ?? [];
    const courses = (list as Record<string, unknown>[]).slice(0, 6).map((c) => mapApiCourseToFeaturedCard(c));

    if (courses.length === 0) {
        return (
            <div className="rounded-[4px] border border-border bg-white p-8 text-center text-sm text-text/60">
                لا توجد دورات لعرضها حالياً.
            </div>
        );
    }

    return <CourseRecommendationRail title="" courses={courses} />;
}

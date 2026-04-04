"use client";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CourseRecommendationRail } from "@/components/recommendations/CourseRecommendationRail";
import { CourseCardSkeleton } from "@/components/ui/CourseCardSkeleton";
import { useTrendingCourses } from "@/lib/hooks/useDiscovery";
import { mapApiCourseToFeaturedCard } from "@/lib/recommendations/mapCourse";

export function GuestTrendingSection() {
    const { data: res, isLoading } = useTrendingCourses(true);
    const raw = res?.data?.courses ?? [];
    const courses = raw.slice(0, 10).map((c) => mapApiCourseToFeaturedCard(c as Record<string, unknown>));

    if (!isLoading && courses.length === 0) return null;

    return (
        <Section spacing="xl" className="border-b border-border bg-background">
            <Container>
                <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                            رائجة
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
                            الأكثر شعبية وتقييماً
                        </h2>
                        <p className="mt-2 max-w-xl text-sm text-text/60">
                            دورات يختارها المتعلّمون بناءً على التقييم والتسجيل.
                        </p>
                    </div>
                </div>
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <CourseCardSkeleton key={i} delay={i * 0.05} />
                        ))}
                    </div>
                ) : (
                    <CourseRecommendationRail title="" subtitle="" courses={courses} />
                )}
            </Container>
        </Section>
    );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CourseCard } from "@/components/ui/CourseCard";
import { useCoursesWithEnabled, useRecommendedCourses } from "@/lib/hooks/useCoursePlayer";
import { CourseCardSkeleton } from "@/components/ui/CourseCardSkeleton";
import { useAuth } from "@/lib/hooks/useAuth";

type CourseCardInput = {
    id: number;
    slug: string;
    title?: string;
    description?: string;
    instructor?: { name?: string };
    duration?: string;
    rating?: number | string;
    students?: number | string;
    level?: string;
    category?: string;
    thumbnail?: string;
};

export function FeaturedCoursesSection() {
    const { user } = useAuth();
    const interests = user?.interests || [];
    const hasInterests = Array.isArray(interests) && interests.length > 0;

    const { data: featuredRes, isLoading: isFeaturedLoading } = useCoursesWithEnabled(!hasInterests);
    const { data: recommendedRes, isLoading: isRecommendedLoading } = useRecommendedCourses(hasInterests);

    const dataRes = hasInterests ? recommendedRes : featuredRes;
    const isLoading = hasInterests ? isRecommendedLoading : isFeaturedLoading;

    const realCourses = (dataRes?.data?.slice(0, 6) || []) as CourseCardInput[];
    const displayCourses = realCourses.map((c) => ({
        id: c.id,
        slug: c.slug,
        prefix: c.slug.toUpperCase().split('-')[0] || "CRS",
        title: c.title,
        description: c.description,
        instructor: c.instructor?.name || "مدرّب",
        duration: c.duration || "4h",
        rating: c.rating?.toString() || "4.5",
        students: c.students?.toString() || "0",
        level: c.level,
        tag: c.category || "عام"
    }));

    return (
        <Section spacing="xl" id="courses" className="bg-background border-b border-border">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        {hasInterests ? (
                            <>
                                <h2 className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                                    موصى بناءً على اهتماماتك
                                </h2>
                                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
                                    دورات مقترحة لك.
                                </h3>
                            </>
                        ) : (
                            <>
                                <h2 className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">الكتالوج المبدئي</h2>
                                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
                                    دورات هندسية.
                                </h3>
                            </>
                        )}
                    </div>
                    <Link href="/courses" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group pb-1">
                        تصفح الكتالوج بالكامل
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-y-[2px] group-hover:-translate-x-[2px]" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <CourseCardSkeleton key={i} delay={i * 0.06} />
                        ))}
                    </div>
                ) : displayCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayCourses.map((course, idx) => (
                            <CourseCard key={course.id || idx} {...course} delay={idx * 0.1} />
                        ))}
                    </div>
                ) : (
                    <div className="border border-border rounded-[4px] bg-white p-8 text-center text-sm text-text/60">
                        {hasInterests
                            ? "لا توجد توصيات مطابقة حالياً. جرّب اختيار اهتمامات مختلفة."
                            : "لا توجد دورات لعرضها حالياً. ستظهر الدورات المميزة هنا فور توفرها في الكتالوج."}
                    </div>
                )}
            </Container>
        </Section>
    );
}

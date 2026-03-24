"use client";

import { motion } from "framer-motion";
import { CourseCard } from "@/components/ui/CourseCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/hooks/useAuth";
import { useStudentCourses } from "@/lib/hooks/useDashboard";
import { useCoursesWithEnabled, useRecommendedCourses } from "@/lib/hooks/useCoursePlayer";

type MyCourseSummary = {
    id: number;
    status: "completed" | "in-progress" | "not-started" | string;
};

type CourseSummary = {
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

export function RecommendedCourses() {
    const { user } = useAuth();
    const interests = user?.interests || [];
    const hasInterests = Array.isArray(interests) && interests.length > 0;

    const { data: recommendedRes, isLoading: isRecommendedLoading } = useRecommendedCourses(hasInterests);
    const { data: featuredRes, isLoading: isFeaturedLoading } = useCoursesWithEnabled(!hasInterests);

    const { data: myCoursesRes, isLoading: isMyCoursesLoading } = useStudentCourses(true);

    const baseCourses = ((hasInterests ? recommendedRes : featuredRes)?.data || []) as CourseSummary[];

    const completedIds = new Set(
        ((myCoursesRes?.data || []) as MyCourseSummary[])
            .filter((c) => c.status === "completed")
            .map((c) => c.id),
    );

    const courses = baseCourses.filter((c) => !completedIds.has(c.id)).slice(0, 3);

    const isLoading = (hasInterests ? isRecommendedLoading : isFeaturedLoading) || isMyCoursesLoading;

    if (isLoading) {
        return (
            <div className="w-full py-12 flex justify-center items-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="w-full"
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-4 md:mb-6">
                <div className="min-w-0">
                    <h2 className="text-base md:text-lg font-bold tracking-tight mb-0.5 md:mb-1">
                        دورات تالية مقترحة لك
                    </h2>
                    <p className="text-xs md:text-sm text-text/60">
                        {hasInterests ? "موصى بناءً على اهتماماتك" : "بناءً على الدورات المميزة"}
                    </p>
                </div>
                <Link
                    href="/courses"
                    className="group flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 active:opacity-80 transition-opacity touch-manipulation py-1"
                >
                    تصفح الكتالوج
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {courses.map((course, idx) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + (idx * 0.1), ease: "easeOut" }}
                        >
                            <CourseCard
                                id={course.id}
                                slug={course.slug}
                                prefix={course.slug.toUpperCase().split('-')[0] || "CRS"}
                                title={course.title || "بدون عنوان"}
                                description={course.description}
                                instructor={course.instructor?.name || "مدرب"}
                                duration={course.duration || "4h"}
                                rating={course.rating?.toString() || "4.5"}
                                students={course.students?.toString() || "0"}
                                level={
                                    course.level === 'beginner'
                                        ? 'مبتدئ'
                                        : course.level === 'intermediate'
                                          ? 'متوسط'
                                          : 'متقدم'
                                }
                                tag={course.category || "عام"}
                                thumbnail={course.thumbnail}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="border border-border rounded-[4px] bg-background p-8 text-center text-sm text-text/60">
                    {hasInterests ? "لا توجد دورات تالية مطابقة لاهتماماتك حالياً." : "لا توجد دورات مقترحة حالياً."}
                </div>
            )}
        </motion.div>
    );
}

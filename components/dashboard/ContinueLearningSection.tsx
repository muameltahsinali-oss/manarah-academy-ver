"use client";

import { useStudentCourses } from "@/lib/hooks/useDashboard";
import { CourseCard } from "@/components/ui/CourseCard";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function ContinueLearningSection() {
    const { data: res, isLoading } = useStudentCourses();
    const courses = res?.data || [];

    const inProgress = courses.filter((course: any) => !course.is_completed);
    const displayCourses = (inProgress.length > 0 ? inProgress : courses).slice(0, 3);

    if (isLoading) {
        return (
            <div className="w-full py-10 flex items-center justify-center bg-white border border-border/80 rounded-[4px]">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (displayCourses.length === 0) {
        return null;
    }

    return (
        <section className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
                <div className="min-w-0">
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-text mb-0.5 md:mb-1">
                        استمر في التعلّم
                    </h2>
                    <p className="text-xs md:text-sm text-text/60">
                        دورات بدأت بها ويمكنك استئنافها الآن.
                    </p>
                </div>
                <Link
                    href="/dashboard/courses"
                    className="text-sm font-bold text-primary hover:text-primary/80 active:opacity-80 transition-opacity touch-manipulation py-1"
                >
                    عرض كل الدورات
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayCourses.map((course: any, idx: number) => (
                    <CourseCard
                        key={course.id || idx}
                        id={course.id}
                        slug={course.slug}
                        prefix={course.slug?.toUpperCase().split("-")[0] || "CRS"}
                        title={course.title}
                        description={course.description}
                        instructor={course.instructor?.name || "مدرّب"}
                        duration={course.duration || "4h"}
                        rating={course.rating?.toString() || "4.5"}
                        students={course.students?.toString() || "0"}
                        level={course.level}
                        tag={course.category || "عام"}
                        thumbnail={course.thumbnail}
                        delay={idx * 0.05}
                    />
                ))}
            </div>
        </section>
    );
}


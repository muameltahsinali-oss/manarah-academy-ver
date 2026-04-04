"use client";

import { useCourseSearch } from "@/lib/hooks/useCourseSearch";
import { Ghost } from "lucide-react";
import { CourseCard } from "@/components/ui/CourseCard";
import { CourseCardSkeleton } from "@/components/ui/CourseCardSkeleton";
import type { CourseFilters } from "@/components/courses/CoursesSidebar";
import { Pagination } from "@/components/courses/Pagination";

function parseDurationHours(v: any): number | null {
    if (v == null) return null;
    if (typeof v === "number" && Number.isFinite(v)) {
        // backend may store minutes
        if (v > 0 && v <= 600) return v / 60;
        // if already hours
        if (v > 0 && v < 100) return v;
        return null;
    }
    if (typeof v !== "string") return null;
    const s = v.trim().toLowerCase();
    // "4h", "4 h", "2.5h"
    const hMatch = s.match(/(\d+(?:\.\d+)?)\s*h/);
    if (hMatch) return Number(hMatch[1]);
    // "120" minutes as string
    const n = Number(s);
    if (Number.isFinite(n) && n > 0) return n / 60;
    return null;
}

type CourseSort = "newest" | "popular" | "top_rated";

export function CourseGrid({
    filters,
    sort,
    page,
    onPageChange,
}: {
    filters: CourseFilters;
    sort: CourseSort;
    page: number;
    onPageChange: (page: number) => void;
}) {
    const { courses, meta, isLoading, isFetching, isError, error } = useCourseSearch(filters, sort, page);

    // Only apply client-side duration filter if `course.duration` exists.
    const filtered = filters.duration
        ? courses.filter((course: any) => {
              if (course.duration == null) return true;
              const hours = parseDurationHours(course.duration);
              if (hours == null) return true; // don't accidentally drop results
              if (filters.duration === "lt2" && !(hours < 2)) return false;
              if (filters.duration === "2to5" && !(hours >= 2 && hours <= 5)) return false;
              if (filters.duration === "gt5" && !(hours > 5)) return false;
              return true;
          })
        : courses;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <CourseCardSkeleton key={i} delay={i * 0.05} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background border border-dashed border-border/80 rounded-[4px] col-span-full">
                <Ghost className="w-12 h-12 text-text/20 mb-4" />
                <h3 className="text-xl font-bold text-text/60">تعذر تحميل نتائج البحث</h3>
                <p className="text-sm text-text/40">
                    {error instanceof Error ? error.message : "حاول مرة أخرى لاحقاً."}
                </p>
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background border border-dashed border-border/80 rounded-[4px] col-span-full">
                <Ghost className="w-12 h-12 text-text/20 mb-4" />
                <h3 className="text-xl font-bold text-text/60">لا توجد نتائج</h3>
                <p className="text-sm text-text/40">جرّب تعديل البحث أو إزالة بعض الفلاتر.</p>
            </div>
        );
    }

    return (
        <>
            <div className="relative">
                <div
                    className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${
                        isFetching ? "opacity-60" : ""
                    } transition-opacity`}
                >
                    {filtered.map((course: any, idx: number) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            slug={course.slug}
                            prefix={course.slug.toUpperCase().split("-")[0] || "CRS"}
                            title={course.title}
                            description={course.description}
                            instructor={course.instructor?.name || "مدرّب"}
                            duration={course.duration || "4h"}
                            rating={(course.rating ?? 0).toString()}
                            students={(course.students ?? course.students_count ?? 0).toString()}
                            level={course.level}
                            tag={course.category || "عام"}
                            thumbnail={course.thumbnail}
                            delay={idx * 0.05}
                        />
                    ))}
                </div>

                {isFetching && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <CourseCardSkeleton key={i} delay={i * 0.02} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {meta && (
                <Pagination
                    currentPage={meta.current_page ?? page}
                    lastPage={meta.last_page ?? 1}
                    onPageChange={onPageChange}
                />
            )}
        </>
    );
}

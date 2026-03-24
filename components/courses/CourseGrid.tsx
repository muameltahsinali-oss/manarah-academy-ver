"use client";

import { useCourses } from "@/lib/hooks/useCoursePlayer";
import { Ghost } from "lucide-react";
import { CourseCard } from "@/components/ui/CourseCard";
import { CourseCardSkeleton } from "@/components/ui/CourseCardSkeleton";
import type { CourseFilters } from "@/components/courses/CoursesSidebar";

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

export function CourseGrid({ filters }: { filters?: CourseFilters }) {
    const { data: res, isLoading } = useCourses();
    const courses = res?.data || [];
    const f = filters ?? { query: "", category: null, level: null, duration: null };

    const filtered = courses.filter((course: any) => {
        const q = f.query?.trim();
        if (q) {
            const hay = `${course.title ?? ""} ${course.description ?? ""}`.toLowerCase();
            if (!hay.includes(q.toLowerCase())) return false;
        }
        if (f.category) {
            const cat = (course.category ?? "عام").toString();
            if (cat !== f.category) return false;
        }
        if (f.level) {
            const lvl = (course.level ?? "").toString();
            if (lvl !== f.level) return false;
        }
        if (f.duration) {
            const hours = parseDurationHours(course.duration);
            if (hours == null) return false;
            if (f.duration === "lt2" && !(hours < 2)) return false;
            if (f.duration === "2to5" && !(hours >= 2 && hours <= 5)) return false;
            if (f.duration === "gt5" && !(hours > 5)) return false;
        }
        return true;
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <CourseCardSkeleton key={i} delay={i * 0.05} />
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background border border-dashed border-border/80 rounded-[4px] col-span-full">
                <Ghost className="w-12 h-12 text-text/20 mb-4" />
                <h3 className="text-xl font-bold text-text/60">لا توجد دورات حالياً</h3>
                <p className="text-sm text-text/40">يرجى المحاولة لاحقاً أو تغيير الفلاتر.</p>
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-border/80 rounded-[4px]">
                <Ghost className="w-12 h-12 text-text/20 mb-4" />
                <h3 className="text-xl font-bold text-text/60">لا توجد نتائج</h3>
                <p className="text-sm text-text/40">جرّب تعديل البحث أو إزالة بعض الفلاتر.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((course: any, idx: number) => (
                <CourseCard
                    key={course.id}
                    id={course.id}
                    slug={course.slug}
                    prefix={course.slug.toUpperCase().split('-')[0] || "CRS"}
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
    );
}

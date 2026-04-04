"use client";

import { CourseCard } from "@/components/ui/CourseCard";
import type { ComponentProps } from "react";

type CardProps = ComponentProps<typeof CourseCard>;

export function CourseRecommendationRail({
    title,
    subtitle,
    courses,
}: {
    title?: string;
    subtitle?: string;
    courses: CardProps[];
}) {
    if (courses.length === 0) return null;

    return (
        <div className="mb-8 md:mb-10">
            {(title || subtitle) && (
                <div className="mb-4 md:mb-5">
                    {title ? <h3 className="text-lg font-bold tracking-tight text-text md:text-xl">{title}</h3> : null}
                    {subtitle && <p className="mt-1 text-xs text-text/55 md:text-sm">{subtitle}</p>}
                </div>
            )}
            <div className="-mx-1 flex touch-pan-x gap-4 overflow-x-auto scroll-smooth pb-2 pt-1 [scrollbar-width:thin] snap-x snap-mandatory md:mx-0 md:grid md:snap-none md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
                {courses.map((course, idx) => (
                    <div
                        key={`${course.id}-${idx}`}
                        className="w-[min(100%,300px)] shrink-0 snap-start md:w-auto md:shrink"
                    >
                        <CourseCard {...course} delay={idx * 0.06} />
                    </div>
                ))}
            </div>
        </div>
    );
}

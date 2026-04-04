import { useQuery } from "@tanstack/react-query";
import { get } from "../api";

export type CourseCategoryItem = {
    name: string;
    courses_count: number;
};

export function useCourseCategories() {
    return useQuery({
        queryKey: ["courses", "categories"],
        queryFn: () =>
            get<{ data: { categories: CourseCategoryItem[] } }>("/courses/categories"),
        staleTime: 5 * 60 * 1000,
    });
}

/** Public catalog: popular courses (trending / social proof). */
export function useTrendingCourses(enabled = true) {
    return useQuery({
        queryKey: ["courses", "search", "trending"],
        queryFn: () =>
            get<{
                data: {
                    courses: Record<string, unknown>[];
                    meta: { current_page: number; last_page: number; total: number };
                };
            }>("/courses/search", { sort: "popular", page: 1 }),
        enabled,
        staleTime: 60 * 1000,
    });
}

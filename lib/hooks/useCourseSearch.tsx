import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import type { CourseFilters } from "@/components/courses/CoursesSidebar";

type CourseSort = "newest" | "popular" | "top_rated" | "price_low" | "price_high";

function mapLevelToBackend(level: CourseFilters["level"]): string | null {
  if (!level) return null;
  if (level === "مبتدئ") return "beginner";
  if (level === "متوسط") return "intermediate";
  if (level === "متقدم") return "advanced";
  // Fallback: if it already looks like a backend code.
  if (level === "beginner" || level === "intermediate" || level === "advanced") return level;
  return null;
}

export function useCourseSearch(
  filters: CourseFilters,
  sort: CourseSort,
  page: number
) {
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(filters.query.trim()), 300);
    return () => window.clearTimeout(t);
  }, [filters.query]);

  const params = useMemo(() => {
    const mappedLevel = mapLevelToBackend(filters.level);
    const q = debouncedQuery.length ? debouncedQuery : null;

    return {
      ...(q ? { q } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(mappedLevel ? { level: mappedLevel } : {}),
      sort,
      page,
    };
  }, [debouncedQuery, filters.category, filters.level, sort, page]);

  const query = useQuery({
    queryKey: ["courses/search", params],
    queryFn: () => get<any>("/courses/search", params),
    placeholderData: keepPreviousData,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const courses = query.data?.data?.courses ?? [];
  const meta = query.data?.data?.meta ?? null;

  return {
    ...query,
    courses,
    meta,
  };
}


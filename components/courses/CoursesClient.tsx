"use client";

import { useEffect, useMemo, useState } from "react";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { CoursesSidebar, type CourseFilters } from "@/components/courses/CoursesSidebar";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const DEFAULT_FILTERS: CourseFilters = {
  query: "",
  category: null,
  level: null,
  duration: null,
};

export function CoursesClient() {
  const [filters, setFilters] = useState<CourseFilters>(DEFAULT_FILTERS);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const raw = searchParams.get("category");
    if (!raw) return;
    const decoded = decodeURIComponent(raw);
    setFilters((prev) =>
      prev.category === decoded ? prev : { ...prev, category: decoded }
    );
  }, [searchParams]);

  type CourseSort = "newest" | "popular" | "top_rated";

  const page = useMemo(() => {
    const raw = searchParams.get("page");
    const n = raw ? Number(raw) : 1;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  }, [searchParams]);

  const sort = useMemo<CourseSort>(() => {
    const raw = searchParams.get("sort") ?? "newest";
    if (raw === "popular" || raw === "top_rated" || raw === "newest") return raw;
    return "newest";
  }, [searchParams]);

  const activeCount = useMemo(() => {
    let c = 0;
    if (filters.query.trim()) c++;
    if (filters.category) c++;
    if (filters.level) c++;
    if (filters.duration) c++;
    return c;
  }, [filters]);

  const pushPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/courses?${params.toString()}`);
  };

  // Reset pagination when filters change (debounced query is handled in the search hook).
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (page === 1) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.push(`/courses?${params.toString()}`);
    }, 300);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.query, filters.category, filters.level, filters.duration]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="md:sticky md:top-24 space-y-4">
          <div className="rounded-[4px] border border-border/80 bg-white p-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-[4px] bg-primary/10 flex items-center justify-center">
                <Search className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-mono text-text/50 uppercase tracking-[0.18em] block mb-1">
                  بحث سريع
                </label>
                <input
                  value={filters.query}
                  onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
                  placeholder="ابحث باسم الدورة أو وصفها..."
                  className="w-full rounded-[4px] border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>

          <CoursesSidebar
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(DEFAULT_FILTERS)}
            activeCount={activeCount}
          />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-sm text-text/60">ترتيب النتائج</div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => {
                const nextSort = e.target.value as CourseSort;
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", nextSort);
                params.set("page", "1");
                router.push(`/courses?${params.toString()}`);
              }}
              className="rounded-[4px] border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            >
              <option value="newest">الأحدث</option>
              <option value="popular">الأكثر شيوعاً</option>
              <option value="top_rated">الأعلى تقيماً</option>
            </select>
          </div>
        </div>

        <CourseGrid filters={filters} sort={sort} page={page} onPageChange={pushPage} />
      </div>
    </div>
  );
}


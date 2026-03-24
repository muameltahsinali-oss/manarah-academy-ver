"use client";

import { useMemo, useState } from "react";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { CoursesSidebar, type CourseFilters } from "@/components/courses/CoursesSidebar";
import { Search } from "lucide-react";

const DEFAULT_FILTERS: CourseFilters = {
  query: "",
  category: null,
  level: null,
  duration: null,
};

export function CoursesClient() {
  const [filters, setFilters] = useState<CourseFilters>(DEFAULT_FILTERS);

  const activeCount = useMemo(() => {
    let c = 0;
    if (filters.query.trim()) c++;
    if (filters.category) c++;
    if (filters.level) c++;
    if (filters.duration) c++;
    return c;
  }, [filters]);

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
        <CourseGrid filters={filters} />
      </div>
    </div>
  );
}


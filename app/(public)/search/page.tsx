"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Search, Clock, Star, Users } from "lucide-react";
import { CourseCardSkeleton } from "@/components/ui/CourseCardSkeleton";
import Link from "next/link";

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const rawQuery = searchParams.get("q") ?? "";
    const rawPage = searchParams.get("page");

    const page = useMemo(() => {
        const n = rawPage ? Number(rawPage) : 1;
        return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    }, [rawPage]);

    // Debounce URL-driven search to avoid hammering the API while typing.
    const [debouncedQuery, setDebouncedQuery] = useState(rawQuery);
    const previousQueryRef = useRef(rawQuery);

    useEffect(() => {
        const t = window.setTimeout(() => setDebouncedQuery(rawQuery.trim()), 300);
        return () => window.clearTimeout(t);
    }, [rawQuery]);

    useEffect(() => {
        // If user types a new query, reset pagination to page 1.
        if (previousQueryRef.current !== rawQuery && page !== 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", "1");
            router.push(`/search?${params.toString()}`);
        }
        previousQueryRef.current = rawQuery;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawQuery, page, router, searchParams]);

    const canSearch = debouncedQuery.length >= 2;

    const { data: results, isLoading } = useQuery({
        queryKey: ["search", debouncedQuery, page],
        queryFn: () =>
            get<any>(
                `/courses?search=${encodeURIComponent(debouncedQuery)}&page=${page}`
            ),
        enabled: canSearch,
        staleTime: 5000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    const courses = results?.data || [];
    const meta = results?.meta;

    return (
        <div className="max-w-7xl mx-auto min-h-screen px-4 pb-28 pt-8 md:px-6 md:pb-16 md:pt-16 lg:px-12">
            <motion.div {...getFadeUp(0, 0.4)} className="mb-8 md:mb-12">
                <div className="mb-2 flex items-center gap-3 text-text/50">
                    <Search className="h-5 w-5 shrink-0" aria-hidden />
                    <span className="text-sm font-medium">نتائج البحث عن:</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight break-words md:text-4xl">&quot;{rawQuery}&quot;</h1>
            </motion.div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy aria-label="جاري البحث">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <CourseCardSkeleton key={i} delay={i * 0.04} />
                    ))}
                </div>
            ) : !canSearch ? (
                <div className="col-span-full rounded-[4px] border border-border/80 bg-white py-16 text-center md:py-20">
                    <h3 className="mb-2 text-lg font-bold">اكتب كلمة بحث أكثر</h3>
                    <p className="text-sm text-text/60">لتحسين النتائج، نحتاج على الأقل حرفين.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {courses.map((course: any, idx: number) => (
                        <motion.div
                            key={course.id}
                            {...getFadeUp(idx * 0.05, 0.4)}
                        >
                            <Link href={`/courses/${course.slug}`} className="group flex h-full min-h-[44px] cursor-pointer flex-col rounded-[4px] border border-border/80 bg-white p-5 transition-all hover:border-primary hover:shadow-sm active:scale-[0.99] md:p-6 touch-manipulation">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-xs font-mono font-bold px-2 py-1 bg-background border rounded">
                                        {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                                    </span>
                                    <span className="text-xs font-mono text-text/50 uppercase tracking-widest text-primary/60">
                                        {course.category || "دورة"}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-text/60 mb-6 flex-grow line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="pt-4 border-t grid grid-cols-3 gap-2 text-xs text-text/60">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-primary/60" />
                                        <span>{course.duration || "4h"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 justify-center">
                                        <Star className="w-3.5 h-3.5 text-yellow-500/60" />
                                        <span>{course.average_rating || "4.5"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <Users className="w-3.5 h-3.5 text-accent/60" />
                                        <span>{course.students_count || "0"}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                    {courses.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-border/80 rounded-[4px] bg-white">
                            <h3 className="text-lg font-bold mb-2">لا توجد نتائج</h3>
                            <p className="text-sm text-text/60">جرب كلمات بحث مختلفة أو تصفح كافة التصنيفات.</p>
                        </div>
                    )}
                </div>
            )}

            {canSearch && meta?.last_page > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:gap-4">
                    <button
                        type="button"
                        disabled={(meta?.current_page ?? 1) <= 1}
                        onClick={() => {
                            const next = (meta?.current_page ?? 1) - 1;
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("page", String(next));
                            router.push(`/search?${params.toString()}`);
                        }}
                        className="min-h-11 min-w-[5rem] rounded-[4px] border border-border/80 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-black/[0.03] disabled:opacity-50 touch-manipulation active:scale-[0.98]"
                    >
                        السابق
                    </button>

                    <div className="text-sm text-text/60">
                        الصفحة {(meta?.current_page ?? 1)} من {meta?.last_page}
                    </div>

                    <button
                        type="button"
                        disabled={(meta?.current_page ?? 1) >= meta?.last_page}
                        onClick={() => {
                            const next = (meta?.current_page ?? 1) + 1;
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("page", String(next));
                            router.push(`/search?${params.toString()}`);
                        }}
                        className="min-h-11 min-w-[5rem] rounded-[4px] border border-border/80 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-black/[0.03] disabled:opacity-50 touch-manipulation active:scale-[0.98]"
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    );
}

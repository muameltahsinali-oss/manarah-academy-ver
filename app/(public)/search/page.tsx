"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Search, Loader2, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    const { data: results, isLoading } = useQuery({
        queryKey: ["search", query],
        queryFn: () => get<any>(`/courses?search=${query}`),
        enabled: !!query,
    });

    const courses = results?.data || [];

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 min-h-screen">
            <motion.div {...getFadeUp(0, 0.4)} className="mb-12">
                <div className="flex items-center gap-4 mb-2 text-text/50">
                    <Search className="w-5 h-5" />
                    <span className="text-sm font-medium">نتائج البحث عن:</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">"{query}"</h1>
            </motion.div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-mono text-text/60">جاري البحث عن أفضل الدورات...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course: any, idx: number) => (
                        <motion.div
                            key={course.id}
                            {...getFadeUp(idx * 0.05, 0.4)}
                        >
                            <Link href={`/courses/${course.slug}`} className="block h-full border border-border/80 rounded-[4px] p-6 bg-white transition-all hover:border-primary hover:shadow-sm cursor-pointer group flex flex-col">
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
        </div>
    );
}

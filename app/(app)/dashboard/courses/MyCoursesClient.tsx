"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { useState } from "react";
import { ArrowLeft, Clock, MonitorPlay, CheckCircle2, Search, Filter } from "lucide-react";
import Link from "next/link";

export interface Course {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string | null;
    instructor: string;
    duration: string;
    status: "in-progress" | "completed" | "not-started";
    progress?: number;
}
import { useStudentCourses } from "@/lib/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export function MyCoursesClient() {
    const { data: res, isLoading } = useStudentCourses();
    const courses: Course[] = res?.data || [];
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "in-progress" | "completed" | "not-started">("all");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "all" || course.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const inProgress = filteredCourses.filter(c => c.status === "in-progress");
    const completed = filteredCourses.filter(c => c.status === "completed");
    const notStarted = filteredCourses.filter(c => c.status === "not-started");

    const hasResults = filteredCourses.length > 0;

    return (
        <div className="flex flex-col gap-6 md:gap-12 w-full max-w-6xl mx-auto py-4 md:py-8 min-w-0">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2">دوراتي التعلمية</h1>
                <p className="text-xs md:text-sm text-text/60">تابع تقدمك واستأنف دراستك من حيث توقفت.</p>
            </motion.div>

            {/* Filters and Search */}
            <motion.div {...getFadeUp(0.1, 0.4)} className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
                <div className="flex items-center gap-2 p-1 bg-black/5 rounded-[4px] w-full md:w-auto overflow-x-auto no-scrollbar touch-pan-x">
                    {[
                        { id: "all", label: "الكل" },
                        { id: "in-progress", label: "قيد الدراسة" },
                        { id: "not-started", label: "لم تبدأ" },
                        { id: "completed", label: "مكتملة" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id as any)}
                            className={`px-4 md:px-6 py-2.5 md:py-1.5 text-xs font-bold rounded-[4px] transition-all whitespace-nowrap touch-manipulation min-h-[2.75rem] md:min-h-0 ${activeFilter === tab.id
                                ? "bg-white text-primary shadow-sm"
                                : "text-text/60 hover:text-text"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="ابحث في دوراتك..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full min-h-[2.75rem] h-11 pr-10 pl-4 bg-white border border-border/80 rounded-[4px] text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </motion.div>

            {!hasResults ? (
                <motion.div
                    {...getFadeUp(0.2, 0.5)}
                    className="flex flex-col items-center justify-center py-24 text-center border border-border/80 bg-white rounded-[4px]"
                >
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-text/20" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">لا توجد نتائج</h3>
                    <p className="text-sm text-text/60 max-w-md">
                        {searchQuery ? `لم نجد أي دورة تطابق "${searchQuery}"` : "لا توجد دورات في هذا القسم حالياً."}
                    </p>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-8 md:gap-12">
                    {/* In Progress Section */}
                    {inProgress.length > 0 && (
                        <section>
                            <motion.h2 {...getFadeUp(0.1, 0.4)} className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                قيد الدراسة
                            </motion.h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                {inProgress.map((course, idx) => (
                                    <motion.div key={course.id} {...getFadeUp(0.2 + idx * 0.1, 0.5)}>
                                        <CourseCard course={course} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Not Started Section */}
                    {notStarted.length > 0 && (
                        <section>
                            <motion.h2 {...getFadeUp(0.4, 0.4)} className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-border" />
                                لم تبدأ بعد
                            </motion.h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                {notStarted.map((course, idx) => (
                                    <motion.div key={course.id} {...getFadeUp(0.5 + idx * 0.1, 0.5)}>
                                        <CourseCard course={course} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Completed Section */}
                    {completed.length > 0 && (
                        <section>
                            <motion.h2 {...getFadeUp(0.6, 0.4)} className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                مكتملة
                            </motion.h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                {completed.map((course, idx) => (
                                    <motion.div key={course.id} {...getFadeUp(0.7 + idx * 0.1, 0.5)}>
                                        <CourseCard course={course} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function CourseCard({ course }: { course: Course }) {
    const isCompleted = course.status === "completed";
    const progress = typeof course.progress === "number" ? course.progress : 0;

    return (
        <div className="group flex flex-col justify-between h-full bg-white border border-border/80 rounded-[4px] overflow-hidden transition-all hover:border-primary active:scale-[0.99] touch-manipulation">
            {course.thumbnail_url ? (
                <div className="relative w-full aspect-video bg-border/20 overflow-hidden shrink-0">
                    <img
                        src={course.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-1 bg-black/60 text-white rounded uppercase tracking-widest">
                            {course.slug.toUpperCase().split('-')[0] || "CRS"}
                        </span>
                    </div>
                    {isCompleted && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs font-bold text-white bg-accent/90 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            مكتمل
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex justify-between items-center px-6 pt-6">
                    <span className="text-[10px] font-mono font-bold px-2 py-1 bg-background border border-border/80 rounded-[4px] uppercase tracking-widest text-text/60">
                        {course.slug.toUpperCase().split('-')[0] || "CRS"}
                    </span>
                    {isCompleted && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <CheckCircle2 className="w-4 h-4" />
                            مكتمل
                        </div>
                    )}
                </div>
            )}
            <div className="p-4 md:p-6 flex flex-col flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs font-medium text-text/60 mb-3 md:mb-4">
                    <span className="flex items-center gap-1.5">
                        <MonitorPlay className="w-4 h-4 text-text/40" />
                        {course.instructor}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-text/40" />
                        {course.duration}
                    </span>
                </div>
                <div className="mb-4 md:mb-6">
                    <div className="flex justify-between items-center mb-1.5 md:mb-2">
                        <span className="text-xs font-bold text-text/60">التقدم</span>
                        <span className="text-xs font-mono font-bold text-primary">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <Link
                    href={`/learn/${course.slug}`}
                    className={`mt-auto flex items-center justify-between w-full min-h-[2.75rem] p-3 md:p-4 rounded-[4px] text-sm font-bold transition-colors touch-manipulation active:scale-[0.98] ${isCompleted
                        ? "bg-black/5 text-text hover:bg-black/10"
                        : "bg-primary/5 text-primary hover:bg-primary/10"
                        }`}
                >
                    {isCompleted ? "مراجعة الدورة" : course.status === "not-started" ? "ابدأ التعلم" : "استئناف التعلم"}
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Link>
            </div>
        </div>
    );
}

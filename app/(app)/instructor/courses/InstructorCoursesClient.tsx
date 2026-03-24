"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Users, Star, DollarSign, Edit3, BarChart2, PlusCircle, Eye } from "lucide-react";
import Link from "next/link";

export interface InstructorCourse {
    id: number;
    title: string;
    slug: string;
    students: number;
    rating: number;
    revenue: number;
    status: "published" | "draft";
}
import { useInstructorCourses, useUpdateCourse, useDeleteCourse } from "@/lib/hooks/useInstructor";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function InstructorCoursesClient() {
    const { data: res, isLoading } = useInstructorCourses();
    const initialData: InstructorCourse[] = res?.data || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const published = initialData.filter(c => c.status === "published");
    const drafts = initialData.filter(c => c.status === "draft");

    return (
        <div className="flex flex-col gap-12 w-full mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)} className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">الدورات التعليمية</h1>
                    <p className="text-sm text-text/60">إدارة محتواك التعليمي ومراقبة أداء الدورات النشطة.</p>
                </div>
                <Link
                    href="/instructor/create"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-colors shadow-none"
                >
                    <PlusCircle className="w-4 h-4" />
                    دورة جديدة
                </Link>
            </motion.div>

            {initialData.length === 0 ? (
                <div className="py-20 text-center bg-white border border-dashed border-border/80 rounded-[4px]">
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                        <PlusCircle className="w-12 h-12 text-text/20 mb-4" />
                        <h2 className="text-xl font-bold mb-2">لا توجد دورات بعد</h2>
                        <p className="text-sm text-text/50 mb-8">ابدأ بمشاركة خبراتك وقم بإنشاء دورتك الأولى اليوم.</p>
                        <Link
                            href="/instructor/create"
                            className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-colors"
                        >
                            إنشاء دورتي الأولى
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Published Courses */}
                    {published.length > 0 && (
                        <section>
                            <motion.h2 {...getFadeUp(0.1, 0.4)} className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                منشورة ({published.length})
                            </motion.h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {published.map((course, idx) => (
                                    <motion.div key={course.id} {...getFadeUp(0.2 + idx * 0.1, 0.5)}>
                                        <CourseManagerCard course={course} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Draft Courses */}
                    {drafts.length > 0 && (
                        <section>
                            <motion.h2 {...getFadeUp(0.3, 0.4)} className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                مسودات قيد العمل ({drafts.length})
                            </motion.h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {drafts.map((course, idx) => (
                                    <motion.div key={course.id} {...getFadeUp(0.4 + idx * 0.1, 0.5)}>
                                        <CourseManagerCard course={course} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}

function CourseManagerCard({ course }: { course: InstructorCourse }) {
    const isPublished = course.status === "published";
    const updateCourse = useUpdateCourse();
    const deleteCourse = useDeleteCourse();

    const toggleStatus = () => {
        const newStatus = isPublished ? "draft" : "published";
        updateCourse.mutate({
            id: course.id,
            data: { status: newStatus }
        }, {
            onSuccess: () => toast.success(`تم ${newStatus === 'published' ? 'نشر' : 'إلغاء نشر'} الدورة بنجاح`)
        });
    };

    const handleDelete = () => {
        if (confirm("هل أنت متأكد من حذف هذه الدورة نهائياً؟")) {
            deleteCourse.mutate(course.id, {
                onSuccess: () => toast.success("تم حذف الدورة بنجاح")
            });
        }
    };

    return (
        <div className="group flex flex-col justify-between h-full bg-white border border-border/80 rounded-[4px] p-6 transition-all hover:border-primary">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono font-bold px-2 py-1 bg-background border border-border/80 rounded-[4px] uppercase tracking-widest text-text/60">
                        ID: {course.id}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleStatus}
                            disabled={updateCourse.isPending}
                            className={`text-[10px] font-mono font-bold px-2 py-1 border rounded-[4px] tracking-widest transition-colors ${isPublished
                                ? "bg-green-50 border-green-200 text-green-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"
                                : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                                }`}
                            title={isPublished ? "إلغاء النشر" : "نشر الدورة"}
                        >
                            {updateCourse.isPending ? "..." : isPublished ? "نشط" : "مسودة"}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteCourse.isPending}
                            className="p-1.5 text-text/20 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-6">
                    {course.title}
                </h3>

                <div className="flex items-center gap-6 text-sm font-medium text-text mt-4">
                    <div className="flex items-center gap-1.5 font-mono">
                        <Users className="w-4 h-4 text-text/40" />
                        {course.students || 0}
                    </div>
                    {isPublished && (
                        <>
                            <div className="flex items-center gap-1.5 font-mono">
                                <Star className="w-4 h-4 text-text/40" />
                                {(course.rating || 0).toFixed(1)}
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-primary font-bold">
                                <DollarSign className="w-4 h-4 text-primary/40" />
                                {(course.revenue || 0).toLocaleString()}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/40 flex gap-4">
                <Link
                    href={`/instructor/create?edit=${course.id}`}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-background border border-border rounded-[4px] text-sm font-bold transition-colors hover:bg-black/5 hover:border-text/30 text-text"
                >
                    <Edit3 className="w-4 h-4" />
                    تعديل المحتوى
                </Link>
                {isPublished && (
                    <Link
                        href={`/courses/${course.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border text-xs font-bold rounded-[4px] hover:bg-black/5 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        معاينة
                    </Link>
                )}
                {isPublished && (
                    <Link
                        href={`/instructor/analytics?course=${course.id}`}
                        className="flex-1 flex items-center justify-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-[4px] text-sm font-bold transition-colors hover:bg-primary/10 text-primary"
                    >
                        <BarChart2 className="w-4 h-4" />
                        تحليل الأداء
                    </Link>
                )}
            </div>
        </div>
    );
}

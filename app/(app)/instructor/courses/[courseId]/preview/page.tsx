"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { Shield, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { CourseHero } from "@/components/course/CourseHero";

export default function DraftPreviewPage() {
    const { courseId } = useParams();
    const router = useRouter();

    const { data: courseRes, isLoading } = useQuery({
        queryKey: ["instructor-draft", courseId],
        queryFn: () => get<any>(`/instructor/courses/${courseId}`),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    const course = courseRes?.data;

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="w-full bg-secondary text-white py-3 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3 text-sm font-bold">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>وضع المعاينة (مسودة)</span>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-bold hover:text-accent transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    العودة للمحرر
                </button>
            </div>

            {course ? (
                <CourseHero
                    courseId={course.id}
                    slug={course.slug || ""}
                    title={course.title}
                    description={course.description}
                    shortDescription={course.short_description}
                    promoVideoUrl={course.promo_video_url}
                    instructor={course.instructor?.name || "مدرّبك"}
                    rating="0.0"
                    students="0"
                    duration={course.duration || "غير محدد"}
                    isEnrolled={false}
                    progress={0}
                    price={course.price}
                    thumbnail={course.thumbnail}
                />
            ) : (
                <div className="py-20 text-center">خطأ في تحميل بيانات المعاينة</div>
            )}

            <div className="max-w-4xl mx-auto px-6 py-12 text-center text-text/40 border-t border-border/80 mt-12">
                هذه الصفحة للمعاينة فقط ولا تظهر للطلاب حالياً.
            </div>
        </div>
    );
}

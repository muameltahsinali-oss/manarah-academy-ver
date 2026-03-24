"use client";

import { CourseHero } from "@/components/course/CourseHero";
import { CourseCurriculum } from "@/components/course/CourseCurriculum";
import { CourseOutcomes } from "@/components/course/CourseOutcomes";
import { CourseInstructor } from "@/components/course/CourseInstructor";
import { CourseReviews } from "@/components/course/CourseReviews";
import { useParams } from "next/navigation";
import { useCourseData } from "@/lib/hooks/useCoursePlayer";
import { Loader2 } from "lucide-react";

export default function SingleCoursePage() {
    const { slug } = useParams();
    const { data: courseRes, isLoading } = useCourseData(slug as string);
    const course = courseRes?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">الدورة غير موجودة</h1>
                <p className="text-text/60">عذراً، لم نتمكن من العثور على الدورة التي تبحث عنها.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <CourseHero
                courseId={course.id}
                slug={course.slug}
                title={course.title}
                description={course.description}
                instructor={course.instructor?.name || "مدرّب مجهول"}
                rating={course.rating?.toString() || "0"}
                students={`${course.students || 0}`}
                duration={course.duration || "غير محدد"}
                isEnrolled={course.is_enrolled}
                progress={course.enrollment_progress || 0}
                price={course.price}
                thumbnail={course.thumbnail}
                totalModules={course.modules?.length || 0}
                totalLessons={course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0}
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 md:mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
                    {/* Main Content Area - spans 8 columns */}
                    <div className="lg:col-span-8 flex flex-col gap-16">
                        <CourseOutcomes outcomes={course.outcomes || []} />

                        {/* Wrapper to handle the layout properly */}
                        <div>
                        <CourseCurriculum
                            courseId={course.id}
                            courseSlug={course.slug}
                            modules={course.modules}
                            isEnrolled={course.is_enrolled}
                            courseDuration={course.duration}
                            studentsCount={course.students}
                        />
                        </div>

                        <CourseInstructor
                            name={course.instructor?.name || "مدرّب مجهول"}
                            role={course.instructor?.role || "مدرّب معتمد"}
                            bio={course.instructor?.bio || "لا يوجد وصف حالياً."}
                            courses={`${course.instructor?.courses_count || 1}`}
                            students={`${course.instructor?.students_count || 0}`}
                            rating={(course.instructor?.rating?.toString?.() || course.instructor?.rating || "0")}
                            avatar={course.instructor?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"}
                        />

                        <CourseReviews />
                    </div>

                    {/* Right Sidebar Area */}
                    <div className="lg:col-span-4 hidden lg:block">
                        <div className="sticky top-24 p-6 border border-border/80 bg-white rounded-[4px]">
                            <h3 className="text-lg font-bold mb-4">متطلبات الدورة</h3>
                            <ul className="text-sm text-text/70 space-y-3 font-medium">
                                {course.requirements ? (
                                    course.requirements.map((req: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full">
                                            {req}
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full">
                                        لا توجد متطلبات مسبقة محددة.
                                    </li>
                                )}
                            </ul>

                            <hr className="my-6 border-t border-border/60" />

                            <h3 className="text-lg font-bold mb-4">يشمل الاشتراك</h3>
                            <ul className="text-sm text-text/70 space-y-3 font-medium">
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:border-2 before:border-text/40">
                                    تحديثات مجانية للمحتوى لمدة عام
                                </li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:border-2 before:border-text/40">
                                    الوصول لمجتمع الطلاب الخاص
                                </li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:border-2 before:border-text/40">
                                    شهادة إتمام معتمدة
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

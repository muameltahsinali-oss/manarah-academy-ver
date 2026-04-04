"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/lib/hooks/useAuth";
import { useStudentCourses } from "@/lib/hooks/useDashboard";
import { CourseCard } from "@/components/ui/CourseCard";
import { ArrowLeft, Loader2, PlayCircle } from "lucide-react";

export function HomeContinueLearning() {
    const { isAuthenticated } = useAuth();
    const { data: res, isLoading } = useStudentCourses(!!isAuthenticated);
    const courses = res?.data || [];

    if (!isAuthenticated) return null;

    const inProgress = courses.filter(
        (c: { status?: string; progress?: number }) => c.status !== "completed" && (c.progress ?? 0) < 100
    );
    const displayCourses = (inProgress.length > 0 ? inProgress : courses).slice(0, 3);

    if (displayCourses.length === 0 && !isLoading) return null;

    return (
        <Section spacing="xl" className="bg-background border-b border-border">
            <Container>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text mb-1">
                            استمر في التعلّم
                        </h2>
                        <p className="text-sm text-text/60">
                            دوراتك النشطة — استأنف من حيث توقفت.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/courses"
                        className="text-sm font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                        كل الدورات
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-white border border-border/80 rounded-[4px] animate-pulse flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayCourses.map((course: any) => (
                            <div key={course.id}>
                                <CourseCard
                                    id={course.id}
                                    slug={course.slug}
                                    prefix={course.slug?.toUpperCase().split("-")[0] || "CRS"}
                                    title={course.title}
                                    description={course.description}
                                    instructor={course.instructor?.name || "مدرّب"}
                                    duration={course.duration || "—"}
                                    rating={course.rating?.toString() || "—"}
                                    students={course.students?.toString() || "0"}
                                    level={course.level || "—"}
                                    tag={course.category || "عام"}
                                    thumbnail={course.thumbnail}
                                />
                                <Link
                                    href={`/learn/${course.slug}`}
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80"
                                >
                                    <PlayCircle className="w-4 h-4" />
                                    استئناف الدورة
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </Section>
    );
}

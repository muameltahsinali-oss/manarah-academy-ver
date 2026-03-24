"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useCourses } from "@/lib/hooks/useCoursePlayer";
import { Loader2 } from "lucide-react";

export function PlatformStatsSection() {
    const { data: res, isLoading } = useCourses();
    const courses = res?.data || [];

    const coursesCount = courses.length;
    const totalStudents = courses.reduce((sum: number, course: any) => {
        const value = typeof course.students === "number"
            ? course.students
            : parseInt(course.students || "0", 10);
        return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);

    const instructorsCount = new Set(
        courses
            .map((course: any) => course.instructor?.name)
            .filter(Boolean)
    ).size;

    const stats = [
        {
            label: "الدورات النشطة",
            value: coursesCount,
        },
        {
            label: "إجمالي المتعلمين",
            value: totalStudents,
        },
        {
            label: "المدرّسون",
            value: instructorsCount,
        },
    ];

    return (
        <Section spacing="lg" className="bg-white border-b border-border">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-3">
                            أرقام من المنصة
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
                            نظام مبني على بيانات حقيقية.
                        </h2>
                    </div>
                    <p className="text-sm md:text-base text-text/70 max-w-md">
                        كل رقم هنا مستخرج مباشرة من دورات المنصة وبيانات المتعلمين والمدرّسين.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center h-28 rounded-[4px] border border-border/80 bg-background/40 animate-pulse"
                            >
                                <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
                                className="relative overflow-hidden rounded-[4px] border border-border bg-background/40 hover:bg-white hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-6 flex flex-col gap-3"
                            >
                                <span className="text-xs font-mono uppercase tracking-[0.18em] text-text/60">
                                    {stat.label}
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-4xl font-bold text-text">
                                        {stat.value.toLocaleString("ar-EG")}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Container>
        </Section>
    );
}


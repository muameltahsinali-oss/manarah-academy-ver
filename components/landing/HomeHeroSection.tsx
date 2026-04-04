"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useAuth } from "@/lib/hooks/useAuth";
import { useStudentDashboard } from "@/lib/hooks/useDashboard";
import { ArrowLeft, BookOpen, Loader2, PlayCircle } from "lucide-react";

export function HomeHeroSection() {
    const { user, isAuthenticated, isSessionPending: isAuthLoading } = useAuth();
    const { data: dashboardRes } = useStudentDashboard(!!isAuthenticated);
    const lastCourseSlug = dashboardRes?.data?.last_course_slug;

    return (
        <Section spacing="lg" className="bg-gradient-to-b from-background to-white border-b border-border overflow-hidden relative">
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />
            <Container className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    {isAuthLoading ? (
                        <div className="flex items-center gap-3 text-text/60">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">جاري التحميل...</span>
                        </div>
                    ) : isAuthenticated && user ? (
                        <>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text mb-4">
                                أهلاً بك، {user.name.split(" ")[0]}
                            </h1>
                            <p className="text-base md:text-lg text-text/70 mb-8 max-w-xl">
                                استمر من حيث توقفت أو اكتشف دورات ومسارات تعلم جديدة.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {lastCourseSlug ? (
                                    <Link
                                        href={`/learn/${lastCourseSlug}`}
                                        className="group inline-flex items-center gap-2 h-12 px-6 bg-primary text-white font-bold rounded-[4px] hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
                                    >
                                        استئناف التعلم
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="group inline-flex items-center gap-2 h-12 px-6 bg-primary text-white font-bold rounded-[4px] hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
                                    >
                                        <PlayCircle className="w-4 h-4" />
                                        لوحة التحكم
                                    </Link>
                                )}
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center gap-2 h-12 px-6 bg-white text-text font-bold rounded-[4px] border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    تصفح الدورات
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text mb-4">
                                تعلّم بمنهجية.<br />
                                <span className="text-primary">وتقدّم بدقّة.</span>
                            </h1>
                            <p className="text-base md:text-lg text-text/70 mb-8 max-w-xl">
                                منهج دراسي مصمم هندسياً — دورات، مسارات تعلم، وشهادات في مكان واحد.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-white font-bold rounded-[4px] hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
                                >
                                    ابدأ التعلم الآن
                                </Link>
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-text font-bold rounded-[4px] border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                                >
                                    تصفح الدورات
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>
            </Container>
        </Section>
    );
}

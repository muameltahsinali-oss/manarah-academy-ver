"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Roadmap, RoadmapModule } from "@/components/ui/Roadmap";
import { Star, PlayCircle, BarChart3 } from "lucide-react";

const heroRoadmapItems: RoadmapModule[] = [
    { id: 1, title: "الأساسيات البرمجية", status: "completed" },
    { id: 2, title: "هيكلية الحالة (State)", status: "completed" },
    { id: 3, title: "الأنماط المتقدمة", status: "active" },
    { id: 4, title: "مرونة النظام", status: "pending" },
    { id: 5, title: "النشر والإنتاج", status: "pending" }
];

export function HeroSection() {
    return (
        <Section spacing="xl" className="bg-gradient-to-b from-background to-white overflow-hidden relative">
            {/* subtle grid background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />
            <Container grid className="relative z-10">

                {/* Left Content (Cols 1-6) */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="col-span-1 md:col-span-6 flex flex-col justify-center max-w-2xl mt-8 md:mt-0"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text mb-6">
                        تعلّم بمنهجية.<br />
                        <span className="relative inline-block mt-2">
                            وتقدّم بدقّة.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-text/70 mb-10 max-w-lg leading-relaxed">
                        توقف عن التخمين. منهج دراسي مصمم هندسياً لأقصى درجات الاحتفاظ بالمعلومات والتطبيق العملي الفوري.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/register"
                            className="group flex items-center justify-center gap-2 h-14 px-8 bg-primary text-white font-medium rounded-[4px] hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            ابدأ التعلم الآن
                            <span className="sr-only">التسجيل</span>
                        </Link>
                        <Link
                            href="/courses"
                            className="flex items-center justify-center h-14 px-8 bg-transparent text-text font-medium rounded-[4px] border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                        >
                            تصفح الدورات
                        </Link>
                    </div>
                </motion.div>

                {/* Right Demo Visual (Cols 7-12) */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="col-span-1 md:col-span-6 md:pr-8 lg:pr-16 relative mt-16 md:mt-0"
                >
                    {/* Glow gradients */}
                    <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -right-10 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />

                    {/* Main product mockup card */}
                    <div className="bg-white border border-border rounded-[4px] p-6 md:p-8 relative  w-full shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">

                        <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
                            <div>
                                <div className="font-mono text-xs text-text/50 uppercase tracking-widest mb-1">المنهج النشط</div>
                                <h3 className="font-bold text-lg text-text">هندسة الواجهات الأمامية</h3>
                            </div>
                            <div className="text-left">
                                <div className="font-mono text-xs text-text/50 uppercase tracking-widest mb-1">التقدم الإجمالي</div>
                                <div className="font-mono text-3xl font-bold text-primary">72%</div>
                            </div>
                        </div>

                        {/* Roadmap preview */}
                        <Roadmap modules={heroRoadmapItems} />
                    </div>

                    {/* Floating dashboard metric card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden md:flex items-center gap-3 px-4 py-3 rounded-[4px] bg-background/90 border border-border/80 shadow-lg shadow-primary/5 absolute -bottom-6 left-6"
                    >
                        <div className="w-8 h-8 rounded-[4px] bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-mono text-text/50 uppercase tracking-[0.18em]">لوحة التحكم</span>
                            <span className="text-sm font-bold text-text">متوسط تقدّم الطلاب 82%</span>
                        </div>
                    </motion.div>

                    {/* Floating course card preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden lg:flex flex-col gap-2 px-4 py-3 rounded-[4px] bg-white/90 border border-border/80 shadow-lg shadow-primary/5 absolute -top-6 right-0"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <PlayCircle className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-text">جلسة مباشرة تبدأ خلال 10 دقائق</span>
                            </div>
                            <span className="text-[11px] font-mono text-text/50">اليوم</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-text/60">
                            <span>مراجعة مشروع النظام</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-accent" />
                                <span className="font-mono">4.9</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </Container>
        </Section>
    );
}

"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { KPI } from "@/components/ui/KPI";

export function AnalyticsPreviewSection() {
    return (
        <Section spacing="lg" className="bg-background border-b border-border relative overflow-hidden">
            {/* Thin grid lines background */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <Container grid className="relative z-10 items-center">

                <div className="col-span-1 md:col-span-5 mb-16 md:mb-0">
                    <h2 className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-6">المقاييس والبيانات</h2>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-6">
                        قس كل خطوة.
                    </h3>
                    <p className="text-lg text-text/70 leading-relaxed mb-10 max-w-md">
                        توقف عن تخمين مدى كفاءتك. يتتبع نظامنا سرعة الاستيعاب، والتطبيق العملي، والاحتفاظ بالمهارات على المدى الطويل.
                    </p>

                    <div className="border border-border bg-white rounded-[4px] p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                            <span className="font-bold text-sm">مصفوفة سرعة التعلم</span>
                            <span className="text-[10px] font-mono px-2 py-1 bg-background border border-border rounded-[4px] text-text/70 uppercase tracking-widest">مباشر</span>
                        </div>

                        <div className="w-full relative h-[180px]">
                            {/* Minimal Line Chart SVG */}
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                {/* Horizontal Grid */}
                                <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-border/60" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-border/60" />
                                <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-border/60" />

                                {/* Vertical Grid */}
                                <line x1="25" y1="0" x2="25" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-border/60" />
                                <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-border/60" />
                                <line x1="75" y1="0" x2="75" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-border/60" />

                                {/* Animated Data Line */}
                                <motion.path
                                    d="M0 85 Q 25 75, 50 45 T 75 35 T 100 15"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-primary"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />

                                {/* Data Points */}
                                <motion.circle cx="50" cy="45" r="2.5" className="fill-white stroke-primary stroke-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} />
                                <motion.circle cx="75" cy="35" r="2.5" className="fill-white stroke-primary stroke-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.1 }} />
                                <motion.circle cx="100" cy="15" r="3" className="fill-primary" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }} />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-6 md:col-start-7">
                    <div className="flex flex-col gap-6">
                        <KPI label="ساعات التعلم هذا الأسبوع" value={24} duration={1.5} />
                        <KPI label="معدل الإنجاز" value={82} suffix="%" duration={2} />
                        <KPI label="معدل نمو المهارات" prefix="+" value={14} suffix="%" duration={1.5} className="border-primary/30" />
                    </div>
                </div>

            </Container>
        </Section>
    );
}

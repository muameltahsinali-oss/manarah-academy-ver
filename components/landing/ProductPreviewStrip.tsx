"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { MonitorPlay, LayoutDashboard, LineChart, PenTool } from "lucide-react";

const items = [
    {
        icon: MonitorPlay,
        label: "مشغل الدروس",
        title: "تجربة تعلم مركّزة",
        description: "مشغل فيديو مصمم للتركيز، مع تبويب للملاحظات والمصادر وتتبع تلقائي للتقدم.",
    },
    {
        icon: LayoutDashboard,
        label: "لوحة الطالب",
        title: "لوحة تحكم حيّة",
        description: "إحصائيات أسبوعية، مسارات تعلم، وتوصيات ذكية مبنية على تقدّمك.",
    },
    {
        icon: PenTool,
        label: "منشئ الدورات",
        title: "أداة بناء للمدرّبين",
        description: "أنشئ وحدات ودروساً وموارد من واجهة واحدة سريعة ومرتّبة.",
    },
    {
        icon: LineChart,
        label: "تحليلات",
        title: "مقاييس قابلة للتنفيذ",
        description: "تابع معدّل الإكمال، التفاعل، والإنجاز عبر لوحات بيانات جاهزة.",
    },
];

export function ProductPreviewStrip() {
    return (
        <Section spacing="lg" className="bg-background border-b border-border">
            <Container className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.18em] mb-2">
                            معاينة المنتج
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
                            منصة واحدة لكل لحظة في رحلة التعلّم.
                        </h2>
                    </div>
                    <p className="text-sm md:text-base text-text/70 max-w-md">
                        من الصفحة الأولى حتى آخر شهادة، كل شاشة في منارة اكاديمي مصممة لتدعم التقدّم الفعلي، لا مجرد استهلاك المحتوى.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {items.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
                            className="relative overflow-hidden rounded-[4px] border border-border bg-white shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-primary via-accent to-primary opacity-70" />
                            <div className="p-4 border-b border-border/60 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-[4px] bg-primary/10 flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-xxs font-mono text-text/60 uppercase tracking-[0.16em]">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <h3 className="text-sm font-bold text-text">{item.title}</h3>
                                <p className="text-xs text-text/70 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}


"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Roadmap, RoadmapModule } from "@/components/ui/Roadmap";
import { ArrowLeftRight } from "lucide-react";

const fullCurriculumItems: RoadmapModule[] = [
    {
        id: "mod-1",
        title: "الوحدة 01: الأساسيات الجوهرية",
        description: "أتقن اللبنات الأساسية. بدون افتراضات، مهارات بناء خالصة.",
        status: "completed",
        duration: "4h 30m",
        tag: "الأساسيات"
    },
    {
        id: "mod-2",
        title: "الوحدة 02: التفاعلية المتقدمة",
        description: "افهم إدارة الحالة (State) على نطاق واسع. تحسين الأداء وسرعة التطبيق.",
        status: "active",
        duration: "5h 15m",
        tag: "أنظمة الواجهات"
    },
    {
        id: "mod-3",
        title: "الوحدة 03: الأنظمة الموزعة",
        description: "توسيع نطاق تطبيقك عبر خوادم متعددة. موازنة الحمل والتخزين المؤقت.",
        status: "pending",
        duration: "6h 00m",
        tag: "المعمارية"
    },
    {
        id: "mod-4",
        title: "الوحدة 04: النشر والإنتاج",
        description: "خطوط النشر المستمر (CI/CD)، والتشغيل في الحاويات، والمراقبة.",
        status: "pending",
        duration: "3h 45m",
        tag: "عمليات التطوير"
    }
];

export function CurriculumSection() {
    return (
        <Section spacing="xl" id="curriculum" className="bg-background border-b border-border">
            <Container grid>

                <div className="col-span-1 md:col-span-4 lg:col-span-5 mb-16 md:mb-0">
                    <div className="md:sticky md:top-32">
                        <h2 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4">النظام</h2>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-6">
                            مسار تعلّم هندسي مهيكل.
                        </h3>
                        <p className="text-lg text-text/70 mb-12 max-w-sm">
                            تسلسل معرفي مصمم هندسياً بعناية. كل وحدة تعتمد على المفاهيم الدقيقة التي تم إتقانها في الوحدة السابقة، من الأساسيات وحتى نشر الأنظمة في الإنتاج.
                        </p>

                        <div className="flex gap-6 border border-border bg-white rounded-[4px] p-6 inline-flex mb-4">
                            <div className="flex flex-col text-center">
                                <span className="text-3xl font-mono font-bold text-text mb-1">12</span>
                                <span className="text-[10px] font-mono text-text/50 uppercase tracking-widest">وحدات</span>
                            </div>
                            <div className="w-px bg-border"></div>
                            <div className="flex flex-col text-center">
                                <span className="text-3xl font-mono font-bold text-text mb-1">48</span>
                                <span className="text-[10px] font-mono text-text/50 uppercase tracking-widest">تدريب</span>
                            </div>
                            <div className="w-px bg-border"></div>
                            <div className="flex flex-col text-center">
                                <span className="text-3xl font-mono font-bold text-text mb-1">04</span>
                                <span className="text-[10px] font-mono text-text/50 uppercase tracking-widest">مشاريع</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3 p-4 rounded-[4px] border border-border/80 bg-background/60">
                            <div className="w-9 h-9 rounded-[4px] bg-primary/10 flex items-center justify-center">
                                <ArrowLeftRight className="w-4 h-4 text-primary" />
                            </div>
                            <p className="text-sm text-text/70 leading-relaxed">
                                كل هذه الوحدات جزء من مسار واحد واضح: <span className="font-bold text-text">Frontend Engineer Path</span>،
                                يربط بين الدروس، التمارين، والمشاريع في خط تعلّم لا يشبه التجربة العشوائية في منصات الفيديو التقليدية.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vertical Roadmap Demo */}
                <div className="col-span-1 md:col-span-8 lg:col-span-7 md:pr-8 lg:pr-16">
                    <Roadmap modules={fullCurriculumItems} />
                </div>

            </Container>
        </Section>
    );
}

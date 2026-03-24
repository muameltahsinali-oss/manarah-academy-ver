"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { MonitorPlay, CheckCircle2, ArrowLeftRight } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            num: "01",
            title: "اختر الدورة",
            desc: "تصفح الكتالوج واختر الدورة التي تناسب هدفك ومستواك.",
        },
        {
            num: "02",
            title: "تعلّم بدروس الفيديو",
            desc: "شاهد الدروس المرتبة، نفّذ التمارين، وتابع تقدمك مباشرة.",
        },
        {
            num: "03",
            title: "احصل على الشهادة",
            desc: "بعد إكمال الدورة احصل على شهادة إتمام معتمدة.",
        },
    ];

    return (
        <Section spacing="lg" id="how-it-works" className="bg-white border-b border-border">
            <Container grid className="items-start gap-12">
                <div className="col-span-1 md:col-span-5">
                    <div className="text-right max-w-xl ml-auto mb-10">
                        <h2 className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">كيف يعمل</h2>
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-6">
                            ثلاث خطوات ‎↗‎ من التسجيل حتى الشهادة.
                        </h3>
                        <p className="text-text/70 text-lg mb-6">
                            كل خطوة في منارة اكاديمي مصممة كجزء من مسار واحد متماسك: من اختيار الدورة
                            وحتى إظهار الشهادة في لوحة إنجازاتك.
                        </p>

                        <div className="hidden md:flex items-center gap-3 p-4 border border-border rounded-[4px] bg-background">
                            <div className="w-10 h-10 rounded-[4px] bg-primary/10 flex items-center justify-center">
                                <MonitorPlay className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-mono text-text/50 uppercase tracking-[0.18em]">
                                    مثال عملي
                                </span>
                                <span className="text-sm text-text/80">
                                    اختر دورة بناء أنظمة، شاهد الدروس، واحصل على شارة “مهندس نظم” عند الإكمال.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-7">
                    <div className="grid grid-cols-1 md:grid-cols-3 relative gap-8 md:gap-0">
                        {/* Horizontal Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-border z-0"></div>

                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                className="relative z-10 flex flex-col items-center text-center px-4 py-6 rounded-[4px] hover:bg-background/50 transition-colors"
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="w-14 h-14 rounded-[4px] border border-border bg-white flex items-center justify-center mb-8 relative z-10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                                    <span className="font-mono font-bold text-primary">{step.num}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                                <p className="text-text/70 leading-relaxed text-sm max-w-[250px]">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* mini visual flow under steps */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                        className="mt-10 hidden md:flex items-center justify-between px-4 py-3 rounded-[4px] bg-background border border-border/80"
                    >
                        <div className="flex items-center gap-2 text-xs text-text/60">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>تقدّم متزامن بين المشغّل ولوحة التحكم</span>
                        </div>
                        <ArrowLeftRight className="w-4 h-4 text-text/40" />
                        <span className="text-xs font-mono text-text/50">
                            اختيار الدورة ← المتابعة في المشغّل ← ظهور الشهادة في لوحة الإنجاز
                        </span>
                    </motion.div>
                </div>
            </Container>
        </Section>
    );
}

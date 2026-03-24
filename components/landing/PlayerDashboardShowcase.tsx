"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PlayCircle, CheckCircle2, Activity, Users } from "lucide-react";

export function PlayerDashboardShowcase() {
    return (
        <Section spacing="xl" className="bg-white border-b border-border">
            <Container grid className="items-center gap-10 md:gap-12">
                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="col-span-1 md:col-span-5"
                >
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.18em] mb-3">
                        كيف تبدو التجربة؟
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4">
                        مشغل حديث ولوحة تحكم تحكي قصّة تقدّمك.
                    </h2>
                    <p className="text-base text-text/70 leading-relaxed mb-6">
                        شاهد الدرس، مرّر بين الوحدات، وتتبع إنجازك في نفس الشاشة. منارة اكاديمي تجمع
                        بين التجربة البصرية الواضحة والبيانات الحقيقية عن أدائك.
                    </p>
                    <ul className="space-y-3 text-sm text-text/80">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            مشغل يركز على المحتوى مع وضع التركيز وإخفاء التشويش.
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            لوحة تقدّم تربط بين كل دورة، شهادة، ومسار في مكان واحد.
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            شارات وإنجازات فورية تحفّزك على إنهاء الوحدات الأساسية.
                        </li>
                    </ul>

                    {/* Mini product cards (Stripe-style) */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm">
                        <div className="border border-border/70 rounded-[4px] bg-background/80 px-4 py-3 flex flex-col gap-1">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text/50">
                                المشغّل
                            </span>
                            <span className="font-semibold text-text">
                                وضع تركيز يخفي كل شيء ما عدا الدرس.
                            </span>
                        </div>
                        <div className="border border-border/70 rounded-[4px] bg-background/80 px-4 py-3 flex flex-col gap-1">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text/50">
                                لوحة الطالب
                            </span>
                            <span className="font-semibold text-text">
                                ساعات التعلم، المسارات، والشهادات في لوحة واحدة.
                            </span>
                        </div>
                        <div className="border border-border/70 rounded-[4px] bg-background/80 px-4 py-3 flex flex-col gap-1">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text/50">
                                لوحة المدرّب
                            </span>
                            <span className="font-semibold text-text">
                                معدّل الإكمال والإيرادات لكل دورة في نظرة واحدة.
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Mocked UI preview */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                    className="col-span-1 md:col-span-7 md:pl-4"
                >
                    <div className="relative rounded-[4px] border border-border bg-background shadow-xl shadow-primary/5 overflow-hidden">
                        {/* Video mock */}
                        <div className="relative bg-black aspect-video">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-black/40 to-accent/40 opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg shadow-primary/30">
                                    <PlayCircle className="w-8 h-8 text-primary" />
                                </button>
                            </div>
                            <div className="absolute top-3 left-3 flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                            </div>
                        </div>

                        {/* Bottom strip */}
                        <div className="p-4 border-t border-border/80 bg-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text/60">
                                    <span className="px-2 py-1 rounded-[4px] bg-background border border-border">
                                        الوحدة 03 · تصميم النظم
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Activity className="w-3.5 h-3.5 text-accent" />
                                        82% إنجاز الدورة
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5 text-primary" />
                                        1,248 طالب في هذه الدورة
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-text/60">سلسلة التعلّم النشط</span>
                                    <span className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                                        <span className="block h-full w-10/12 bg-primary" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </Section>
    );
}


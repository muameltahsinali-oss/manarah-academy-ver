"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "المنهجية الواضحة وترتيب الدروس ساعداني أكتسب مهارات حقيقية في وقت قصير.",
        author: "أحمد م.",
        role: "مطوّر واجهات أمامية",
    },
    {
        quote: "أفضل منصة عربية للتعلّم التقني. الشهادات والشارات تحفزني على الاستمرار.",
        author: "سارة خ.",
        role: "مهندسة برمجيات",
    },
    {
        quote: "دورات منظمة ومدرّسون محترفون. أنصح بها لأي شخص يريد التقدّم بشكل منهجي.",
        author: "محمد ع.",
        role: "طالب هندسة",
    },
];

export function TestimonialsSection() {
    return (
        <Section spacing="xl" className="bg-white border-b border-border">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                        آراء المتعلمين
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
                        ماذا يقول طلابنا؟
                    </h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="relative p-8 rounded-[4px] border border-border bg-background/50 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                        >
                            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
                            <p className="text-text/80 leading-relaxed mb-6 relative z-10">{t.quote}</p>
                            <div>
                                <p className="font-bold text-text">{t.author}</p>
                                <p className="text-xs text-text/50">{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PlayCircle, Award, Trophy, Sparkles } from "lucide-react";

const features = [
    {
        icon: PlayCircle,
        title: "تعلّم تفاعلي",
        description: "دروس فيديو منظمة مع تمارين عملية وتتبع تقدم فوري.",
    },
    {
        icon: Award,
        title: "مدرّسون خبراء",
        description: "تعلم من محترفين في المجال مع مسارات واضحة ومنهجية.",
    },
    {
        icon: Trophy,
        title: "شهادات معتمدة",
        description: "احصل على شهادة إتمام معتمدة بعد إكمال كل دورة.",
    },
    {
        icon: Sparkles,
        title: "تقدم ممتع",
        description: "شارات وإنجازات وتتبع مرئي لتطورك وتحفيزك المستمر.",
    },
];

export function FeaturesSection() {
    return (
        <Section spacing="xl" className="bg-background border-b border-border overflow-hidden">
            <Container className="relative">
                {/* decorative gradient line */}
                <div className="pointer-events-none absolute -top-16 left-0 right-0 h-32 bg-gradient-to-l from-primary/5 via-accent/10 to-transparent blur-3xl" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                        لماذا منارة اكاديمي؟
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-6">
                        كل ما تحتاجه للتعلّم بفعالية
                    </h2>
                    <p className="text-text/70 text-lg">
                        أدوات ومنهجية مصممة لتحقيق أقصى استفادة من وقتك.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="group relative p-6 md:p-8 rounded-[4px] border border-border bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-[4px] bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-text mb-3">{feature.title}</h3>
                            <p className="text-sm text-text/70 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

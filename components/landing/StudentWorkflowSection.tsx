"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

const workflowSteps = [
    "البدء",
    "الوحدة",
    "التدريب",
    "التقييم",
    "التطور"
];

export function StudentWorkflowSection() {
    return (
        <Section spacing="xl" className="border-b border-border bg-background">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">الدورة</h2>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
                        التطور المستمر.
                    </h3>
                </div>

                <div className="relative py-12 overflow-x-auto hide-scrollbar">
                    <div className="min-w-[700px] relative px-4">
                        {/* Background Line */}
                        <div className="absolute top-1/2 left-8 right-8 h-px bg-border -translate-y-1/2 z-0" />

                        {/* Animated Progress Line */}
                        <motion.div
                            className="absolute top-1/2 right-8 h-px bg-accent -translate-y-1/2 z-0"
                            initial={{ width: 0 }}
                            whileInView={{ width: "calc(100% - 64px)" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        <div className="flex justify-between relative z-10 w-full">
                            {workflowSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex flex-col items-center"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.2, ease: "easeOut" }}
                                >
                                    <motion.div
                                        className="w-4 h-4 rounded-full bg-background border-2 border-border mb-4 transition-colors"
                                        whileInView={{ borderColor: "var(--color-accent)", backgroundColor: "var(--color-background)" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: (idx * 0.2) + 0.3 }}
                                    />
                                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-text">
                                        {step}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

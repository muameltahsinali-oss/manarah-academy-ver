"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

export function FinalCTASection() {
    return (
        <Section spacing="xl" className="bg-gradient-to-b from-secondary to-background text-white">
            <Container className="text-center max-w-3xl flex flex-col items-center justify-center">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                >
                    ابدأ مسارك التقني اليوم.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-xl text-white/80 mb-10 max-w-lg"
                >
                    انضم إلى منارة اكاديمي، اختر دورة واحدة على الأقل هذا الأسبوع، وابدأ رحلة تعلّم يمكن قياسها بالأرقام لا بالانطباعات.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 h-14 px-10 bg-primary text-white text-lg font-medium rounded-[4px] hover:bg-primary/90 shadow-lg shadow-primary/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
                    >
                        أنشئ حسابك مجاناً
                    </Link>
                </motion.div>
            </Container>
        </Section>
    );
}

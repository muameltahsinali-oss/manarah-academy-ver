"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/lib/hooks/useAuth";

export function HomeFinalCTA() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading || isAuthenticated) return null;

    return (
        <Section spacing="xl" className="bg-gradient-to-b from-secondary to-background text-white">
            <Container className="text-center max-w-3xl flex flex-col items-center justify-center">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                >
                    ابدأ مسارك التقني اليوم
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg text-white/80 mb-8 max-w-lg"
                >
                    انضم إلى منارة اكاديمي واختر دورات ومسارات تعلم قابلة للقياس.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center h-12 px-8 bg-primary text-white font-bold rounded-[4px] hover:bg-primary/90 shadow-lg transition-all"
                    >
                        إنشاء حساب مجاني
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center h-12 px-8 bg-white/20 text-white font-bold rounded-[4px] border border-white/40 hover:bg-white/30 transition-all"
                    >
                        تصفح الدورات
                    </Link>
                </motion.div>
            </Container>
        </Section>
    );
}

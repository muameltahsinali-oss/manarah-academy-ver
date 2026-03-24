"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { GraduationCap, BookOpen, Users } from "lucide-react";

function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = end / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [inView, end, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString("ar-EG")}
            {suffix}
        </span>
    );
}

const stats = [
    {
        icon: GraduationCap,
        value: 12500,
        label: "متعلم على منصات تعليمية",
        suffix: "+",
    },
    {
        icon: BookOpen,
        value: 240,
        label: "دورة تقنية حديثة",
        suffix: "+",
    },
    {
        icon: Users,
        value: 85,
        label: "شريك ومجتمع تقني",
        suffix: "+",
    },
];

export function TrustSection() {
    return (
        <Section spacing="sm" className="bg-white border-b border-border overflow-hidden">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6"
                >
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-2">
                        مستوحى من أفضل المنصات
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
                        تعلّم بخبرة مجتمعات عالمية ومحلية
                    </h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {stats.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex flex-col items-center text-center p-4 md:p-6 rounded-[4px] border border-border bg-background/50 hover:bg-background hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-[4px] bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                                <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold font-mono text-primary mb-1">
                                <AnimatedCounter end={item.value} duration={1.5} suffix={item.suffix} /> 
                            </div>
                            <p className="text-xs md:text-sm font-medium text-text/70">{item.label}</p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

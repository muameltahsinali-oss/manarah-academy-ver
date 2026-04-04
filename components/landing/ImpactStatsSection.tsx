"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

type StatTone = "primary" | "support";

type StatSpec = {
    id: string;
    tone: StatTone;
    value: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    headline: string;
    subline?: string;
};

function clamp01(n: number) {
    return Math.min(1, Math.max(0, n));
}

function useCountUpValue(opts: {
    end: number;
    durationMs: number;
    decimals: number;
    startWhen: boolean;
}) {
    const { end, durationMs, decimals, startWhen } = opts;
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!startWhen) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = clamp01((now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic-ish
            const next = end * eased;
            const pow = Math.pow(10, decimals);
            const rounded = Math.round(next * pow) / pow;
            setValue(rounded);
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [startWhen, end, durationMs, decimals]);

    return value;
}

function AnimatedNumber({
    value,
    decimals = 0,
    prefix,
    suffix,
}: {
    value: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-15% 0px -25% 0px" });
    const reduce = useReducedMotion() === true;

    const v = useCountUpValue({
        end: value,
        durationMs: reduce ? 1 : 1150,
        decimals,
        startWhen: inView,
    });

    const text = useMemo(() => {
        const formatted =
            decimals > 0
                ? v.toLocaleString("en-US", {
                      minimumFractionDigits: decimals,
                      maximumFractionDigits: decimals,
                  })
                : Math.round(v).toLocaleString("ar-EG");
        return `${prefix ?? ""}${formatted}${suffix ?? ""}`;
    }, [v, decimals, prefix, suffix]);

    return <span ref={ref}>{text}</span>;
}

function statVariants(reduce: boolean): Variants {
    if (reduce) {
        return {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.2 } },
        };
    }
    return {
        hidden: { opacity: 0, y: 18, scale: 0.985, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
    };
}

export function ImpactStatsSection() {
    const reduce = useReducedMotion() === true;

    const stats: StatSpec[] = useMemo(
        () => [
            {
                id: "primary-60",
                tone: "primary",
                value: 60,
                suffix: "%",
                headline: "من شباب العراق بدون مهارات رقمية",
            },
            {
                id: "under-25",
                tone: "support",
                value: 60,
                suffix: "%+",
                headline: "من السكان تحت سن 25",
            },
            {
                id: "youth-unemployment",
                tone: "support",
                value: 32,
                suffix: "%",
                headline: "بطالة الشباب رسميًا",
            },
            {
                id: "edtech-market",
                tone: "support",
                value: 12.3,
                decimals: 1,
                prefix: "$",
                suffix: "B",
                headline: "سوق EdTech الشرق الأوسط 2025",
                subline: "حجم سوق تقديري",
            },
        ],
        []
    );

    const containerVariants: Variants = useMemo(() => {
        if (reduce) return { hidden: {}, visible: {} };
        return {
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
        };
    }, [reduce]);

    return (
        <Section
            spacing="lg"
            className="relative overflow-hidden bg-white -mt-12 pt-12"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-white to-white" />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.22]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.22) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
                aria-hidden
            />

            <Container grid className="relative z-10 items-stretch">
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-12 mb-8 md:mb-10"
                >
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-primary/90">
                        لماذا الآن؟
                    </p>
                    <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-text">
                        أرقام تشرح حجم الفرصة… وحجم الفجوة.
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-text/70 max-w-2xl">
                        هذا الجزء مصمم ليُشاهد ويُفهم خلال ثوانٍ: حقيقة واحدة كبيرة، وثلاث حقائق تُكمل الصورة.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
                    className="md:col-span-12"
                >
                    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                        {/* Primary dominant stat */}
                        <motion.div
                            variants={statVariants(reduce)}
                            className="md:col-span-7 md:row-span-2"
                        >
                            <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-white/85 backdrop-blur-md shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] p-6 md:p-10 min-h-[260px] md:min-h-[340px]">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.07]" />
                                <div className="pointer-events-none absolute -top-24 -start-24 h-64 w-64 rounded-full bg-primary/18 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-28 -end-24 h-72 w-72 rounded-full bg-accent/14 blur-3xl" />

                                <motion.div
                                    className="absolute -top-10 end-6 h-24 w-24 rounded-full bg-primary/12 blur-2xl"
                                    whileHover={reduce ? undefined : { opacity: 0.95, scale: 1.05 }}
                                    transition={{ duration: 0.35 }}
                                    aria-hidden
                                />

                                <div className="relative flex flex-col gap-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text/55">
                                            فجوة مهارات رقمية
                                        </p>
                                        <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-bold text-primary">
                                            العراق
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                        <div className="relative">
                                            <div className="absolute -inset-6 rounded-[28px] bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="relative text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-text">
                                                <span className="text-primary drop-shadow-[0_12px_40px_rgba(59,130,246,0.28)]">
                                                    <AnimatedNumber value={60} suffix="%" />
                                                </span>
                                            </div>
                                            <div className="mt-3 text-xl md:text-2xl font-bold text-text/90 leading-snug">
                                                من شباب العراق بدون مهارات رقمية
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start md:items-end gap-2">
                                            <div className="text-sm text-text/65 max-w-sm">
                                                هذا الرقم هو “المشهد الافتتاحي” — لأنه يحدد لماذا وجود منصة مهارات عملية ليس رفاهية.
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="h-2 w-2 rounded-full bg-primary/70" />
                                                <span className="h-2 w-2 rounded-full bg-primary/35" />
                                                <span className="h-2 w-2 rounded-full bg-primary/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.div
                                    className="pointer-events-none absolute bottom-6 start-6 h-10 w-10 rounded-xl border border-primary/25 bg-white/60 shadow-[0_10px_30px_-18px_rgba(59,130,246,0.55)]"
                                    whileHover={reduce ? undefined : { y: -2, rotate: -2 }}
                                    transition={{ duration: 0.35 }}
                                    aria-hidden
                                />
                            </div>
                        </motion.div>

                        {/* Support stat 1 */}
                        <motion.div
                            variants={statVariants(reduce)}
                            className="md:col-span-5 md:col-start-8"
                        >
                            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/40 hover:bg-white/85 backdrop-blur-md transition-all duration-300 p-6 min-h-[160px] shadow-[0_18px_50px_-30px_rgba(15,23,42,0.22)] hover:shadow-[0_22px_60px_-34px_rgba(15,23,42,0.26)]">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent" />
                                <div className="relative flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text/55">
                                            ديموغرافيا
                                        </p>
                                        <div className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-text">
                                            <span className="text-primary">
                                                <AnimatedNumber value={60} suffix="%+" />
                                            </span>
                                        </div>
                                        <div className="mt-2 text-base font-bold text-text/85">
                                            من السكان تحت سن 25
                                        </div>
                                    </div>
                                    <motion.div
                                        className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_16px_36px_-24px_rgba(59,130,246,0.6)]"
                                        whileHover={reduce ? undefined : { y: -2, rotate: 3 }}
                                        transition={{ duration: 0.35 }}
                                        aria-hidden
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Support stat 2 */}
                        <motion.div
                            variants={statVariants(reduce)}
                            className="md:col-span-5 md:col-start-8 md:translate-y-4"
                        >
                            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/40 hover:bg-white/85 backdrop-blur-md transition-all duration-300 p-6 min-h-[160px] shadow-[0_18px_50px_-30px_rgba(15,23,42,0.22)] hover:shadow-[0_22px_60px_-34px_rgba(15,23,42,0.26)]">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent" />
                                <div className="relative">
                                    <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text/55">
                                        اقتصاد
                                    </p>
                                    <div className="mt-3 flex items-baseline gap-2">
                                        <div className="text-4xl md:text-5xl font-black tracking-tight text-text">
                                            <span className="text-text drop-shadow-[0_16px_44px_rgba(15,23,42,0.12)]">
                                                <AnimatedNumber value={32} suffix="%" />
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-text/55">رسميًا</span>
                                    </div>
                                    <div className="mt-2 text-base font-bold text-text/85">
                                        بطالة الشباب رسميًا
                                    </div>
                                    <motion.div
                                        className="pointer-events-none absolute -bottom-10 -start-10 h-24 w-24 rounded-full bg-accent/12 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        aria-hidden
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Support stat 3 */}
                        <motion.div
                            variants={statVariants(reduce)}
                            className="md:col-span-7 md:col-start-1 md:-translate-y-6"
                        >
                            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white/80 backdrop-blur-md transition-all duration-300 p-6 md:p-7 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.22)] hover:shadow-[0_22px_60px_-36px_rgba(15,23,42,0.26)]">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.06]" />
                                <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-text/55">
                                            السوق
                                        </p>
                                        <div className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-text">
                                            <span className="text-primary drop-shadow-[0_12px_40px_rgba(59,130,246,0.22)]">
                                                <AnimatedNumber value={12.3} decimals={1} prefix="$" suffix="B" />
                                            </span>
                                        </div>
                                        <div className="mt-2 text-base font-bold text-text/85">
                                            سوق EdTech الشرق الأوسط 2025
                                        </div>
                                        <div className="mt-1 text-sm text-text/60">حجم سوق تقديري</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20"
                                            whileHover={reduce ? undefined : { y: -2, rotate: -2 }}
                                            transition={{ duration: 0.35 }}
                                            aria-hidden
                                        />
                                        <motion.div
                                            className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20"
                                            whileHover={reduce ? undefined : { y: -2, rotate: 2 }}
                                            transition={{ duration: 0.35, delay: 0.02 }}
                                            aria-hidden
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </Container>
        </Section>
    );
}


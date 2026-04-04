"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroTabs } from "@/components/landing/hero-tabs";
import { GUEST_HERO_INITIAL_TABS } from "@/components/landing/guest-hero-scenes";

export function LandingHeroLoadingShell() {
    const reduceMotion = useReducedMotion();

    return (
        <Section
            spacing="xl"
            className="relative overflow-hidden bg-gradient-to-b from-background to-white"
        >
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.05]" />

            <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-24 end-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl"
                animate={
                    reduceMotion
                        ? { opacity: 0.4 }
                        : { y: [0, 12, 0], opacity: [0.32, 0.48, 0.32] }
                }
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { duration: 10, repeat: Infinity, ease: "easeInOut" }
                }
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 start-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
                animate={
                    reduceMotion
                        ? { opacity: 0.35 }
                        : { y: [0, -10, 0], opacity: [0.28, 0.42, 0.28] }
                }
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { duration: 12, repeat: Infinity, ease: "easeInOut" }
                }
            />

            <Container className="relative z-10">
                <motion.div
                    layoutId="landing-hero-intro"
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-8 max-w-2xl text-center md:text-start"
                >
                    <div className="h-[22px] w-[220px] rounded-md bg-border/35" />
                    <div className="mt-6 space-y-3">
                        <div className="h-10 w-[min(520px,92%)] rounded-xl bg-border/40" />
                        <div className="h-10 w-[min(420px,82%)] rounded-xl bg-border/30" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <div className="h-5 w-[min(560px,95%)] rounded-lg bg-border/25" />
                        <div className="h-5 w-[min(500px,90%)] rounded-lg bg-border/20" />
                    </div>
                </motion.div>

                <motion.div
                    layoutId="landing-hero-tabs"
                    initial={reduceMotion ? false : { opacity: 0.94 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                    <HeroTabs variant="guest" tabs={GUEST_HERO_INITIAL_TABS} isLoading />
                </motion.div>
            </Container>
        </Section>
    );
}


"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroTabs } from "@/components/landing/hero-tabs";
import {
    GUEST_HERO_INITIAL_TABS,
    GUEST_HERO_NEW_TAB_SCENES,
} from "@/components/landing/guest-hero-scenes";
import { buildStudentHeroScenes } from "@/components/landing/buildStudentHeroScenes";
import { useAuth } from "@/lib/hooks/useAuth";
import { useStudentHomeHeroData } from "@/lib/hooks/useStudentHomeHeroData";
import { isLearnerHomeUser, isStaffHomeUser } from "@/lib/auth/homeAudience";
import { StaffRoleHero } from "@/components/landing/StaffRoleHero";

function firstName(full: string) {
    const p = full.trim().split(/\s+/)[0];
    return p || full;
}

export function HeroSection() {
    const reduceMotion = useReducedMotion();
    const { user, isAuthenticated, isInitialLoading } = useAuth();

    const showStaffHero = Boolean(isAuthenticated && user && isStaffHomeUser(user));
    const showLearnerHero = Boolean(isAuthenticated && user && isLearnerHomeUser(user));

    const {
        continueRows,
        fallbackCourse,
        recommendedPreview,
        loadingHero,
        dash,
        dashLoading,
    } = useStudentHomeHeroData(showLearnerHero);

    const { tabs, extraTabScenes, variant, heroLoading, heroKey } = useMemo(() => {
        // بعد early return للـ staff، هنا ضيف أو طالب فقط.
        if (!showLearnerHero) {
            return {
                tabs: GUEST_HERO_INITIAL_TABS,
                extraTabScenes: GUEST_HERO_NEW_TAB_SCENES,
                variant: "guest" as const,
                heroLoading: isInitialLoading,
                heroKey: "guest",
            };
        }

        const built = buildStudentHeroScenes({
            continueRows,
            fallbackCourse,
            recommendedPreview,
            dash: dash ?? null,
            userName: user?.name ?? null,
        });

        return {
            tabs: built.tabs,
            extraTabScenes: built.extraTabScenes,
            variant: "student" as const,
            heroLoading: loadingHero || dashLoading,
            heroKey: `student-${user?.id ?? "u"}`,
        };
    }, [
        showLearnerHero,
        isInitialLoading,
        continueRows,
        fallbackCourse,
        recommendedPreview,
        dash,
        user?.id,
        user?.name,
        loadingHero,
        dashLoading,
    ]);

    const greeting = user?.name ? firstName(user.name) : null;

    /** مدرّب/إداري: لوحة العمل فقط — بدون Hero الضيف/التبويبات */
    if (showStaffHero) {
        return <StaffRoleHero />;
    }

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
                    key={showLearnerHero ? "intro-auth" : "intro-guest"}
                    layoutId="landing-hero-intro"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-8 max-w-2xl text-center md:text-start"
                >
                    <p className="text-[22px] font-mono font-bold uppercase tracking-[0.22em] text-primary/90">
                        منارة اكاديمي
                    </p>
                    <h1 className="mt-6 flex flex-col gap-2 pt-2 text-4xl font-bold leading-[1.45] tracking-tight text-text md:mt-8 md:gap-2 md:text-5xl md:leading-[1.5] lg:text-6xl lg:leading-[1.52]">
                        {showLearnerHero && greeting ? (
                            <>
                                <span className="block text-text/90">
                                    مرحباً، {greeting}
                                </span>
                                <span className="block text-text">واصل من حيث توقّفت.</span>
                            </>
                        ) : (
                            <>
                                <span className="block">تعلّم بمنهجية.</span>
                                <span className="block text-text">وتقدّم بدقّة.</span>
                            </>
                        )}
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-text/70 md:text-xl">
                        {showLearnerHero
                            ? "تبويباتك أدناه تربط آخر نشاطاً، توصياتك، وتقدّمك — من دون مغادرة الصفحة الرئيسية."
                            : "توقّف عن التخمين. منهج دراسي مصمّم هندسياً لأقصى درجات الاحتفاظ بالمعلومات والتطبيق العملي الفوري."}
                    </p>
                </motion.div>

                <motion.div
                    key={heroKey}
                    layoutId="landing-hero-tabs"
                    initial={reduceMotion ? false : { opacity: 0.92 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                    <HeroTabs
                        variant={variant}
                        tabs={tabs}
                        extraTabScenes={extraTabScenes}
                        isLoading={heroLoading}
                    />
                </motion.div>
            </Container>
        </Section>
    );
}

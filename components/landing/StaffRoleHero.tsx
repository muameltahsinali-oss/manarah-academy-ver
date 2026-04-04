"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, BookOpen, LayoutDashboard, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAdminDashboard, useInstructorDashboard } from "@/lib/hooks/useDashboard";

function firstName(full: string) {
    const p = full.trim().split(/\s+/)[0];
    return p || full;
}

function StatCard({
    label,
    value,
    loading,
}: {
    label: string;
    value: string;
    loading?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-border/70 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm md:px-5 md:py-5">
            {loading ? (
                <div className="space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-border/40" />
                    <div className="h-8 w-16 animate-pulse rounded bg-border/30" />
                </div>
            ) : (
                <>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-text/45">{label}</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-text md:text-3xl">{value}</p>
                </>
            )}
        </div>
    );
}

export function StaffRoleHero() {
    const reduceMotion = useReducedMotion();
    const { user } = useAuth();
    const isInstructor = user?.role === "instructor";
    const isAdmin = user?.role === "admin";

    const { data: instRes, isLoading: instLoading } = useInstructorDashboard(isInstructor && !!user);
    const { data: adminRes, isLoading: adminLoading } = useAdminDashboard(isAdmin && !!user);

    const greeting = user?.name ? firstName(user.name) : null;
    const loading = isInstructor ? instLoading : adminLoading;

    const inst = instRes?.data as
        | {
              active_courses_count?: number;
              total_students_count?: number;
              total_earnings?: number;
          }
        | undefined;

    const adm = adminRes?.data as
        | {
              user_stats?: { total?: number };
              course_stats?: { published?: number };
              total_enrollments?: number;
          }
        | undefined;

    const primaryHref = isInstructor ? "/instructor/dashboard" : "/admin/dashboard";
    const secondaryHref = isInstructor ? "/instructor/courses" : "/admin/users";
    const secondaryLabel = isInstructor ? "دوراتي" : "المستخدمون";

    const titleLine =
        isInstructor && greeting ? (
            <>
                <span className="block text-text/90">مرحباً، {greeting}</span>
                <span className="block text-text">هذه لوحة عملك كمدرّب.</span>
            </>
        ) : isAdmin && greeting ? (
            <>
                <span className="block text-text/90">مرحباً، {greeting}</span>
                <span className="block text-text">لوحة تحكّم المنصّة.</span>
            </>
        ) : (
            <>
                <span className="block">منارة اكاديمي</span>
                <span className="block text-text">لوحة العمل</span>
            </>
        );

    return (
        <Section spacing="xl" className="relative overflow-hidden bg-gradient-to-b from-background to-white">
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
                    reduceMotion ? { opacity: 0.4 } : { y: [0, 12, 0], opacity: [0.32, 0.48, 0.32] }
                }
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { duration: 10, repeat: Infinity, ease: "easeInOut" }
                }
            />

            <Container className="relative z-10">
                <motion.div
                    key={user?.id ?? "staff"}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-8 max-w-2xl text-center md:text-start"
                >
                    <p className="text-[22px] font-mono font-bold uppercase tracking-[0.22em] text-primary/90">
                        {isInstructor ? "مساحة المدرب" : "مساحة الإدارة"}
                    </p>
                    <h1 className="mt-6 flex flex-col gap-2 pt-2 text-4xl font-bold leading-[1.45] tracking-tight text-text md:mt-8 md:gap-2 md:text-5xl md:leading-[1.5] lg:text-6xl lg:leading-[1.52]">
                        {titleLine}
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-text/70 md:text-xl">
                        {isInstructor
                            ? "متابعة الدورات المنشورة، المتعلّمين، والإيرادات — مع اختصار مباشر إلى لوحة المدرب."
                            : "نظرة موجزة على المستخدمين والدورات والتسجيلات — مع اختصار إلى لوحة الإدارة."}
                    </p>
                </motion.div>

                <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {isInstructor ? (
                        <>
                            <StatCard
                                label="دورات منشورة"
                                value={String(inst?.active_courses_count ?? "—")}
                                loading={loading}
                            />
                            <StatCard
                                label="متعلّمون"
                                value={String(inst?.total_students_count ?? "—")}
                                loading={loading}
                            />
                            <StatCard
                                label="إجمالي الإيرادات"
                                value={
                                    inst?.total_earnings != null
                                        ? Number(inst.total_earnings).toLocaleString("ar-SA", {
                                              maximumFractionDigits: 0,
                                          })
                                        : "—"
                                }
                                loading={loading}
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                label="مستخدمون"
                                value={String(adm?.user_stats?.total ?? "—")}
                                loading={loading}
                            />
                            <StatCard
                                label="دورات منشورة"
                                value={String(adm?.course_stats?.published ?? "—")}
                                loading={loading}
                            />
                            <StatCard
                                label="تسجيلات"
                                value={String(adm?.total_enrollments ?? "—")}
                                loading={loading}
                            />
                        </>
                    )}
                </div>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0.92 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                >
                    <Link
                        href={primaryHref}
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                    >
                        <LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden />
                        {isInstructor ? "لوحة المدرب" : "لوحة الإدارة"}
                    </Link>
                    <Link
                        href={secondaryHref}
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-border/80 bg-white/90 px-8 text-sm font-bold text-text/90 transition-colors hover:bg-black/[0.03]"
                    >
                        {isInstructor ? (
                            <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                        ) : (
                            <Users className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                        )}
                        {secondaryLabel}
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold text-primary underline-offset-4 hover:underline"
                    >
                        <BarChart3 className="h-5 w-5 shrink-0" aria-hidden />
                        تصفّح الكتالوج
                    </Link>
                </motion.div>
            </Container>
        </Section>
    );
}

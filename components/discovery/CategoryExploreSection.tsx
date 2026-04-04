"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FolderOpen, Loader2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useCourseCategories } from "@/lib/hooks/useDiscovery";

export function CategoryExploreSection() {
    const { data: res, isLoading } = useCourseCategories();
    const categories = res?.data?.categories ?? [];

    return (
        <Section spacing="xl" className="border-b border-border bg-white">
            <Container>
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                            استكشف
                        </p>
                        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-text md:text-2xl">
                            <FolderOpen className="h-6 w-6 text-primary" />
                            التصنيفات
                        </h2>
                        <p className="mt-2 text-sm text-text/60">انتقل مباشرة إلى الدورات ضمن كل مجال.</p>
                    </div>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80"
                    >
                        كل الدورات
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/35" />
                    </div>
                ) : categories.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border/80 bg-background/50 py-10 text-center text-sm text-text/55">
                        لا توجد تصنيفات بعد في الكتالوج.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.35, delay: idx * 0.04 }}
                            >
                                <Link
                                    href={`/courses?category=${encodeURIComponent(cat.name)}`}
                                    className="flex min-h-[88px] flex-col justify-between rounded-2xl border border-border/80 bg-background/40 p-5 shadow-sm transition hover:border-primary/35 hover:bg-primary/[0.04] hover:shadow-md"
                                >
                                    <span className="line-clamp-2 text-base font-bold text-text">{cat.name}</span>
                                    <span className="mt-3 text-xs font-semibold text-text/50">
                                        {cat.courses_count} دورة
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Container>
        </Section>
    );
}

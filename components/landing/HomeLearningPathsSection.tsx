"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/lib/hooks/useAuth";
import { useLearningPaths, type LearningPathItem } from "@/lib/hooks/useLearningPaths";
import { useCourseCategories } from "@/lib/hooks/useDiscovery";
import { Route, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export function HomeLearningPathsSection({
    hideCategoryBrowse = false,
}: {
    /** When true, omits the static/dynamic category chips (e.g. discovery hub shows categories separately). */
    hideCategoryBrowse?: boolean;
}) {
    const { isAuthenticated } = useAuth();
    const { data: pathsRes, isLoading } = useLearningPaths(!!isAuthenticated);
    const paths: LearningPathItem[] = pathsRes?.data ?? [];
    const { data: catRes, isLoading: catLoading } = useCourseCategories();
    const categories = catRes?.data?.categories ?? [];

    return (
        <Section spacing="xl" className="bg-white border-b border-border">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text mb-1 flex items-center gap-2">
                            <Route className="w-6 h-6 text-primary" />
                            مسارات التعلم
                        </h2>
                        <p className="text-sm text-text/60">
                            {isAuthenticated
                                ? "مسارات مخصصة حسب أهدافك — أو اكتشف التصنيفات أدناه."
                                : "سجّل دخولك لإنشاء مسارات تعلم مخصصة حسب هدفك، أو تصفح الدورات حسب التصنيف."}
                        </p>
                    </div>
                    {isAuthenticated && (
                        <Link
                            href="/dashboard/learning-paths"
                            className="text-sm font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                            مساراتي
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {isAuthenticated && (
                    <div className="mb-10">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12 border border-border/80 rounded-[4px] bg-background/50">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : paths.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paths.slice(0, 6).map((path) => (
                                    <Link
                                        key={path.id}
                                        href={`/dashboard/learning-paths`}
                                        className="block p-4 rounded-[4px] border border-border/80 bg-background/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
                                    >
                                        <h3 className="font-bold text-text mb-1 line-clamp-1">{path.title}</h3>
                                        <p className="text-xs text-text/60 line-clamp-2">{path.goal}</p>
                                        <span className="text-[10px] font-mono text-primary mt-2 inline-block">
                                            {path.courses?.length ?? 0} دورات
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 rounded-[4px] border border-dashed border-border/80 bg-background/30 text-center">
                                <Sparkles className="w-10 h-10 text-primary/50 mx-auto mb-2" />
                                <p className="text-sm text-text/60 mb-4">لم تنشئ مسارات بعد. أنشئ مساراً حسب هدفك من لوحة التحكم.</p>
                                <Link
                                    href="/dashboard/learning-paths"
                                    className="text-sm font-bold text-primary hover:text-primary/80"
                                >
                                    إنشاء مسار تعلم
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {!hideCategoryBrowse && (
                    <div>
                        <h3 className="text-sm font-bold text-text/80 mb-4">تصفح حسب التصنيف</h3>
                        {catLoading ? (
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="h-9 w-24 animate-pulse rounded-[4px] bg-border/35"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(0, 12).map((cat) => (
                                    <Link
                                        key={cat.name}
                                        href={`/courses?category=${encodeURIComponent(cat.name)}`}
                                        className="px-4 py-2 rounded-[4px] bg-background border border-border/80 text-sm font-medium text-text/80 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                                    >
                                        {cat.name}
                                        <span className="mr-1 text-[10px] text-text/45">({cat.courses_count})</span>
                                    </Link>
                                ))}
                                <Link
                                    href="/courses"
                                    className="px-4 py-2 rounded-[4px] border border-dashed border-border/90 text-sm font-semibold text-primary/90 hover:bg-primary/5 transition-all"
                                >
                                    الكل →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </Section>
    );
}

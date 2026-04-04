"use client";

import dynamic from "next/dynamic";
import { CategoryExploreSection } from "@/components/discovery/CategoryExploreSection";
import { CourseRecommendationRail } from "@/components/recommendations/CourseRecommendationRail";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { mapApiCourseToFeaturedCard } from "@/lib/recommendations/mapCourse";
import { useMemo } from "react";
import { useStudentHomeHeroData } from "@/lib/hooks/useStudentHomeHeroData";

const LearningPathsLazy = dynamic(
    () =>
        import("@/components/landing/HomeLearningPathsSection").then((m) => {
            function LearningPathsDiscovery() {
                return <m.HomeLearningPathsSection hideCategoryBrowse />;
            }
            return { default: LearningPathsDiscovery };
        }),
    {
        loading: () => (
            <Section spacing="lg" className="border-b border-border bg-white">
                <Container>
                    <div className="h-40 animate-pulse rounded-2xl bg-border/25" />
                </Container>
            </Section>
        ),
        ssr: false,
    }
);

export function DiscoveryAuthenticatedHome() {
    const {
        payload,
        forYouRows,
        recLoading,
        loadingHero,
    } = useStudentHomeHeroData(true);

    const forYou = useMemo(
        () =>
            forYouRows.map((row) =>
                mapApiCourseToFeaturedCard(row.course, row.reason_label)
            ),
        [forYouRows]
    );

    const because = useMemo(
        () =>
            (payload?.because_you_learned ?? []).map((row) =>
                mapApiCourseToFeaturedCard(row.course, row.reason_label)
            ),
        [payload?.because_you_learned]
    );

    const popular = useMemo(
        () =>
            (payload?.popular ?? []).map((row) =>
                mapApiCourseToFeaturedCard(row.course, row.reason_label)
            ),
        [payload?.popular]
    );

    const recLoadingState = recLoading || loadingHero;

    return (
        <div className="flex flex-col">
            {(forYou.length > 0 || recLoading) && (
                <Section
                    id="discover-recommended"
                    spacing="xl"
                    className="border-b border-border bg-background scroll-mt-20"
                >
                    <Container>
                        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                                    موصى لك
                                </p>
                                <h2 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
                                    بناءً على اهتماماتك ومسار تعلّمك
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-text/60">
                                    اقتراحات مبنية على اهتماماتك، مستواك، وسجلّك — وليس عرضاً عشوائياً.
                                </p>
                            </div>
                        </div>
                        {recLoadingState && forYou.length === 0 ? (
                            <div className="flex gap-4 overflow-hidden pb-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-[320px] w-[min(100%,280px)] shrink-0 rounded-xl border border-border/60 bg-white shadow-sm"
                                    >
                                        <div className="aspect-video animate-pulse bg-border/30" />
                                        <div className="space-y-3 p-4">
                                            <div className="h-4 w-2/3 animate-pulse rounded bg-border/40" />
                                            <div className="h-3 w-full animate-pulse rounded bg-border/25" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CourseRecommendationRail
                                title=""
                                subtitle=""
                                courses={forYou.slice(0, 12)}
                            />
                        )}
                    </Container>
                </Section>
            )}

            {because.length > 0 && (
                <Section spacing="xl" className="border-b border-border bg-white">
                    <Container>
                        <div className="mb-6">
                            <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                                بناءً على تعلّمك
                            </p>
                            <h2 className="text-xl font-bold tracking-tight text-text md:text-2xl">
                                تابع مسارك المنطقي
                            </h2>
                        </div>
                        <CourseRecommendationRail title="" subtitle="" courses={because.slice(0, 8)} />
                    </Container>
                </Section>
            )}

            <CategoryExploreSection />

            {(popular.length > 0 || recLoading) && (
                <Section spacing="xl" className="border-b border-border bg-background">
                    <Container>
                        <div className="mb-8">
                            <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                                شائعة بين المتعلّمين
                            </p>
                            <h2 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
                                دورات رائجة ومُقيَّمة
                            </h2>
                            <p className="mt-2 text-sm text-text/60">
                                ترتيب يعتمد على التقييم والتسجيل — لإحساس اجتماعي واضح.
                            </p>
                        </div>
                        {recLoadingState && popular.length === 0 ? (
                            <div className="flex gap-4 overflow-hidden pb-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-[300px] w-[min(100%,280px)] shrink-0 rounded-xl border border-border/60 bg-white"
                                    >
                                        <div className="aspect-video animate-pulse bg-border/30" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <CourseRecommendationRail title="" subtitle="" courses={popular.slice(0, 10)} />
                        )}
                    </Container>
                </Section>
            )}

            <LearningPathsLazy />
        </div>
    );
}

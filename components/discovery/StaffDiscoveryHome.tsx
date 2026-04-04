"use client";

import { FeaturedCoursesSection } from "@/components/landing/FeaturedCoursesSection";
import { CategoryExploreSection } from "@/components/discovery/CategoryExploreSection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

/**
 * Below-the-fold content for instructor/admin on `/` — catalog browse without full guest marketing funnel.
 */
export function StaffDiscoveryHome() {
    return (
        <div className="flex flex-col">
            <Section spacing="lg" className="border-b border-border bg-white">
                <Container>
                    <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                        استكشاف
                    </p>
                    <h2 className="text-xl font-bold tracking-tight text-text md:text-2xl">
                        تصفّح الكتالوج كما يراه المتعلّمون
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-text/60">
                        مرجع سريع للمحتوى المنشور دون الخروج من تجربة المنصّة.
                    </p>
                </Container>
            </Section>
            <FeaturedCoursesSection forceCatalog />
            <CategoryExploreSection />
        </div>
    );
}

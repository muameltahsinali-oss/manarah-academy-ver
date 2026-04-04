"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/lib/hooks/useAuth";
import { DiscoveryAuthenticatedHome } from "@/components/discovery/DiscoveryAuthenticatedHome";
import { HeroSection } from "@/components/landing/HeroSection";
import { ImpactStatsSection } from "@/components/landing/ImpactStatsSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { FeaturedCoursesSection } from "@/components/landing/FeaturedCoursesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ShowcaseTilesSection } from "@/components/landing/ShowcaseTilesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { PlayerDashboardShowcase } from "@/components/landing/PlayerDashboardShowcase";
import { CategoryExploreSection } from "@/components/discovery/CategoryExploreSection";
import { StaffDiscoveryHome } from "@/components/discovery/StaffDiscoveryHome";
import { isLearnerHomeUser, isStaffHomeUser } from "@/lib/auth/homeAudience";

const GuestTrendingSection = dynamic(
    () =>
        import("@/components/discovery/GuestTrendingSection").then((m) => ({
            default: m.GuestTrendingSection,
        })),
    {
        loading: () => (
            <div className="min-h-[280px] border-b border-border bg-background animate-pulse" />
        ),
    }
);

/**
 * `/`: Hero تبويبات ديناميكي (ضيف ↔ مسجّل)؛ مسارات الاكتشاف للمتعلّم تحت الـ Hero.
 */
export function GuestMarketingHome() {
    const { isAuthenticated, user } = useAuth();

    const learner = Boolean(isAuthenticated && user && isLearnerHomeUser(user));
    const staff = Boolean(isAuthenticated && user && isStaffHomeUser(user));

    return (
        <div className="flex min-h-screen flex-col">
            <HeroSection />
            {learner ? (
                <DiscoveryAuthenticatedHome />
            ) : staff ? (
                <StaffDiscoveryHome />
            ) : (
                <>
                    <ImpactStatsSection />
                    <TrustSection />
                    <PlayerDashboardShowcase />
                    <FeaturedCoursesSection forceCatalog />
                    <CategoryExploreSection />
                    <GuestTrendingSection />
                    <FeaturesSection />
                    <ShowcaseTilesSection />
                    <HowItWorksSection />
                    <FinalCTASection />
                </>
            )}
        </div>
    );
}

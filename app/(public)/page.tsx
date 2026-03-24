"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { FeaturedCoursesSection } from "@/components/landing/FeaturedCoursesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ShowcaseTilesSection } from "@/components/landing/ShowcaseTilesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { PlayerDashboardShowcase } from "@/components/landing/PlayerDashboardShowcase";
import { HomeHeroSection } from "@/components/landing/HomeHeroSection";
import { HomeContinueLearning } from "@/components/landing/HomeContinueLearning";
import { HomeLearningPathsSection } from "@/components/landing/HomeLearningPathsSection";
import { HomeFinalCTA } from "@/components/landing/HomeFinalCTA";

export default function Home() {
  const { isAuthenticated } = useAuth();

  // ضيف: نفس نسخة الـ landing الترويجية القديمة
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <TrustSection />
        <PlayerDashboardShowcase />
        <FeaturedCoursesSection />
        <FeaturesSection />
        <ShowcaseTilesSection />
        <HowItWorksSection />
        <FinalCTASection />
      </div>
    );
  }

  // مسجّل دخول: تجربة التعلم (دورات، استمر في التعلم، مسارات، أقسام)
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeroSection />
      <HomeContinueLearning />
      <FeaturedCoursesSection />
      <HomeLearningPathsSection />
      <HowItWorksSection />
      <HomeFinalCTA />
    </div>
  );
}

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ContinueLearningHero } from "@/components/dashboard/ContinueLearningHero";
import { ProgressOverviewSection } from "@/components/dashboard/ProgressOverviewSection";
import { LearningPathWidget } from "@/components/dashboard/LearningPathWidget";
import { CurrentRoadmap } from "@/components/dashboard/CurrentRoadmap";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CertificatesList } from "@/components/dashboard/CertificatesList";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";
import { BadgesPreview } from "@/components/dashboard/BadgesPreview";

export default function DashboardPage() {
    return (
        <div className="w-full flex-1 min-w-0">
            <DashboardHeader />

            <div className="flex flex-col gap-6 md:gap-10 lg:gap-12">
                {/* 1 — Continue learning (hero) */}
                <ContinueLearningHero />

                {/* 2 — Progress overview + streak */}
                <ProgressOverviewSection />

                {/* 3 — Recommendations */}
                <RecommendedCourses />

                {/* 4 — Badges preview */}
                <BadgesPreview />

                {/* Path + roadmap */}
                <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
                    <div className="flex flex-col gap-4 md:gap-6 lg:col-span-7">
                        <LearningPathWidget />
                    </div>
                    <div className="lg:col-span-5">
                        <CurrentRoadmap />
                    </div>
                </div>

                <ActivityFeed />

                <CertificatesList />
            </div>
        </div>
    );
}

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPIRow } from "@/components/dashboard/KPIRow";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { CurrentRoadmap } from "@/components/dashboard/CurrentRoadmap";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CertificatesList } from "@/components/dashboard/CertificatesList";
import { RecommendedCourses } from "@/components/dashboard/RecommendedCourses";
import { BadgesSection } from "@/components/dashboard/BadgesSection";
import { ContinueLearningSection } from "@/components/dashboard/ContinueLearningSection";
import { LearningPathWidget } from "@/components/dashboard/LearningPathWidget";

export default function DashboardPage() {
    return (
        <div className="w-full flex-1 min-w-0">
            <DashboardHeader />

            <div className="flex flex-col gap-6 md:gap-10 lg:gap-12">
                {/* 1. KPI Row */}
                <KPIRow />

                {/* 1.5 Continue learning */}
                <ContinueLearningSection />

                {/* 2. Main Grid: Analytics, Path, Current Roadmap */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Analytics Section + Path widget - spans 7 columns */}
                    <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">
                        <AnalyticsSection />
                        <LearningPathWidget />
                    </div>

                    {/* Current Roadmap - spans 5 columns */}
                    <div className="lg:col-span-5">
                        <CurrentRoadmap />
                    </div>
                </div>

                {/* 3. Badges & Progress */}
                <BadgesSection />

                {/* 4. Activity Feed */}
                <ActivityFeed />

                {/* 4. Certificates List */}
                <CertificatesList />

                {/* 5. Recommended Courses */}
                <RecommendedCourses />
            </div>
        </div>
    );
}

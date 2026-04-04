"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { GuestMarketingHome } from "@/components/discovery/GuestMarketingHome";
import { LandingHeroLoadingShell } from "@/components/landing/LandingHeroLoadingShell";
import { HomeSessionDegraded } from "@/components/discovery/HomeSessionDegraded";

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const { authSessionStatus, refetchSession, isFetchingSession } = useAuth();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- ضروري لمنع وميض محتوى غير متسق
        setMounted(true);
    }, []);

    if (!mounted || authSessionStatus === "loading") {
        return <LandingHeroLoadingShell />;
    }

    if (authSessionStatus === "degraded") {
        return (
            <HomeSessionDegraded
                onRetry={() => void refetchSession()}
                isRetrying={isFetchingSession}
            />
        );
    }

    return <GuestMarketingHome />;
}

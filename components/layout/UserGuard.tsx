"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { HomeSessionDegraded } from "@/components/discovery/HomeSessionDegraded";

interface UserGuardProps {
    children: React.ReactNode;
    allowedRoles?: ("student" | "instructor" | "admin")[];
    redirectTo?: string;
}

export function UserGuard({ children, allowedRoles, redirectTo = "/login" }: UserGuardProps) {
    const { user, authSessionStatus, isAuthenticated, refetchSession, isFetchingSession } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (authSessionStatus === "loading" || authSessionStatus === "degraded") return;
        if (!isAuthenticated) {
            router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
        } else if (allowedRoles && !allowedRoles.includes(user!.role)) {
            const correctPath =
                user!.role === "instructor"
                    ? "/instructor/dashboard"
                    : user!.role === "admin"
                      ? "/admin/dashboard"
                      : "/dashboard";
            router.push(correctPath);
        }
    }, [
        isMounted,
        authSessionStatus,
        isAuthenticated,
        user,
        allowedRoles,
        router,
        pathname,
        redirectTo,
    ]);

    if (!isMounted || authSessionStatus === "loading") {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-text/50">
                        جارِ التحقق من الصلاحيات...
                    </p>
                </div>
            </div>
        );
    }

    if (authSessionStatus === "degraded") {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-4">
                <HomeSessionDegraded
                    onRetry={() => void refetchSession()}
                    isRetrying={isFetchingSession}
                    className="min-h-0 w-full max-w-lg flex flex-1 flex-col justify-center"
                />
            </div>
        );
    }

    if (isAuthenticated && allowedRoles && !allowedRoles.includes(user!.role)) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

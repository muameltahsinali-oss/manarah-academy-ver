"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const GUEST_ONLY_PREFIXES = ["/login", "/register", "/forgot-password"];

function isGuestOnlyPath(pathname: string): boolean {
    return GUEST_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Redirect authenticated users away from guest-only routes (login/register).
 * Replaces Edge middleware when using static export (no server middleware).
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, authSessionStatus } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!isGuestOnlyPath(pathname)) return;
        if (authSessionStatus === "loading" || authSessionStatus === "degraded") return;
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [mounted, pathname, isAuthenticated, authSessionStatus, router]);

    if (!mounted || authSessionStatus === "loading") {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isGuestOnlyPath(pathname) && isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

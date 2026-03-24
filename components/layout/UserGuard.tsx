"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface UserGuardProps {
    children: React.ReactNode;
    allowedRoles?: ("student" | "instructor" | "admin")[];
    redirectTo?: string;
}

export function UserGuard({ children, allowedRoles, redirectTo = "/login" }: UserGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = (useState(false));

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isLoading) {
            if (!isAuthenticated) {
                router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
            } else if (allowedRoles && !allowedRoles.includes(user!.role)) {
                // If on wrong dashboard, redirect to correct one
                const correctPath = user!.role === "instructor" ? "/instructor/dashboard" :
                    user!.role === "admin" ? "/admin/dashboard" : "/dashboard";
                router.push(correctPath);
            }
        }
    }, [isMounted, isLoading, isAuthenticated, user, allowedRoles, router, pathname, redirectTo]);

    if (!isMounted || isLoading) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-text/50">جارِ التحقق من الصلاحيات...</p>
                </div>
            </div>
        );
    }

    // Role check
    if (isAuthenticated && allowedRoles && !allowedRoles.includes(user!.role)) {
        return null; // Will redirect in useEffect
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}

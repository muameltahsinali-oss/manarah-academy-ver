"use client";

import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();

    // If it's an admin or instructor route, we let the sub-layouts handle their own structure
    const isPortalRoute = pathname.startsWith('/instructor') || pathname.startsWith('/admin');

    if (isPortalRoute) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background flex w-full min-h-[100dvh]">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 lg:w-72 flex-shrink-0 fixed right-0 top-0 h-full z-40">
                <AppSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 md:mr-64 lg:mr-72 transition-all w-full overflow-x-hidden">
                {/* Mobile Header: شريط ثابت مع safe area */}
                <header className="md:hidden h-14 min-h-[3.5rem] pt-[env(safe-area-inset-top)] border-b border-border/80 flex items-center justify-between px-4 bg-background sticky top-0 z-30">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg font-bold tracking-tight truncate">منارة اكاديمي</span>
                        <span className="h-2 w-2 bg-accent rounded-full shrink-0" />
                    </div>
                </header>

                <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 pb-24 md:pb-8 md:px-8 md:py-8 md:pb-8">
                    {children}
                </main>
            </div>

            <MobileBottomNav />
        </div>
    );
}


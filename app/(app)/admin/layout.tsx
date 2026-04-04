"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { UserGuard } from "@/components/layout/UserGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-background flex flex-col">
                <Header variant="admin" />

                <div className="flex-1 flex overflow-hidden lg:h-[calc(100vh-64px)]">
                    {/* Desktop Sidebar Content */}
                    <div className="hidden lg:block w-72 shrink-0 border-l border-border/80 bg-background h-full z-10 relative">
                        <AdminSidebar />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-background min-h-0 relative">
                        <main className="flex-1 overflow-y-auto p-4 md:p-8">
                            <div className="max-w-7xl mx-auto w-full">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </UserGuard>
    );
}

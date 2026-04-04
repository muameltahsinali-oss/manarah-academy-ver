"use client";

import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header";
import { UserGuard } from "@/components/layout/UserGuard";
import { useAuth } from "@/lib/hooks/useAuth";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const isPendingInstructor = user?.role === "instructor" && user?.instructor_status !== "approved";

    return (
        <UserGuard allowedRoles={["instructor", "admin"]}>
            <div className="min-h-screen bg-background flex flex-col">
                <Header variant="instructor" />

                <div className="flex-1 flex overflow-hidden lg:h-[calc(100vh-64px)]">
                    {/* Desktop Sidebar Content */}
                    <div className="hidden lg:block w-72 shrink-0 border-l border-border/80 bg-background h-full z-10 relative">
                        <InstructorSidebar />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-background min-h-0 relative">
                        <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-track]:bg-transparent">
                            <div className="max-w-7xl mx-auto w-full">
                                {isPendingInstructor && (
                                    <div className="mb-6 rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                        <div className="font-bold">حسابك كمدرّب قيد المراجعة</div>
                                        <div className="text-xs mt-1 text-amber-700/90">
                                            لا يمكنك إنشاء/إرسال دورات للمراجعة حتى يتم اعتماد الحساب من الإدارة.
                                        </div>
                                    </div>
                                )}
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </UserGuard>
    );
}

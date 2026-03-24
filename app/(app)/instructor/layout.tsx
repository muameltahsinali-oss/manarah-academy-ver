"use client";

import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getFadeIn } from "@/lib/motion";
import { UserGuard } from "@/components/layout/UserGuard";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <UserGuard allowedRoles={["instructor", "admin"]}>
            <div className="min-h-screen bg-background flex flex-col">
                <Header />

                <div className="flex-1 flex overflow-hidden lg:h-[calc(100vh-64px)]">
                    {/* Desktop Sidebar Content */}
                    <div className="hidden lg:block w-72 shrink-0 border-l border-border/80 bg-background h-full z-10 relative">
                        <InstructorSidebar />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-background min-h-0 relative">
                        <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-track]:bg-transparent">
                            <div className="max-w-7xl mx-auto w-full">
                                {children}
                            </div>
                        </main>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center transition-transform hover:scale-105"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Mobile Drawer */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <>
                                <motion.div
                                    {...getFadeIn(0, 0.3)}
                                    className="lg:hidden fixed inset-0 bg-black/40 z-40"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="lg:hidden fixed right-0 top-0 bottom-0 w-72 bg-background z-50 border-l border-border/80"
                                >
                                    <InstructorSidebar />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </UserGuard>
    );
}

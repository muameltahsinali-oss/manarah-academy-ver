"use client";

import { usePlayer } from "./PlayerContext";
import { CourseSidebar } from "./CourseSidebar";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function PlayerLayoutClient({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, isFocusMode, isMobileMenuOpen, setIsMobileMenuOpen, setIsFocusMode } = usePlayer();

    return (
        <div className="min-h-screen bg-background flex w-full overflow-hidden">
            {/* Desktop Sidebar (3 columns ~ 320px) */}
            <motion.div
                initial={false}
                animate={{
                    width: isFocusMode ? 0 : (isSidebarOpen ? 320 : 0),
                    opacity: isFocusMode ? 0 : 1
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="hidden md:block flex-shrink-0 fixed right-0 top-0 h-full z-40 bg-background border-l border-border/80 overflow-hidden"
            >
                <div className="w-[320px] h-full">
                    <CourseSidebar />
                </div>
            </motion.div>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-text/30 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <motion.div
                initial={false}
                animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed right-0 top-0 h-full w-80 bg-background z-50 md:hidden border-l border-border/80"
            >
                <div className="absolute top-4 left-4 z-50">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 bg-white rounded-full border border-border text-text/70 hover:text-text"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <CourseSidebar />
            </motion.div>

            {/* Main Content Area */}
            <motion.div
                layout
                initial={false}
                animate={{
                    marginRight: isFocusMode ? 0 : (isSidebarOpen ? 320 : 0)
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD] h-screen overflow-y-auto"
            >
                {/* Mobile Header (Only visible on small screens) */}
                <header className="md:hidden h-14 border-b border-border/80 flex items-center justify-between px-4 bg-white sticky top-0 z-30 shrink-0">
                    <Link href="/dashboard" className="text-sm font-bold text-text/70 hover:text-text truncate pl-4">
                        العودة للوحة التحكم
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex items-center gap-2 p-1.5 -mr-1.5 text-text hover:bg-black/5 rounded-[4px]"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider">المنهج</span>
                        <Menu className="w-5 h-5" />
                    </button>
                </header>

                {/* Focus Mode Minimal Nav */}
                <AnimatePresence>
                    {isFocusMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 56 }}
                            exit={{ opacity: 0, y: -20, height: 0, overflow: 'hidden' }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="hidden md:flex border-b border-border/80 items-center justify-between px-6 bg-white shrink-0"
                        >
                            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-text/60 hover:text-text transition-colors">
                                <ArrowRight className="w-4 h-4" />
                                العودة للوحة التحكم
                            </Link>
                            <button
                                onClick={() => setIsFocusMode(false)}
                                className="text-xs font-bold px-4 py-2 border border-border/60 hover:border-primary text-primary transition-colors rounded-[4px]"
                            >
                                إظهار القائمة
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className={`flex-1 w-full mx-auto transition-all ${isFocusMode ? 'max-w-7xl' : 'max-w-5xl'}`}>
                    {children}
                </main>
            </motion.div>
        </div>
    );
}

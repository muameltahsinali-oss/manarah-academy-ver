"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "الدورات", href: "/courses" },
    { name: "كيف يعمل", href: "/#how-it-works" },
    { name: "كن مدرّباً", href: "/instructor-info" },
];

export function Header() {
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout, isLoading, isAuthenticated } = useAuth();

    // Avoid hydration mismatch: auth state depends on cookie (client-only), so render
    // a consistent placeholder until after mount, then show real auth UI.
    useEffect(() => {
        setMounted(true);
    }, []);

    const getDashboardLink = () => {
        if (!user) return "/dashboard";
        if (user.role === 'admin') return "/admin/dashboard";
        if (user.role === 'instructor') return "/instructor/dashboard";
        return "/dashboard";
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">منارة اكاديمي</span>
                    <span className="h-2 w-2 bg-accent rounded-full" />
                </Link>

                <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onMouseEnter={() => setHoveredPath(link.href)}
                            onMouseLeave={() => setHoveredPath(null)}
                            className="relative px-4 py-2 transition-colors hover:text-primary"
                        >
                            <span className="relative z-10">{link.name}</span>
                            {hoveredPath === link.href && (
                                <motion.div
                                    layoutId="header-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3 min-w-[120px] justify-end">
                    {/* Hamburger hidden: mobile uses bottom nav; desktop uses top nav */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen((o) => !o)}
                        className="hidden h-9 w-9 items-center justify-center rounded border border-border/80 hover:bg-border/20 transition-colors"
                        aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    {!mounted ? (
                        <span className="h-9 w-9 rounded border border-border/80 bg-border/20 animate-pulse" aria-hidden />
                    ) : !isLoading && isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href={getDashboardLink()}
                                className="hidden sm:flex items-center gap-2 h-9 px-4 text-xs font-bold rounded border border-border/80 hover:bg-black/5 hover:border-primary/30 transition-colors"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                لوحة التحكم
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="h-9 w-9 flex items-center justify-center rounded border border-border/80 text-text/60 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                                title="تسجيل الخروج"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {!isLoading && (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium transition-colors hover:text-primary hidden sm:block px-2"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="group flex h-9 items-center justify-center gap-2 rounded bg-primary px-4 text-sm font-medium text-white transition-all hover:bg-primary/90 shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5 transition-transform"
                                    >
                                        ابدأ التعلم
                                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden border-t border-border bg-background overflow-hidden"
                    >
                        <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 px-4 rounded-[4px] font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}


"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

export type HeaderVariant = "public" | "app" | "admin" | "instructor";

type HeaderLink = { name: string; href: string };

const linksByVariant: Record<HeaderVariant, HeaderLink[]> = {
    // Guest
    public: [
        { name: "الرئيسية", href: "/" },
        { name: "الدورات", href: "/courses" },
        { name: "التسجيل", href: "/register" },
        { name: "من نحن", href: "/about" },
        { name: "كن مدرّباً", href: "/instructor-info" },
    ],
    // Student
    app: [
        { name: "الرئيسية", href: "/" },
        { name: "تعلمي", href: "/dashboard/courses" },
        { name: "المسارات", href: "/dashboard/learning-paths" },
        { name: "الإشعارات", href: "/dashboard/notifications" },
    ],
    admin: [
        { name: "لوحة الإدارة", href: "/admin/dashboard" },
        { name: "المستخدمون", href: "/admin/users" },
        { name: "الدورات", href: "/admin/courses" },
        { name: "التحليلات", href: "/admin/analytics" },
    ],
    // Instructor
    instructor: [
        { name: "لوحة التحكم", href: "/instructor/dashboard" },
        { name: "الدورات", href: "/instructor/courses" },
        { name: "الطلاب", href: "/instructor/students" },
        { name: "التحليلات", href: "/instructor/analytics" },
    ],
};

function isActivePath(pathname: string, href: string) {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) {
        const base = href.split("#")[0] || "/";
        return pathname === base;
    }
    return pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(href);
}

type HeaderProps = { variant?: HeaderVariant | "auto" };

export function Header({ variant = "auto" }: HeaderProps) {
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const { user, logout, isSessionPending, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

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

    const effectiveVariant: HeaderVariant =
        variant !== "auto"
            ? variant
            : isAuthenticated
              ? user?.role === "admin"
                  ? "admin"
                  : user?.role === "instructor"
                    ? "instructor"
                    : "app"
              : "public";

    const navLinks = linksByVariant[effectiveVariant];

    const handleNavClick = (href: string) => (e: React.MouseEvent) => {
        if (!href.includes("#")) return;
        const [basePath, hash] = href.split("#");
        const targetId = hash || "";
        if (pathname === (basePath || "/")) {
            const el = document.getElementById(targetId);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else {
            e.preventDefault();
            router.push(href);
        }
    };

    return (
        <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">منارة اكاديمي</span>
                    <span className="h-2 w-2 bg-accent rounded-full" />
                </Link>

                <nav
                    className="hidden md:flex items-center gap-1 rounded-full border border-border/70 bg-background/60 p-1 shadow-sm"
                    aria-label="التنقل العلوي"
                >
                    {navLinks.map((link) => (
                        (() => {
                            const active = isActivePath(pathname, link.href);
                            return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleNavClick(link.href)}
                            onMouseEnter={() => setHoveredPath(link.href)}
                            onMouseLeave={() => setHoveredPath(null)}
                            aria-current={active ? "page" : undefined}
                            className={[
                                "relative rounded-full px-3 py-2 text-sm font-semibold transition-all",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                active ? "text-primary" : "text-text/70 hover:text-text",
                            ].join(" ")}
                        >
                            {(active || hoveredPath === link.href) && (
                                <motion.span
                                    layoutId="header-pill"
                                    className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                />
                            )}
                            <span className="relative z-10 whitespace-nowrap">{link.name}</span>
                        </Link>
                            );
                        })()
                    ))}
                </nav>

                <div className="flex items-center gap-3 min-w-[120px] justify-end">
                    {!mounted ? (
                        <span className="h-9 w-9 rounded border border-border/80 bg-border/20 animate-pulse" aria-hidden />
                    ) : !isSessionPending && isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href={getDashboardLink()}
                                className="flex items-center gap-2 h-9 px-4 text-xs font-bold rounded-full border border-border/80 bg-background hover:bg-black/5 hover:border-primary/30 transition-colors shadow-sm"
                                aria-label="لوحة التحكم"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">لوحة التحكم</span>
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="h-9 w-9 flex items-center justify-center rounded-full border border-border/80 bg-background text-text/60 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                aria-label="تسجيل الخروج"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {!isSessionPending && (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-semibold text-text/70 transition-colors hover:text-text px-3 py-2 rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="group flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white transition-all hover:bg-primary/90 shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    >
                                        ابدأ التعلم
                                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}


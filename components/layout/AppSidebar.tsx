"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Settings, LogOut, TrendingUp, User, ShieldCheck, GraduationCap, Heart, Receipt, Route } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const studentLinks = [
    { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    { name: "دوراتي", href: "/dashboard/courses", icon: BookOpen },
    { name: "مسارات التعلم", href: "/dashboard/learning-paths", icon: Route },
    { name: "سجل المدفوعات", href: "/dashboard/payments", icon: Receipt },
    { name: "قائمة الرغبات", href: "/dashboard/wishlist", icon: Heart },
    { name: "تقدمي", href: "/dashboard/progress", icon: TrendingUp },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const links = [...studentLinks];

    if (user?.role === 'instructor') {
        links.push({ name: "بوابة المدرب", href: "/instructor/dashboard", icon: GraduationCap });
    }

    if (user?.role === 'admin') {
        links.push({ name: "لوحة المسؤول", href: "/admin/dashboard", icon: ShieldCheck });
    }

    // Common links
    links.push(
        { name: "الملف الشخصي", href: "/dashboard/profile", icon: User },
        { name: "الإعدادات", href: "/dashboard/settings", icon: Settings }
    );

    return (
        <aside className="h-full flex flex-col bg-background border-l border-border/80 w-full overflow-y-auto">
            <div className="p-6 border-b border-border/80">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">منارة اكاديمي</span>
                    <span className="h-2 w-2 bg-accent rounded-full" />
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-2 rounded-[4px] text-sm font-medium transition-colors border-l-2 ${isActive
                                ? "bg-primary/5 text-primary border-primary"
                                : "text-text/70 border-transparent hover:text-text hover:bg-black/5"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-text/50"}`} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/80">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-4 px-4 py-2 w-full text-sm font-medium text-text/70 hover:text-text hover:bg-red-50 hover:text-red-600 rounded-[4px] transition-colors"
                >
                    <LogOut className="w-4 h-4 text-text/50 group-hover:text-red-500" />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}

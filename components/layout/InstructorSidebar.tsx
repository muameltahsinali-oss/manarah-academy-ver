"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { LayoutDashboard, BookOpen, PlusCircle, BarChart3, Users, DollarSign, Settings, LogOut } from "lucide-react";

const sidebarLinks = [
    { name: "لوحة التحكم", href: "/instructor/dashboard", icon: LayoutDashboard },
    { name: "الدورات التعليمية", href: "/instructor/courses", icon: BookOpen },
    { name: "إنشاء دورة", href: "/instructor/create", icon: PlusCircle },
    { name: "تحليل الأداء", href: "/instructor/analytics", icon: BarChart3 },
    { name: "الطلاب", href: "/instructor/students", icon: Users },
    { name: "الإعدادات", href: "/instructor/settings", icon: Settings },
];

export function InstructorSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="h-full flex flex-col bg-background border-l border-border/80 w-full overflow-y-auto">
            <div className="p-6 border-b border-border/80">
                <Link href="/" className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold tracking-tight">منارة اكاديمي</span>
                    <span className="h-2 w-2 bg-primary rounded-full" />
                </Link>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text/50">
                    بوابة المدربين
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-2 rounded-[4px] text-sm font-bold transition-colors border-l-2 ${isActive
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
                <button onClick={() => logout()} className="flex items-center justify-between w-full px-4 py-2 text-sm font-bold text-text hover:bg-black/5 rounded-[4px] border border-border/80 transition-colors">
                    تسجيل الخروج
                    <LogOut className="w-4 h-4 text-text/50" />
                </button>
            </div>
        </aside>
    );
}

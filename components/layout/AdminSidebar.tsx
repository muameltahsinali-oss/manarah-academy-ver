"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { LayoutDashboard, Users, BookOpenCheck, Settings, LogOut, ShieldCheck } from "lucide-react";

const sidebarLinks = [
    { name: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "إدارة المستخدمين", href: "/admin/users", icon: Users },
    { name: "مراجعة الدورات", href: "/admin/courses", icon: BookOpenCheck },
    { name: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="h-full flex flex-col bg-background border-l border-border/80 w-full overflow-y-auto">
            <div className="p-6 border-b border-border/80">
                <Link href="/" className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold tracking-tight">منارة اكاديمي</span>
                    <span className="h-2 w-2 bg-accent rounded-full" />
                </Link>
                <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck className="w-3 h-3 text-accent" />
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text/50">
                        لوحة الإدارة
                    </div>
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
                                ? "bg-accent/5 text-accent border-accent"
                                : "text-text/70 border-transparent hover:text-text hover:bg-black/5"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-text/50"}`} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/80">
                <button
                    onClick={() => logout()}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-bold text-text hover:bg-black/5 rounded-[4px] border border-border/80 transition-colors"
                >
                    تسجيل الخروج
                    <LogOut className="w-4 h-4 text-text/50" />
                </button>
            </div>
        </aside>
    );
}

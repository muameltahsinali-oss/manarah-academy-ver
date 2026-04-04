"use client";

import { Home, BookOpen, User, LayoutDashboard, Route, Users, BarChart3, GraduationCap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: (pathname: string) => boolean;
};

function isPrefixActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(href);
}

function buildItemsForRole(role: "guest" | "student" | "instructor" | "admin"): NavItem[] {
  if (role === "guest") {
    return [
      {
        id: "home",
        label: "الرئيسية",
        href: "/",
        icon: Home,
        isActive: (p) => p === "/" || p.startsWith("/courses") || p.startsWith("/about") || p.startsWith("/contact"),
      },
      {
        id: "courses",
        label: "الدورات",
        href: "/courses",
        icon: BookOpen,
        isActive: (p) => p.startsWith("/courses"),
      },
      {
        id: "register",
        label: "التسجيل",
        href: "/register",
        icon: User,
        isActive: (p) => p.startsWith("/register"),
      },
    ];
  }

  if (role === "student") {
    return [
      {
        id: "home",
        label: "الرئيسية",
        href: "/",
        icon: Home,
        isActive: (p) => p === "/",
      },
      {
        id: "learning",
        label: "تعلمي",
        href: "/dashboard/courses",
        icon: BookOpen,
        isActive: (p) => p.startsWith("/dashboard/courses"),
      },
      {
        id: "paths",
        label: "المسارات",
        href: "/dashboard/learning-paths",
        icon: Route,
        isActive: (p) => p.startsWith("/dashboard/learning-paths"),
      },
      {
        id: "profile",
        label: "الملف",
        href: "/dashboard/profile",
        icon: User,
        isActive: (p) => p.startsWith("/dashboard/profile") || p.startsWith("/dashboard/settings"),
      },
    ];
  }

  if (role === "instructor") {
    return [
      {
        id: "dashboard",
        label: "اللوحة",
        href: "/instructor/dashboard",
        icon: LayoutDashboard,
        isActive: (p) => p.startsWith("/instructor/dashboard"),
      },
      {
        id: "courses",
        label: "الدورات",
        href: "/instructor/courses",
        icon: GraduationCap,
        isActive: (p) => p.startsWith("/instructor/courses") || p.startsWith("/instructor/create"),
      },
      {
        id: "students",
        label: "الطلاب",
        href: "/instructor/students",
        icon: Users,
        isActive: (p) => p.startsWith("/instructor/students"),
      },
      {
        id: "profile",
        label: "الملف",
        href: "/instructor/settings",
        icon: User,
        isActive: (p) => p.startsWith("/instructor/settings"),
      },
    ];
  }

  // admin
  return [
    {
      id: "dashboard",
      label: "اللوحة",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: (p) => p.startsWith("/admin/dashboard"),
    },
    {
      id: "users",
      label: "المستخدمون",
      href: "/admin/users",
      icon: Users,
      isActive: (p) => p.startsWith("/admin/users"),
    },
    {
      id: "courses",
      label: "الدورات",
      href: "/admin/courses",
      icon: BookOpen,
      isActive: (p) => p.startsWith("/admin/courses"),
    },
    {
      id: "analytics",
      label: "التحليلات",
      href: "/admin/analytics",
      icon: BarChart3,
      isActive: (p) => p.startsWith("/admin/analytics"),
    },
  ];
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isSessionPending } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: auth depends on client-only cookie.
  if (!mounted) return null;
  const role: "guest" | "student" | "instructor" | "admin" =
    !isAuthenticated ? "guest" : user?.role === "admin" ? "admin" : user?.role === "instructor" ? "instructor" : "student";
  const items = buildItemsForRole(role);

  const hideForPath =
    pathname.startsWith("/learn") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/checkout");

  if (hideForPath) return null;
  if (isSessionPending) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <nav
        className="flex w-full items-stretch justify-around rounded-t-2xl border-t border-border bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)] min-h-[60px] pb-[env(safe-area-inset-bottom)]"
        aria-label="التنقل الرئيسي"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname);
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => {
                if (pathname !== item.href) {
                  router.push(item.href);
                }
              }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex min-h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 touch-manipulation"
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
            >
              <span
                className={`flex h-9 w-14 items-center justify-center rounded-2xl transition-colors duration-200 ${
                  active ? "bg-primary/10" : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-6 w-6 shrink-0 transition-colors duration-200 ${
                    active ? "text-primary" : "text-text/50"
                  }`}
                  aria-hidden
                />
              </span>
              <span
                className={`max-w-full truncate px-0.5 text-[11px] font-semibold leading-tight transition-colors duration-200 ${
                  active ? "text-primary" : "text-text/50"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`mt-0.5 h-0.5 w-5 rounded-full transition-all duration-200 ease-out ${
                  active ? "bg-primary opacity-100" : "scale-75 bg-transparent opacity-0"
                }`}
              />
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

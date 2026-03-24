"use client";

import { Home, BookOpen, PlayCircle, Award, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: (pathname: string) => boolean;
};

const items: NavItem[] = [
  {
    id: "home",
    label: "الرئيسية",
    href: "/",
    icon: Home,
    isActive: (p) => p === "/" || p.startsWith("/courses"),
  },
  {
    id: "courses",
    label: "دوراتي",
    href: "/dashboard/courses",
    icon: BookOpen,
    isActive: (p) => p.startsWith("/dashboard/courses"),
  },
  {
    id: "learn",
    label: "التعلم",
    href: "/dashboard",
    icon: PlayCircle,
    isActive: (p) => p.startsWith("/dashboard") && !p.startsWith("/dashboard/courses") && !p.startsWith("/dashboard/certificates") && !p.startsWith("/dashboard/profile"),
  },
  {
    id: "certificates",
    label: "الشهادات",
    href: "/dashboard/certificates",
    icon: Award,
    isActive: (p) => p.startsWith("/dashboard/certificates"),
  },
  {
    id: "profile",
    label: "الملف",
    href: "/dashboard/profile",
    icon: User,
    isActive: (p) => p.startsWith("/dashboard/profile"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide on desktop and on specific routes
  if (typeof window === "undefined") {
    // still render markup; visibility controlled by classes below
  }

  const hideForPath =
    pathname.startsWith("/learn") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/checkout");

  if (hideForPath) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      {/* شريط تنقل سفلي واحد كامل العرض - مثل يوتيوب/دولينغو */}
      <nav className="flex items-stretch justify-around w-full rounded-t-2xl border-t border-border bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)] min-h-[56px]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (pathname !== item.href) {
                  router.push(item.href);
                }
              }}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 py-2 min-w-0"
            >
              <Icon
                className={`w-6 h-6 shrink-0 transition-colors ${
                  active ? "text-primary" : "text-text/50"
                }`}
              />
              <span
                className={`text-[10px] font-medium leading-tight truncate max-w-full px-0.5 ${
                  active ? "text-primary" : "text-text/50"
                }`}
              >
                {item.label}
              </span>
              {/* خط تحت النص للتبويب النشط */}
              <span
                className={`mt-0.5 h-0.5 w-5 rounded-full transition-colors ${
                  active ? "bg-primary" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </nav>
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
}


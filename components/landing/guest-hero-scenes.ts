import type { HeroTabScene } from "@/components/landing/hero-tabs/types";

const u = (path: string) =>
    `https://images.unsplash.com/${path}?auto=format&fit=crop&q=80&w=1600`;

/**
 * ضيف: ثلاثة تبويبات رئيسية — استكشاف، انضمام، مسارات.
 * المزيد يُفتح عبر «المزيد».
 */
export const GUEST_HERO_INITIAL_TABS: HeroTabScene[] = [
    {
        id: "guest-explore",
        label: "استكشف الدورات",
        headline: "اكتشف الدورات والمسارات",
        subtitle:
            "منهج دراسي مصمّم لأقصى احتفاظ بالمعلومات وتطبيق عملي فوري. تصفّح الكتالوج وابدأ مسارك.",
        imageSrc: u("photo-1523240795612-9a054b0db644"),
        imageAlt: "طلاب يتعلّمون معاً",
        cta: { label: "تصفح الدورات", href: "/courses" },
        secondaryCta: { label: "إنشاء حساب", href: "/register" },
        badge: "استكشاف",
    },
    {
        id: "guest-join",
        label: "انضم للمنصّة",
        headline: "ابنِ عادة تعلّم مستدامة",
        subtitle:
            "تتبّع التقدّم، واحصل على توصيات ذكية، وتعلّم في وتيرة تناسبك — من أي مكان.",
        imageSrc: u("photo-1517245386807-bb43f82c33c4"),
        imageAlt: "تعلّم عبر الإنترنت",
        cta: { label: "ابدأ التعلّم الآن", href: "/register" },
        secondaryCta: { label: "تصفح الدورات", href: "/courses" },
        badge: "انضمام",
    },
    {
        id: "guest-paths",
        label: "مسارات التعلّم",
        headline: "مسارات واضحة من البداية للإتقان",
        subtitle:
            "خطط تعلّم متسلسلة تربط المفاهيم بالمشاريع — لتعرف ماذا تدرس بعد ذلك.",
        imageSrc: u("photo-1434030216411-0b793f4b4173"),
        imageAlt: "خطة دراسية ومسار تعلّم",
        cta: { label: "اكتشف المسارات", href: "/courses" },
        secondaryCta: { label: "إنشاء حساب", href: "/register" },
        badge: "مسارات",
    },
];

/** مشاهد إضافية عند «المزيد» (ضيف). */
export const GUEST_HERO_NEW_TAB_SCENES: HeroTabScene[] = [
    {
        id: "pool-live",
        label: "جلسات مباشرة",
        headline: "تفاعل مباشر مع المحتوى",
        subtitle: "جلسات وورش تكمّل الدورات — للممارسة والمناقشة مع المدرّبين.",
        imageSrc: u("photo-1524178232363-898fcbc29a8c"),
        imageAlt: "جلسة تعليمية",
        cta: { label: "تصفح الدورات", href: "/courses" },
        secondaryCta: { label: "إنشاء حساب", href: "/register" },
        badge: "مباشر",
    },
    {
        id: "pool-project",
        label: "مشاريع عملية",
        headline: "تطبّق ما تتعلّمه",
        subtitle: "مشاريع وتمارين مركّزة تربط الدروس بواقع العمل.",
        imageSrc: u("photo-1460925895917-afdab827c52f"),
        imageAlt: "عمل على مشروع",
        cta: { label: "استكشف الدورات", href: "/courses" },
        badge: "تطبيق",
    },
    {
        id: "pool-cert",
        label: "شهادات",
        headline: "أهداف واضحة — إنجاز يُحتسب",
        subtitle: "تتبّع دروسك واختباراتك وارتقِ بمسارك خطوة فخطوة.",
        imageSrc: u("photo-1503676260728-1c00da094a0b"),
        imageAlt: "نجاح وتعلّم",
        cta: { label: "ابدأ الآن", href: "/register" },
        secondaryCta: { label: "تصفح الدورات", href: "/courses" },
        badge: "إنجاز",
    },
];

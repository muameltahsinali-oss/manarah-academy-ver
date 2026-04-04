import type { HeroTabScene } from "@/components/landing/hero-tabs/types";
import { mapApiCourseToFeaturedCard } from "@/lib/recommendations/mapCourse";
import type {
    ContinueRow,
    FallbackCourse,
    RecommendedPreview,
} from "@/lib/hooks/useStudentHomeHeroData";

const DEFAULT_THUMB =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200";

function normalizeThumb(url?: string | null) {
    if (!url) return DEFAULT_THUMB;
    return url;
}

function firstName(full: string) {
    const p = full.trim().split(/\s+/)[0];
    return p || full;
}

function getContextMessage(
    dash: {
        streak?: { current?: number };
        weekly_completed_lessons?: number;
        average_progress?: number;
    } | null,
    courseProgress: number,
    hasActiveCourse: boolean
): string {
    const streak = dash?.streak?.current ?? 0;
    const weekly = dash?.weekly_completed_lessons ?? 0;
    const avg = dash?.average_progress ?? 0;

    if (streak >= 7) return `سلسلة ${streak} أيام — استمر! 🔥`;
    if (streak >= 3) return `أنت على سلسلة ${streak} أيام متتالية 🔥`;
    if (hasActiveCourse && courseProgress >= 90) return "أوشكت على إنهاء الدورة — لنكملها 💪";
    if (hasActiveCourse && courseProgress >= 50) return "أداء رائع — واصل للنصف الثاني 🚀";
    if (weekly > 0) return "نشاط ممتاز هذا الأسبوع ✨";
    if (avg > 0 && !hasActiveCourse) return "راجع تقدّمك أو ابدأ مساراً جديداً.";
    if (hasActiveCourse) return "واصل رحلتك — كل خطوة تقربك من هدفك 🚀";
    return "اكتشف دورات جديدة وابنِ مسارك خطوة بخطوة.";
}

const EXTRA_SCENES_POOL: Omit<HeroTabScene, "id">[] = [
    {
        label: "مسارات إضافية",
        headline: "ابنِ مسارك خطوة بخطوة",
        subtitle: "تصنيفات ومسارات تربط الدروس بمخرجات عملية.",
        imageSrc:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600",
        imageAlt: "مسار تعلّم",
        cta: { label: "تصفح الدورات", href: "/courses" },
        secondaryCta: { label: "لوحة التقدّم", href: "/dashboard" },
        badge: "مسار",
    },
    {
        label: "شائع الآن",
        headline: "دورات يختارها المتعلّمون",
        subtitle: "اقتراحات اجتماعية ومراجعات حقيقية — ليس عرضاً عشوائياً.",
        imageSrc:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600",
        imageAlt: "تعلّم جماعي",
        cta: { label: "استكشف الدورات", href: "/courses" },
        badge: "رائج",
    },
];

function toExtraPoolScenes(): HeroTabScene[] {
    return EXTRA_SCENES_POOL.map((s, i) => ({
        ...s,
        id: `auth-pool-${i}`,
    }));
}

export type BuildStudentHeroScenesArgs = {
    continueRows?: ContinueRow[];
    fallbackCourse: FallbackCourse | null;
    recommendedPreview: RecommendedPreview | null;
    dash?: {
        streak?: { current?: number };
        weekly_completed_lessons?: number;
        average_progress?: number;
    } | null;
    userName?: string | null;
};

/**
 * Three primary tabs: Continue learning — Recommended — Your progress.
 * Optional pool for «المزيد».
 */
export function buildStudentHeroScenes({
    continueRows,
    fallbackCourse,
    recommendedPreview,
    dash = null,
    userName,
}: BuildStudentHeroScenesArgs): {
    tabs: HeroTabScene[];
    extraTabScenes: HeroTabScene[];
} {
    const primary = continueRows?.[0];
    const coursePayload = primary?.course;
    const progress = primary?.progress ?? fallbackCourse?.progress ?? 0;

    const title = coursePayload
        ? String((coursePayload as { title?: string }).title ?? "")
        : fallbackCourse?.title ?? "";
    const slug = coursePayload
        ? String((coursePayload as { slug?: string }).slug ?? "")
        : fallbackCourse?.slug ?? "";
    const thumbRaw = coursePayload
        ? ((coursePayload as { thumbnail?: string | null }).thumbnail ?? null)
        : fallbackCourse?.thumbnail_url;
    const mapped = coursePayload ? mapApiCourseToFeaturedCard(coursePayload) : null;
    const thumb = normalizeThumb(mapped?.thumbnail ?? thumbRaw);

    const hasCourse = Boolean(slug);
    const name = userName ? firstName(userName) : "متعلّم";
    const subtitle = getContextMessage(dash ?? null, progress, hasCourse);

    const tabContinue: HeroTabScene = hasCourse
        ? {
              id: "auth-continue",
              label: "واصل التعلّم",
              headline: title,
              subtitle,
              imageSrc: thumb,
              imageAlt: title || "دورة",
              cta: { label: "متابعة التعلّم", href: `/learn/${slug}` },
              secondaryCta: { label: "دوراتي", href: "/dashboard/courses" },
              progress,
              badge: "آخر نشاط",
          }
        : {
              id: "auth-continue",
              label: "واصل التعلّم",
              headline: `مرحباً بعودتك، ${name}`,
              subtitle,
              imageSrc: DEFAULT_THUMB,
              imageAlt: "ابدأ التعلّم",
              cta: { label: "ابدأ التعلّم", href: "/courses" },
              secondaryCta: { label: "تصفح الدورات", href: "/courses" },
              badge: "ترحيب",
          };

    const recSlug = recommendedPreview?.slug ?? "";
    const recTitle = recommendedPreview?.title ?? "موصى لك";
    const recThumb = normalizeThumb(recommendedPreview?.thumbnail);
    const recHint = recommendedPreview?.reason_label;

    const tabRecommended: HeroTabScene = recSlug
        ? {
              id: "auth-rec",
              label: "موصى لك",
              headline: recTitle,
              subtitle:
                  recHint?.trim() ||
                  "بناءً على اهتماماتك ومسار تعلّمك — اقتراح من المنصّة.",
              imageSrc: recThumb,
              imageAlt: recTitle,
              cta: { label: "عرض الدورة", href: `/courses/${recSlug}` },
              secondaryCta: { label: "المزيد من التوصيات", href: "/#discover-recommended" },
              badge: "توصية",
          }
        : {
              id: "auth-rec",
              label: "موصى لك",
              headline: "اقتراحات تلائم مستواك",
              subtitle:
                  "عندما تتوفر توصيات شخصية، ستظهر هنا. يمكنك استكشاف الكتالوج الآن.",
              imageSrc:
                  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600",
              imageAlt: "توصيات",
              cta: { label: "تصفح الدورات", href: "/courses" },
              secondaryCta: { label: "قسم التوصيات", href: "/#discover-recommended" },
              badge: "اكتشاف",
          };

    const avgProg = Math.round(dash?.average_progress ?? 0);
    const progressValue = hasCourse ? progress : avgProg;
    const tabProgress: HeroTabScene = {
        id: "auth-progress",
        label: "تقدّمك",
        headline: hasCourse ? "تقدّمك في الدورة الحالية" : "نظرة على نشاطك",
        subtitle,
        imageSrc: hasCourse ? thumb : DEFAULT_THUMB,
        imageAlt: hasCourse ? title : "التقدّم",
        cta: hasCourse
            ? { label: "متابعة التعلّم", href: `/learn/${slug}` }
            : { label: "لوحة التقدّم", href: "/dashboard" },
        secondaryCta: { label: "تصفح الدورات", href: "/courses" },
        progress: progressValue,
        badge: "إحصائيات",
    };

    return {
        tabs: [tabContinue, tabRecommended, tabProgress],
        extraTabScenes: toExtraPoolScenes(),
    };
}

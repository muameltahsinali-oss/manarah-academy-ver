"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Star, Clock, Users, ArrowLeft, Heart, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

import { useAuth } from "@/lib/hooks/useAuth";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { useEnroll } from "@/lib/hooks/useCoursePlayer";
import { isBackendImageUrl } from "@/lib/utils/image";
import { parsePromoVideoUrl, withAutoplay } from "@/lib/utils/promoVideo";
import { toast } from "sonner";
import { CourseProgressBar } from "@/components/engagement/CourseProgressBar";
import { CoursePromoVideoModal } from "@/components/course/CoursePromoVideoModal";

function truncateText(text: string, max: number): string {
    const t = text.trim();
    if (t.length <= max) {
        return t;
    }
    return t.slice(0, max).trimEnd() + "…";
}

interface CourseHeroProps {
    courseId: number;
    slug: string;
    title: string;
    description: string;
    /** Shown in hero; falls back to truncated full description */
    shortDescription?: string | null;
    promoVideoUrl?: string | null;
    instructor: string;
    rating: string;
    students: string;
    duration: string;
    isEnrolled?: boolean;
    progress?: number;
    price?: number;
    thumbnail?: string | null;
    totalModules?: number;
    totalLessons?: number;
}

export function CourseHero({
    courseId,
    slug,
    title,
    description,
    shortDescription,
    promoVideoUrl,
    instructor,
    rating,
    students,
    duration,
    isEnrolled,
    progress,
    price,
    thumbnail,
    totalModules,
    totalLessons,
}: CourseHeroProps) {
    const { user } = useAuth();
    const router = useRouter();
    const checkoutMutation = useCheckout();
    const enrollMutation = useEnroll();
    const { isInWishlist, addToWishlist, removeFromWishlist, isAdding, isRemoving } = useWishlist();

    const [videoOpen, setVideoOpen] = useState(false);
    const [modalEmbedUrl, setModalEmbedUrl] = useState<string | null>(null);
    const [bgImageOk, setBgImageOk] = useState(true);

    const parsedPromo = useMemo(
        () => (promoVideoUrl ? parsePromoVideoUrl(promoVideoUrl) : null),
        [promoVideoUrl]
    );
    const hasPromo = !!parsedPromo;

    const heroSubtitle = useMemo(() => {
        const short = shortDescription?.trim();
        if (short) {
            return short;
        }
        return truncateText(description || "", 280);
    }, [shortDescription, description]);

    const isWishlisted = isInWishlist(courseId);

    const openPromoModal = () => {
        if (!parsedPromo) {
            return;
        }
        setModalEmbedUrl(withAutoplay(parsedPromo.embedUrl));
        setVideoOpen(true);
    };

    const closePromoModal = () => {
        setVideoOpen(false);
        setModalEmbedUrl(null);
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            toast.error("يرجى تسجيل الدخول أولاً لإضافة الدورة إلى قائمة الرغبات.");
            return;
        }

        try {
            if (isWishlisted) {
                await removeFromWishlist(courseId);
                toast.success("تمت الإزالة من قائمة الرغبات");
            } else {
                await addToWishlist(courseId);
                toast.success("تمت الإضافة إلى قائمة الرغبات");
            }
        } catch {
            toast.error("فشل تحديث قائمة الرغبات");
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            router.push(`/login?redirect=/courses/${slug}`);
            return;
        }

        if (!price || price === 0) {
            try {
                await enrollMutation.mutateAsync(courseId);
                router.push(`/learn/${slug}`);
            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : "فشل الاشتراك في الدورة.";
                toast.error(msg);
            }
            return;
        }

        try {
            await checkoutMutation.mutateAsync(courseId);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "فشل معالجة الطلب.";
            toast.error(msg);
        }
    };

    return (
        <section className="relative w-full border-b border-border bg-background">
            {/* شريط لوني علوي يتوافق مع هوية الموقع */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-1 bg-gradient-to-l from-primary via-accent to-secondary"
                aria-hidden
            />
            <div className="relative min-h-[min(88vh,720px)] md:min-h-[560px] overflow-hidden">
                {/* خلفية بدون صورة: تدرج بألوان العلامة */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/85 to-secondary/70"
                    aria-hidden
                />
                {/* Background visual */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background/0 to-primary/10">
                    {thumbnail && bgImageOk ? (
                        <Image
                            src={thumbnail}
                            alt=""
                            fill
                            className="object-cover opacity-[0.88] saturate-[1.05]"
                            sizes="100vw"
                            priority
                            unoptimized={isBackendImageUrl(thumbnail)}
                            onError={() => setBgImageOk(false)}
                        />
                    ) : null}
                </div>

                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/55 to-primary/20"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/25 to-transparent"
                    aria-hidden
                />

                {/* Bottom content: النصوص pointer-events-none حتى لا يحجب صندوقها الطويل زر المعاينة في المنتصف */}
                <div className="relative z-[6] flex flex-col justify-end min-h-[min(88vh,720px)] md:min-h-[560px] px-6 lg:px-12 pt-28 pb-10 md:pb-14 max-w-7xl mx-auto w-full">
                    <motion.div {...getFadeUp(0, 0.45)} className="max-w-4xl pointer-events-none select-none">
                        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-white/70 mb-4">
                            <span className="px-2 py-1 bg-white/95 text-text border border-border rounded-[4px] font-bold shadow-sm">
                                {slug.toUpperCase().split("-")[0] || "CRS"}-{courseId}
                            </span>
                            <span className="text-white/80">متقدم</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] [text-shadow:0_2px_24px_rgba(15,23,42,0.35)]">
                            {title}
                        </h1>

                        <p className="mt-5 text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed [text-shadow:0_1px_12px_rgba(15,23,42,0.25)]">
                            {heroSubtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6 text-sm font-medium text-white/85">
                            <div className="flex items-center gap-2">
                                <span className="text-white/65">المدرّب:</span>
                                <span className="font-bold text-accent">{instructor}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-white/80">
                                <Star className="w-4 h-4 text-primary/90" />
                                {rating}
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-white/80">
                                <Users className="w-4 h-4 text-primary/90" />
                                {students}
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-white/80">
                                <Clock className="w-4 h-4 text-primary/90" />
                                {duration}
                            </div>
                        </div>

                        {(totalModules || totalLessons) && (
                            <div className="mt-5 inline-flex flex-wrap gap-3 text-xs font-mono text-white/90">
                                {typeof totalModules === "number" && totalModules > 0 && (
                                    <span className="px-2 py-1 rounded-[4px] border border-white/25 bg-white/10 backdrop-blur-sm flex items-center gap-1.5">
                                        <PlayCircle className="w-3.5 h-3.5 text-primary" />
                                        {totalModules} وحدة
                                    </span>
                                )}
                                {typeof totalLessons === "number" && totalLessons > 0 && (
                                    <span className="px-2 py-1 rounded-[4px] border border-white/25 bg-white/10 backdrop-blur-sm flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        {totalLessons} درس
                                    </span>
                                )}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        {...getFadeUp(0.12, 0.45)}
                        className="mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-6 pointer-events-auto"
                    >
                        {isEnrolled ? (
                            <div className="w-full max-w-md p-6 bg-white border border-border rounded-[4px] shadow-sm shadow-secondary/10">
                                <CourseProgressBar
                                    value={typeof progress === "number" ? progress : 0}
                                    showMilestones
                                    showEncouragement
                                    label="نسبة الإنجاز"
                                    className="mb-6"
                                />
                                <Link
                                    href={`/learn/${slug}`}
                                    className="group/btn flex items-center justify-center gap-2 w-full h-11 bg-secondary text-white text-sm font-bold rounded-[4px] transition-colors hover:bg-secondary/90"
                                >
                                    استئناف التعلم
                                    <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl md:text-4xl font-mono font-bold text-white [text-shadow:0_2px_16px_rgba(15,23,42,0.3)]">
                                        {price === 0 ? "مجاناً" : `$${price}`}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={handleEnroll}
                                        disabled={checkoutMutation.isPending}
                                        className="group flex min-w-[200px] items-center justify-center gap-2 h-12 px-8 bg-secondary text-white text-sm font-bold rounded-[4px] transition-all hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-secondary/30"
                                    >
                                        {checkoutMutation.isPending ? "جاري المعالجة..." : "اشترك الآن"}
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    </button>
                                    <button
                                        onClick={handleWishlistToggle}
                                        disabled={isAdding || isRemoving}
                                        className={`w-12 h-12 flex items-center justify-center border rounded-[4px] transition-all bg-white/10 backdrop-blur-sm ${
                                            isWishlisted
                                                ? "border-primary/50 text-primary bg-primary/15"
                                                : "border-white/30 text-white/90 hover:border-primary/60 hover:text-primary"
                                        }`}
                                        title={isWishlisted ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات"}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                                    </button>
                                </div>
                                <p className="text-xs font-mono text-white/60 w-full sm:w-auto">
                                    ضمان استرجاع 14 يوم
                                </p>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* زر المعاينة فوق كل شيء ويُرسم آخراً — لا يُحجب بصندوق النصوص الطويل */}
                {hasPromo && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pb-28 md:pb-36 pointer-events-none">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openPromoModal();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    openPromoModal();
                                }
                            }}
                            className="pointer-events-auto touch-manipulation group flex flex-col items-center gap-4 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary/60"
                        >
                            <span className="relative flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-full bg-primary/25 backdrop-blur-md border-2 border-primary/70 shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/35 group-active:scale-95">
                                <PlayCircle className="w-12 h-12 md:w-14 md:h-14 text-white drop-shadow-md" strokeWidth={1.25} />
                            </span>
                            <span className="text-sm md:text-base font-bold tracking-wide text-white [text-shadow:0_1px_8px_rgba(15,23,42,0.35)]">
                                معاينة الدورة
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <CoursePromoVideoModal
                open={videoOpen}
                onClose={closePromoModal}
                embedUrl={modalEmbedUrl}
                title={title}
            />
        </section>
    );
}

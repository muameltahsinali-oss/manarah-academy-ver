"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Star, Clock, Users, ArrowLeft, Heart, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks/useAuth";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { useEnroll } from "@/lib/hooks/useCoursePlayer";
import { isBackendImageUrl } from "@/lib/utils/image";
import { toast } from "sonner";

interface CourseHeroProps {
    courseId: number;
    slug: string;
    title: string;
    description: string;
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

    const isWishlisted = isInWishlist(courseId);

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
        } catch (error: any) {
            toast.error("فشل تحديث قائمة الرغبات");
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            router.push(`/login?redirect=/courses/${slug}`);
            return;
        }

        // Free course → enroll immediately, then go to player
        if (!price || price === 0) {
            try {
                await enrollMutation.mutateAsync(courseId);
                router.push(`/learn/${slug}`);
            } catch (error: any) {
                toast.error(error.message || "فشل الاشتراك في الدورة.");
            }
            return;
        }

        // Paid course → go through checkout flow
        try {
            await checkoutMutation.mutateAsync(courseId);
        } catch (error: any) {
            toast.error(error.message || "فشل معالجة الطلب.");
        }
    };

    return (
        <section className="w-full border-b border-border/80 pt-20 pb-16 md:pt-32 md:pb-24 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                <motion.div
                    {...getFadeUp(0, 0.5)}
                    className="md:col-span-8 flex flex-col gap-6"
                >
                    <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-text/50">
                        <span className="px-2 py-1 bg-white border border-border/80 rounded-[4px] text-text font-bold">
                            {slug.toUpperCase().split('-')[0] || "CRS"}-{courseId}
                        </span>
                        <span>متقدم</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text leading-[1.1]">
                        {title}
                    </h1>

                    <p className="text-lg md:text-xl text-text/70 max-w-2xl leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-4 text-sm font-medium text-text/60">
                        <div className="flex items-center gap-2">
                            <span className="text-text">المدرّب:</span>
                            <span className="font-bold text-primary">{instructor}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                            <Star className="w-4 h-4 text-text/40" />
                            {rating}
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                            <Users className="w-4 h-4 text-text/40" />
                            {students}
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="w-4 h-4 text-text/40" />
                            {duration}
                        </div>
                    </div>

                    {(totalModules || totalLessons) && (
                        <div className="mt-6 inline-flex flex-wrap gap-3 text-xs font-mono text-text/60">
                            {typeof totalModules === "number" && totalModules > 0 && (
                                <span className="px-2 py-1 rounded-[4px] border border-border bg-white flex items-center gap-1.5">
                                    <PlayCircle className="w-3.5 h-3.5" />
                                    {totalModules} وحدة
                                </span>
                            )}
                            {typeof totalLessons === "number" && totalLessons > 0 && (
                                <span className="px-2 py-1 rounded-[4px] border border-border bg-white flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {totalLessons} درس
                                </span>
                            )}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    {...getFadeUp(0.2, 0.5)}
                    className="md:col-span-4 flex flex-col items-start md:items-end w-full gap-6"
                >
                    {thumbnail && (
                        <div className="w-full md:w-[360px] rounded-[4px] overflow-hidden border border-border/80 bg-background relative aspect-video">
                            <Image
                                src={thumbnail}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 360px"
                                unoptimized={isBackendImageUrl(thumbnail)}
                            />
                        </div>
                    )}

                    {isEnrolled ? (
                        <div className="w-full md:w-auto p-6 bg-white border border-border/80 rounded-[4px] relative group overflow-hidden shadow-sm">
                            <div className="flex justify-between items-end mb-4 relative z-10">
                                <span className="text-sm font-bold">نسبة الإنجاز</span>
                                <span className="font-mono text-xl font-bold text-primary">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-border/40 rounded-full mb-6 relative z-10 overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                />
                            </div>
                            <Link
                                href={`/learn/${slug}`}
                                className="group/btn flex items-center justify-center gap-2 w-full h-11 bg-primary text-white text-sm font-bold rounded-[4px] transition-colors hover:bg-primary/90 relative z-10"
                            >
                                استئناف التعلم
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                            </Link>
                        </div>
                    ) : (
                        <div className="w-full md:w-auto">
                            <div className="text-3xl font-mono font-bold mb-6 md:text-left">
                                {price === 0 ? 'مجاناً' : `$${price}`}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleEnroll}
                                    disabled={checkoutMutation.isPending}
                                    className="group flex flex-1 items-center justify-center gap-2 md:w-64 h-12 bg-secondary text-white text-sm font-bold rounded-[4px] transition-all hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {checkoutMutation.isPending ? "جاري المعالجة..." : "اشترك الآن"}
                                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={isAdding || isRemoving}
                                    className={`w-12 h-12 flex items-center justify-center border border-border/80 rounded-[4px] transition-all ${isWishlisted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-text/40 hover:text-red-500 hover:border-red-200'}`}
                                    title={isWishlisted ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات"}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                            <div className="text-center md:text-left text-xs font-mono text-text/40 mt-3 select-none">
                                ضمان استرجاع 14 يوم
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

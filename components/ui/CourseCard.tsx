"use client";

import { motion } from "framer-motion";
import { Clock, Star, Users, Heart, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { isBackendImageUrl } from "@/lib/utils/image";

const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800";

export interface CourseCardProps {
    id: number;
    slug: string;
    prefix: string;
    title: string;
    description?: string;
    instructor: string;
    duration: string;
    rating: string;
    students: string;
    level: string;
    tag: string;
    thumbnail?: string | null;
    delay?: number;
    /** Short personalized line (e.g. recommendation reason). */
    recommendationHint?: string;
}

export function CourseCard({
    id,
    slug,
    prefix,
    title,
    description,
    instructor,
    duration,
    rating,
    students,
    level,
    tag,
    thumbnail,
    delay = 0,
    recommendationHint,
}: CourseCardProps) {
    const { user } = useAuth();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const isWishlisted = isInWishlist(id);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("يرجى تسجيل الدخول أولاً لإضافة الدورة إلى قائمة الرغبات.");
            return;
        }

        try {
            if (isWishlisted) {
                await removeFromWishlist(id);
                toast.success("تمت الإزالة من قائمة الرغبات");
            } else {
                await addToWishlist(id);
                toast.success("تمت الإضافة إلى قائمة الرغبات");
            }
        } catch (error: any) {
            toast.error("فشل تحديث قائمة الرغبات");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="h-full"
        >
            <Link href={`/courses/${slug}`} className="block h-full border border-border rounded-[4px] overflow-hidden bg-white transition-all duration-300 hover:border-primary md:hover:-translate-y-1 md:hover:shadow-lg md:hover:shadow-primary/10 active:scale-[0.99] cursor-pointer group flex flex-col touch-manipulation">
                <div className="relative w-full aspect-video bg-background shrink-0 overflow-hidden">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized={isBackendImageUrl(thumbnail)}
                            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL; }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <BookOpen className="w-12 h-12 text-primary/40" />
                        </div>
                    )}
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-grow min-w-0">
                <div className="flex justify-between items-start gap-2 mb-3 md:mb-4">
                    <span className="text-xs font-mono font-bold px-2 py-1 bg-background border border-border rounded-[4px] shrink-0">
                        {prefix}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-text/50 uppercase tracking-widest truncate hidden sm:inline">
                            {tag}
                        </span>
                        <button
                            onClick={handleWishlistToggle}
                            className={`p-2 -m-1 rounded-[4px] transition-all touch-manipulation min-h-[2.25rem] min-w-[2.25rem] flex items-center justify-center ${isWishlisted ? 'text-red-500' : 'text-text/20 hover:text-red-500'}`}
                            title={isWishlisted ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات"}
                            aria-label={isWishlisted ? "إزالة من قائمة الرغبات" : "إضافة إلى قائمة الرغبات"}
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {title}
                </h3>

                {recommendationHint && (
                    <p className="text-[11px] font-medium leading-snug text-primary/90 mb-2 line-clamp-2">
                        {recommendationHint}
                    </p>
                )}

                {description && (
                    <p className="text-xs md:text-sm text-text/70 mb-4 md:mb-6 flex-grow line-clamp-2">
                        {description}
                    </p>
                )}
                {!description && <div className="flex-grow"></div>}

                <p className="text-xs md:text-sm text-text/60 mb-4 md:mb-6 font-medium truncate">
                    المدرّب: {instructor}
                </p>

                <div className="pt-3 md:pt-4 border-t border-border grid grid-cols-3 gap-1 md:gap-2 text-[11px] md:text-xs font-mono text-text/60">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                        <Star className="w-3.5 h-3.5" />
                        <span>{rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                        <Users className="w-3.5 h-3.5" />
                        <span>{students}</span>
                    </div>
                </div>
                </div>
            </Link>
        </motion.div>
    );
}

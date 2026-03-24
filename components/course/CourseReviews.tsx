"use client";

import { motion } from "framer-motion";
import { Star, Loader2, MessageSquare, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useReviews, useAddReview } from "@/lib/hooks/useCoursePlayer";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export function CourseReviews() {
    const { slug } = useParams();
    const { user } = useAuth();
    const { data: reviewsRes, isLoading } = useReviews(slug as string);
    const addReviewMutation = useAddReview(slug as string);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const reviews = reviewsRes?.data || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("يرجى تسجيل الدخول للتقييم.");
            return;
        }

        try {
            await addReviewMutation.mutateAsync({ rating, comment });
            toast.success("شكراً لتقييمك!");
            setComment("");
            setRating(5);
        } catch (error: any) {
            toast.error(error.message || "فشل إرسال التقييم.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border/80 gap-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">تقييمات الطلاب</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i <= Number(averageRating) ? 'text-primary fill-primary' : 'text-border'}`}
                                />
                            ))}
                        </div>
                        <span className="font-mono font-bold text-primary mt-1">{averageRating}/5</span>
                        <span className="text-sm font-mono text-text/40 mt-1">({reviews.length} تقييم)</span>
                    </div>
                </div>

                {/* Add Review Button/Trigger could go here or just show the form if enrolled */}
            </div>

            {/* Review Form */}
            {user && (
                <div className="mb-12 p-6 border border-primary/20 bg-primary/5 rounded-[4px]">
                    <h3 className="text-lg font-bold mb-4">أضف تقييمك</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-text/60">تقييمك:</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setRating(i)}
                                        className="p-1 hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${i <= rating ? 'text-primary fill-primary' : 'text-text/20 dark:text-text/10'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="اكتب رأيك في الدورة..."
                            className="w-full h-24 p-4 bg-white border border-border/80 rounded-[4px] text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={addReviewMutation.isPending}
                            className="flex items-center justify-center gap-2 self-end px-6 py-2 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {addReviewMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-dashed border-border/80 rounded-[4px]">
                    <MessageSquare className="w-10 h-10 text-text/10 mb-2" />
                    <p className="text-sm text-text/40 font-medium">لا توجد تقييمات لهذه الدورة حتى الآن.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review: any, idx: number) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                            className="p-6 border border-border/80 rounded-[4px] bg-white group hover:border-primary/30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold">
                                        {review.user?.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">{review.user?.name}</h4>
                                        <span className="text-[10px] font-mono text-text/50">
                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: ar })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < review.rating ? 'text-primary fill-primary' : 'text-border fill-border'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-text/70 leading-relaxed font-medium">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}

            {reviews.length > 6 && (
                <div className="mt-8 text-center md:text-right">
                    <button className="text-sm font-bold text-primary hover:underline transition-colors">
                        عرض المزيد من التقييمات
                    </button>
                </div>
            )}
        </motion.section>
    );
}

"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Heart, Search, BookOpen, Loader2, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { toast } from "sonner";

export default function WishlistPage() {
    const { items, isLoading, removeFromWishlist } = useWishlist();

    const handleRemove = async (courseId: number) => {
        try {
            await removeFromWishlist(courseId);
            toast.success("تمت الإزالة من قائمة الرغبات");
        } catch (error: any) {
            toast.error("فشل في إزالة الدورة");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-3xl font-bold tracking-tight mb-2">قائمة الرغبات</h1>
                <p className="text-sm text-text/60">الدورات التي تعتزم دراستها لاحقاً.</p>
            </motion.div>

            {items.length === 0 ? (
                <motion.div
                    {...getFadeUp(0.1, 0.5)}
                    className="flex flex-col items-center justify-center py-24 text-center border border-border/80 bg-white rounded-[4px]"
                >
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6">
                        <Heart className="w-8 h-8 text-text/20" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">قائمة الرغبات فارغة</h3>
                    <p className="text-sm text-text/60 max-w-md mb-8">
                        تصفح الدورات المتاحة وأضف ما يعجبك هنا للعودة إليه لاحقاً.
                    </p>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-all"
                    >
                        <Search className="w-4 h-4" />
                        استكشف الدورات
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((course, idx) => (
                        <motion.div
                            key={course.id}
                            {...getFadeUp(0.1 + idx * 0.05, 0.4)}
                            className="group bg-white border border-border/80 rounded-[4px] overflow-hidden flex flex-col"
                        >
                            <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                {course.image ? (
                                    <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <BookOpen className="w-12 h-12 text-gray-200" />
                                )}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <button
                                        onClick={() => handleRemove(course.id)}
                                        className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                        title="إزالة"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
                                    {course.name}
                                </h3>
                                <p className="text-text/60 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
                                    {course.description}
                                </p>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                        {course.instructor?.name[0]}
                                    </div>
                                    <span className="text-xs font-mono font-bold text-text/40">{course.instructor?.name}</span>
                                </div>
                                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                                    <span className="text-lg font-mono font-bold text-accent">{course.price ? `${course.price} ر.س` : 'مجاناً'}</span>
                                    <Link
                                        href={`/courses/${course.slug || course.id}`}
                                        className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        عرض التفاصيل
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

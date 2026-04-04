"use client";

import { useRouter } from "next/navigation";
import { Lock, FileQuestion } from "lucide-react";

function SkeletonBlock({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-[4px] bg-border/50 ${className ?? ""}`} />;
}

export function LessonPageLoading() {
    return (
        <div className="flex flex-col w-full pb-20 px-4 md:px-12 max-w-4xl mx-auto pt-6 gap-6" aria-busy="true" aria-label="جاري التحميل">
            <SkeletonBlock className="h-10 w-2/3 max-w-md" />
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="aspect-video w-full" />
            <div className="space-y-3">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-4/6" />
            </div>
        </div>
    );
}

export function LessonPageLocked({ slug }: { slug: string }) {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="p-4 bg-primary/5 rounded-full">
                <Lock className="w-12 h-12 text-primary" aria-hidden />
            </div>
            <div>
                <h2 className="text-xl font-bold text-text mb-2">عذراً، لا يمكنك الوصول لهذه الصفحة</h2>
                <p className="text-sm text-text/60 max-w-md mx-auto">
                    يجب عليك الاشتراك في الدورة أولاً لتتمكن من الوصول إلى المحتوى التعليمي.
                </p>
            </div>
            <button
                type="button"
                onClick={() => router.push(`/courses/${slug}`)}
                className="px-8 py-3 bg-primary text-white font-bold rounded-[4px] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
                الذهاب لصفحة الدورة
            </button>
        </div>
    );
}

export function LessonPageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <FileQuestion className="w-10 h-10 text-text/30" aria-hidden />
            <p className="text-sm font-medium text-text/60">لم يتم العثور على هذا الدرس.</p>
        </div>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";

interface PlayerNextLessonDockProps {
    nextLessonTitle?: string | null;
    nextHref: string | null;
    canNavigate: boolean;
    /** سبب التعطيل (مثلاً: أكمل الدرس الحالي) */
    lockedHint?: string;
}

/**
 * شريط سفلي ثابت (مهم على الجوال) للانتقال للدرس التالي مع نفس قواعد القفل في المنهج.
 */
export function PlayerNextLessonDock({
    nextLessonTitle,
    nextHref,
    canNavigate,
    lockedHint = "أكمل الدرس الحالي للانتقال إلى التالي",
}: PlayerNextLessonDockProps) {
    const router = useRouter();

    if (!nextHref) {
        return null;
    }

    return (
        <div
            className="fixed bottom-0 inset-x-0 z-[35] md:z-[35] border-t border-border/80 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.12)] safe-area-pb md:px-8"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4" dir="rtl">
                <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-text/45 mb-0.5">الدرس التالي</div>
                    <div className="text-sm font-bold text-text truncate">{nextLessonTitle || "درس تالي"}</div>
                </div>
                {canNavigate ? (
                    <button
                        type="button"
                        onClick={() => router.push(nextHref)}
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        متابعة
                        <ChevronLeft className="w-4 h-4" aria-hidden />
                    </button>
                ) : (
                    <div className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-[4px] border border-amber-200 bg-amber-50 text-amber-900 text-xs font-bold max-w-[45%]">
                        <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        <span className="leading-snug">{lockedHint}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

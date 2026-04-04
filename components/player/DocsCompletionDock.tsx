"use client";

interface DocsCompletionDockProps {
    isCompleted: boolean;
    isPending: boolean;
    onConfirm: () => void;
    /** مثلاً `md:hidden` لإظهار الشريط على الجوال فقط */
    className?: string;
}

/**
 * شريط سفلي ثابت يكرر زر «تأكيد الإكمال» للدروس التوثيقية الطويلة.
 */
export function DocsCompletionDock({ isCompleted, isPending, onConfirm, className = "" }: DocsCompletionDockProps) {
    if (isCompleted) {
        return (
            <div
                className={`fixed bottom-0 inset-x-0 z-[35] border-t border-border/80 bg-accent/10 backdrop-blur-md md:px-8 ${className}`}
                style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
            >
                <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center" dir="rtl">
                    <span className="text-sm font-bold text-accent">تم إكمال الدرس ✅</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`fixed bottom-0 inset-x-0 z-[35] border-t border-border/80 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.12)] md:px-8 ${className}`}
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4" dir="rtl">
                <p className="text-xs text-text/60 flex-1 min-w-0">انتهيت من القراءة؟ أكّد الإكمال لفتح الدروس التالية.</p>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isPending}
                    className="shrink-0 px-5 py-2.5 rounded-[4px] bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isPending ? "جاري التأكيد..." : "تأكيد الإكمال"}
                </button>
            </div>
        </div>
    );
}

"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full max-w-md mx-auto text-center px-4">
            <div className="w-16 h-16 rounded-full bg-red-50/50 flex items-center justify-center border border-red-100">
                <AlertOctagon className="w-8 h-8 text-red-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2">عذراً، حدث خطأ غير متوقع!</h2>
                <p className="text-sm text-text/60 leading-relaxed mb-8">
                    للأسف واجهت أنظمتنا مشكلة أثناء معالجة طلبك. التقارير تم إرسالها لفريق التطوير.
                </p>
                <div className="bg-background border border-border/80 p-4 rounded-[4px] text-xs font-mono text-left mb-8 overflow-x-auto" dir="ltr">
                    {error.message || "Unknown Application Error"}
                </div>
                <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-secondary text-white text-sm font-bold rounded-[4px] hover:bg-secondary/90 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    المحاولة مرة أخرى
                </button>
            </div>
        </div>
    );
}

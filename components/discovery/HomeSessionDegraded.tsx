"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/Container";
type HomeSessionDegradedProps = {
    onRetry: () => void;
    isRetrying?: boolean;
    className?: string;
};

/**
 * Session token exists but `/auth/me` failed (non-401). Do not render full guest marketing.
 */
export function HomeSessionDegraded({ onRetry, isRetrying, className }: HomeSessionDegradedProps) {
    return (
        <div className={["min-h-[60vh] bg-background", className].filter(Boolean).join(" ")}>
            <Container className="flex flex-col items-center justify-center py-20">
                <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        {isRetrying ? (
                            <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden />
                        ) : (
                            <RefreshCw className="h-7 w-7 text-primary" aria-hidden />
                        )}
                    </div>
                    <h1 className="text-lg font-bold text-text">تعذّر التحقق من جلستك</h1>
                    <p className="mt-2 text-sm leading-relaxed text-text/65">
                        تحقق من اتصالك بالإنترنت ثم أعد المحاولة. لم نُسجّل خروجك تلقائياً.
                    </p>
                    <button
                        type="button"
                        onClick={() => onRetry()}
                        disabled={isRetrying}
                        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                        {isRetrying ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                جارٍ المحاولة…
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4" aria-hidden />
                                إعادة المحاولة
                            </>
                        )}
                    </button>
                </div>
            </Container>
        </div>
    );
}

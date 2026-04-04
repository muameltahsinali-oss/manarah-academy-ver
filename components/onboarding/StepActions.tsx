'use client';

import { ArrowRight, Loader2 } from 'lucide-react';

export function StepActions({
    canBack,
    onBack,
    onNext,
    nextLabel,
    disabled,
    loading,
}: {
    canBack?: boolean;
    onBack?: () => void;
    onNext: () => void;
    nextLabel: string;
    disabled?: boolean;
    loading?: boolean;
}) {
    return (
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch gap-3">
            <button
                type="button"
                onClick={onNext}
                disabled={disabled || loading}
                className="h-12 px-6 rounded-xl bg-primary text-white font-extrabold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{nextLabel}</span>
                {!loading ? <ArrowRight className="w-4 h-4" /> : null}
            </button>
            {canBack ? (
                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="h-12 px-6 rounded-xl border border-border/80 bg-white text-text font-bold hover:bg-background transition-colors"
                >
                    رجوع
                </button>
            ) : null}
        </div>
    );
}

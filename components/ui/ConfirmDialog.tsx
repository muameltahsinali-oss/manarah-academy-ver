"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "default";
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "تأكيد",
    cancelLabel = "إلغاء",
    variant = "danger",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, onCancel]);

    if (!open) return null;

    const isDanger = variant === "danger";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50"
                aria-hidden
                onClick={onCancel}
            />
            <div
                role="dialog"
                aria-modal
                aria-labelledby="confirm-dialog-title"
                className="relative w-full max-w-md bg-white border border-border/80 rounded-[4px] shadow-xl p-6"
            >
                <div className="flex gap-4 mb-6">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDanger ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 id="confirm-dialog-title" className="text-lg font-bold text-text mb-1">
                            {title}
                        </h2>
                        <p className="text-sm text-text/70 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-bold border border-border/80 rounded-[4px] hover:bg-black/5 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-bold rounded-[4px] transition-colors ${isDanger
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-primary text-white hover:bg-primary/90"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type CoursePromoVideoModalProps = {
    open: boolean;
    onClose: () => void;
    embedUrl: string | null;
    title: string;
};

export function CoursePromoVideoModal({ open, onClose, embedUrl, title }: CoursePromoVideoModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (!open) {
            return;
        }
        document.addEventListener("keydown", handleKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = prev;
        };
    }, [open, handleKey]);

    if (!mounted || typeof document === "undefined") {
        return null;
    }

    const modal = (
        <AnimatePresence>
            {open && embedUrl && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 md:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        aria-label="إغلاق"
                        onClick={onClose}
                    />
                    <motion.div
                        className="relative z-10 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black"
                        initial={{ opacity: 0, scale: 0.94, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ type: "spring", damping: 28, stiffness: 320 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3 bg-black/90 border-b border-white/10">
                            <p className="text-sm font-bold text-white truncate pr-2">{title}</p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
                                aria-label="إغلاق النافذة"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                key={embedUrl}
                                src={embedUrl}
                                title={title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modal, document.body);
}

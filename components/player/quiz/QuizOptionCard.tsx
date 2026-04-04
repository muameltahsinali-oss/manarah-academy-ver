"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export type QuizOptionFeedback =
    | { status: "correct" }
    | { status: "incorrect" };

export function QuizOptionCard({
    optionId,
    text,
    selected,
    onSelect,
    disabled,
    feedback,
}: {
    optionId: string | number;
    text: string;
    selected: boolean;
    onSelect: () => void;
    disabled?: boolean;
    feedback?: QuizOptionFeedback | null;
}) {
    const feedbackRing =
        feedback?.status === "correct"
            ? "border-green-300 bg-green-50/60"
            : feedback?.status === "incorrect"
                ? "border-red-200 bg-red-50/60"
                : "";

    const feedbackText =
        feedback?.status === "correct"
            ? "إجابة صحيحة"
            : feedback?.status === "incorrect"
                ? "إجابة خاطئة"
                : "";

    const FeedbackIcon =
        feedback?.status === "correct" ? Check : feedback?.status === "incorrect" ? X : null;

    return (
        <motion.button
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={text}
            onClick={onSelect}
            disabled={disabled}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            className={[
                "w-full text-right rounded-[10px] border p-4 transition-all duration-200",
                "bg-white hover:shadow-sm hover:shadow-primary/10",
                selected ? "border-primary/50 bg-primary/10" : "border-border/80",
                feedbackRing,
                disabled ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 flex items-center justify-center shrink-0">
                    {FeedbackIcon ? (
                        <FeedbackIcon className="w-4 h-4" />
                    ) : selected ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-border/60" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="text-sm font-bold text-text">{text}</div>
                    {feedback && feedbackText ? (
                        <motion.div
                            key={feedbackText}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className={[
                                "mt-2 text-[11px] font-bold flex items-center gap-2",
                                feedback.status === "correct"
                                    ? "text-green-700"
                                    : "text-red-700",
                            ].join(" ")}
                        >
                            <span className="inline-flex w-1.5 h-1.5 rounded-full bg-current" />
                            {feedbackText}
                        </motion.div>
                    ) : null}
                </div>
            </div>
        </motion.button>
    );
}


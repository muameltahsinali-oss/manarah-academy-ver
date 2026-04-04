"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

type QuestionFeedback = Record<
    string,
    { is_correct: boolean; selected_option_id: string | number | null }
>;

type QuizQuestion = {
    id: number | string;
    title: string;
    options: Array<{ id: number | string; text: string }>;
};

function ConfettiBurst({ active }: { active: boolean }) {
    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7"];

    const pieces = Array.from({ length: 28 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.15;
        const duration = 0.75 + Math.random() * 0.55;
        const rotate = Math.random() * 260 - 130;
        const color = colors[i % colors.length];
        return { key: `c_${i}`, left, delay, duration, rotate, color };
    });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {active &&
                pieces.map((p) => (
                    <motion.div
                        key={p.key}
                        initial={{ y: -10, opacity: 0, x: 0, rotate: 0, scale: 0.9 }}
                        animate={{ y: 140, opacity: 1, x: (Math.random() - 0.5) * 60, rotate: p.rotate, scale: 1 }}
                        transition={{ delay: p.delay, duration: p.duration, ease: "easeOut" }}
                        className="absolute top-0 h-2 w-2 rounded-sm"
                        style={{ left: `${p.left}%`, background: p.color }}
                    />
                ))}
        </div>
    );
}

export function QuizResultScreen({
    scorePercent,
    correctCount,
    total,
    passed,
    passingScore,
    questions,
    questionFeedback,
    onRetry,
    onContinueReview,
    onNextLesson,
    nextLessonHref,
}: {
    scorePercent: number;
    correctCount: number;
    total: number;
    passed: boolean;
    passingScore: number;
    questions: QuizQuestion[];
    questionFeedback: QuestionFeedback;
    onRetry: () => void;
    onContinueReview: () => void;
    onNextLesson: () => void;
    nextLessonHref: string | null;
}) {
    const message = passed ? "Great job 🎉" : "Keep going 💪";
    const primaryIcon = passed ? CheckCircle2 : XCircle;
    const PrimaryIcon = primaryIcon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[4px] border border-border/40 bg-white p-6 md:p-8 shadow-sm"
        >
            <ConfettiBurst active={passed} />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div
                        className={[
                            "w-12 h-12 rounded-[14px] flex items-center justify-center border",
                            passed ? "border-green-200 bg-green-50/60 text-green-700" : "border-red-200 bg-red-50/60 text-red-700",
                        ].join(" ")}
                    >
                        <PrimaryIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-mono font-bold text-text/50 uppercase tracking-widest mb-1">
                            نتيجة الاختبار
                        </div>
                        <div className="text-2xl md:text-3xl font-black tracking-tight text-text leading-tight">
                            {message}
                        </div>
                        <div className="mt-2 text-sm text-text/60">
                            اجتياز المطلوب: {passingScore}%
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end">
                    <div className="text-[56px] leading-[1] font-black text-primary">
                        {Math.round(scorePercent)}%
                    </div>
                    <div className="mt-2 text-sm font-bold text-text/60">
                        {correctCount} / {total} إجابة صحيحة
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold bg-background">
                        <span className={passed ? "text-green-700" : "text-red-700"}>{passed ? "اجتزت ✅" : "لم تجتز ❌"}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40">
                <div className="text-sm font-bold text-text mb-4">ملخص الإجابات</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {questions.map((q) => {
                        const fb = questionFeedback[String(q.id)];
                        const selectedId = fb?.selected_option_id ?? null;
                        const selectedText = q.options.find((o) => String(o.id) === String(selectedId))?.text ?? "—";
                        const isCorrect = !!fb?.is_correct;

                        return (
                            <div
                                key={String(q.id)}
                                className={[
                                    "rounded-[10px] border p-4",
                                    isCorrect
                                        ? "border-green-200 bg-green-50/40"
                                        : "border-red-200 bg-red-50/40",
                                ].join(" ")}
                            >
                                <div className="text-xs font-mono font-bold text-text/50 uppercase tracking-widest mb-1">
                                    سؤال {q.id}
                                </div>
                                <div className="text-sm font-bold text-text leading-snug">
                                    {q.title}
                                </div>
                                <div className="mt-2 text-sm font-bold">
                                    إجابتك:{" "}
                                    <span className={isCorrect ? "text-green-700" : "text-red-700"}>{selectedText}</span>
                                </div>
                                <div className="mt-2 text-[11px] font-bold text-text/60">
                                    {isCorrect ? "صحيحة" : "غير صحيحة"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onRetry}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-[4px] border border-border/80 bg-white hover:bg-black/5 text-sm font-bold text-text"
                >
                    <RotateCcw className="w-4 h-4" />
                    إعادة المحاولة
                </button>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onContinueReview}
                        className="px-5 py-2 rounded-[4px] bg-background border border-border/60 text-sm font-bold hover:bg-black/5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        متابعة الدرس
                    </button>

                    <button
                        type="button"
                        onClick={onNextLesson}
                        disabled={!passed || !nextLessonHref}
                        className="px-6 py-2 rounded-[4px] bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        الذهاب للدرس التالي
                    </button>
                </div>
            </div>
        </motion.div>
    );
}


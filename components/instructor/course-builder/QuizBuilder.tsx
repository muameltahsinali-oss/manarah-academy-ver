"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useUpdateLesson } from "@/lib/hooks/useInstructor";
import { toast } from "sonner";

interface QuizBuilderProps {
    lessonId: number;
    initialConfig: any;
}

type Option = { id: string; text: string };
type Question = { id: string; title: string; options: Option[]; correct_option_id?: string };

export function QuizBuilder({ lessonId, initialConfig }: QuizBuilderProps) {
    const [questions, setQuestions] = useState<Question[]>(
        Array.isArray(initialConfig?.questions)
            ? initialConfig.questions
            : []
    );
    const [passingScore, setPassingScore] = useState<number>(
        typeof initialConfig?.passing_score === "number" ? initialConfig.passing_score : 70
    );

    const { mutateAsync: updateLesson, isPending } = useUpdateLesson();

    const addQuestion = () => {
        const id = `q_${Date.now()}`;
        setQuestions((prev) => [
            ...prev,
            {
                id,
                title: "",
                options: [
                    { id: `${id}_a`, text: "" },
                    { id: `${id}_b`, text: "" },
                ],
            },
        ]);
    };

    const removeQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const updateQuestion = (id: string, data: Partial<Question>) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, ...data } : q))
        );
    };

    const addOption = (questionId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: [...q.options, { id: `${questionId}_${q.options.length + 1}`, text: "" }],
                    }
                    : q
            )
        );
    };

    const updateOption = (questionId: string, optionId: string, text: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt) =>
                            opt.id === optionId ? { ...opt, text } : opt
                        ),
                    }
                    : q
            )
        );
    };

    const setCorrectOption = (questionId: string, optionId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId ? { ...q, correct_option_id: optionId } : q
            )
        );
    };

    const handleSave = async () => {
        try {
            await updateLesson({
                id: lessonId,
                data: {
                    quiz_config: {
                        questions,
                        passing_score: passingScore,
                    },
                },
            });
            toast.success("تم حفظ أسئلة الاختبار");
        } catch (e: any) {
            toast.error(e?.message || "فشل حفظ أسئلة الاختبار");
        }
    };

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-bold text-text">أسئلة الاختبار (اختيار من متعدد)</h4>
                    <p className="text-[11px] text-text/50 mt-1">
                        أضف أسئلة وخيارات، واختر الإجابة الصحيحة لكل سؤال. سيُحسب النجاح بناءً على نسبة الاختيار الصحيح.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-text/60 font-bold">درجة النجاح (%)</span>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        value={passingScore}
                        onChange={(e) => setPassingScore(Number(e.target.value) || 0)}
                        className="w-16 text-xs border border-border/60 rounded-[4px] px-1.5 py-1 text-right"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {questions.map((q, qIdx) => (
                    <div
                        key={q.id}
                        className="border border-border/60 rounded-[4px] p-3 bg-white/80"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <label className="text-xs font-bold text-text/70">
                                سؤال {qIdx + 1}
                            </label>
                            <button
                                type="button"
                                onClick={() => removeQuestion(q.id)}
                                className="p-1 text-text/40 hover:text-red-500 hover:bg-red-50 rounded-[4px]"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <input
                            value={q.title}
                            onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                            className="w-full text-sm border border-border/60 rounded-[4px] px-2 py-1.5 mb-3"
                            placeholder="نص السؤال..."
                        />
                        <div className="space-y-2">
                            {q.options.map((opt, idx) => (
                                <label
                                    key={opt.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="radio"
                                        name={`correct-${q.id}`}
                                        checked={q.correct_option_id === opt.id}
                                        onChange={() => setCorrectOption(q.id, opt.id)}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-[11px] text-text/50 w-6">
                                        {String.fromCharCode(65 + idx)}.
                                    </span>
                                    <input
                                        value={opt.text}
                                        onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                                        className="flex-1 text-sm border border-border/60 rounded-[4px] px-2 py-1"
                                        placeholder="نص الخيار..."
                                    />
                                </label>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addOption(q.id)}
                            className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80"
                        >
                            <PlusCircle className="w-3.5 h-3.5" />
                            إضافة خيار
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 text-xs font-bold text-text hover:text-primary"
            >
                <PlusCircle className="w-4 h-4" />
                إضافة سؤال جديد
            </button>

            <div className="flex justify-end mt-2">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-5 py-1.5 text-xs font-bold rounded-[4px] bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                >
                    {isPending ? "جاري الحفظ..." : "حفظ أسئلة الاختبار"}
                </button>
            </div>
        </div>
    );
}


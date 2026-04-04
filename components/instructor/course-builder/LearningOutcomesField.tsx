"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

export const MAX_LEARNING_OUTCOMES = 10;

/**
 * Dynamic list for course learning outcomes (saved as string[]).
 * Uses react-hook-form field array: `learningOutcomeRows[].value`
 */
export function LearningOutcomesField() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<{ learningOutcomeRows?: { value: string }[] }>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "learningOutcomeRows",
    });

    const canAdd = fields.length < MAX_LEARNING_OUTCOMES;
    const arrayError = errors.learningOutcomeRows as
        | { message?: string; root?: { message?: string } }
        | undefined;

    return (
        <div>
            <label className="block text-sm font-bold text-text mb-2">
                ماذا ستتعلّم؟ <span className="font-normal text-text/50">— اختياري، حتى {MAX_LEARNING_OUTCOMES} نقاط</span>
            </label>
            <p className="text-xs text-text/55 mb-3">
                أضف نتائج تعلّم قصيرة وواضحة؛ تُعرض في صفحة الدورة العامة ضمن قسم &quot;ماذا ستتعلّم؟&quot;. مثال: بناء مشروع كامل، إتقان أداة معيّنة، الاستعداد لمقابلة عمل.
            </p>

            <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                        <input
                            type="text"
                            autoComplete="off"
                            {...register(`learningOutcomeRows.${index}.value` as const)}
                            placeholder={`مثال: نتيجة تعلّم واضحة (${index + 1})`}
                            className={`flex-1 min-w-0 bg-background border rounded-[4px] px-3 py-2.5 text-sm focus:outline-none transition-colors ${
                                errors.learningOutcomeRows?.[index]?.value
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-border/80 focus:border-primary"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="shrink-0 mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-border/80 bg-white text-text/60 hover:text-red-600 hover:border-red-200 transition-colors"
                            aria-label={`حذف النقطة ${index + 1}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {fields.length === 0 && (
                <p className="text-xs text-text/45 mt-1">لم تُضف أي نقاط بعد. اضغط &quot;إضافة نقطة&quot; للبدء.</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    disabled={!canAdd}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-[4px] border border-primary/30 bg-primary/5 text-sm font-bold text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Plus className="h-4 w-4" />
                    إضافة نقطة
                </button>
                <span className="text-xs font-mono text-text/50">
                    {fields.length}/{MAX_LEARNING_OUTCOMES}
                </span>
            </div>

            {arrayError?.message && (
                <span className="text-xs text-red-500 font-bold block mt-2">{arrayError.message}</span>
            )}
            {arrayError?.root?.message && (
                <span className="text-xs text-red-500 font-bold block mt-2">{arrayError.root.message}</span>
            )}
        </div>
    );
}

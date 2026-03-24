"use client";

import { useState } from "react";
import { useUpdateLesson } from "@/lib/hooks/useInstructor";
import { toast } from "sonner";

interface DocsEditorProps {
    lessonId: number;
    initialContent: any;
}

/**
 * محرر توثيق بسيط يعتمد على textarea ويحفظ المحتوى كـ JSON منظم.
 * يمكن استبداله لاحقاً بـ TipTap بسهولة لأننا نخزن JSON في حقل docs_content.
 */
export function DocsEditor({ lessonId, initialContent }: DocsEditorProps) {
    const [value, setValue] = useState<string>(
        typeof initialContent?.html === "string" ? initialContent.html : ""
    );
    const { mutateAsync: updateLesson, isPending } = useUpdateLesson();

    const handleSave = async () => {
        try {
            await updateLesson({
                id: lessonId,
                data: {
                    docs_content: {
                        type: "html",
                        html: value,
                    },
                },
            });
            toast.success("تم حفظ محتوى التوثيق");
        } catch (e: any) {
            toast.error(e?.message || "فشل حفظ محتوى التوثيق");
        }
    };

    return (
        <div className="mt-4 space-y-2">
            <label className="text-xs font-bold text-text/70 block mb-1">
                محتوى الدرس النصي (يمكنك لصق HTML/Markdown حالياً)
            </label>
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full min-h-[180px] text-sm border border-border/70 rounded-[4px] p-3 font-mono bg-white resize-y focus:outline-none focus:border-primary"
                placeholder="اكتب أو الصق المحتوى النصي / HTML هنا..."
            />
            <div className="flex justify-end gap-2 mt-2">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-4 py-1.5 text-xs font-bold rounded-[4px] bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                >
                    {isPending ? "جاري الحفظ..." : "حفظ التوثيق"}
                </button>
            </div>
        </div>
    );
}


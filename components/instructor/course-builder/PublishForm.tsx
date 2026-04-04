import { Loader2, Send, Check } from "lucide-react";
import { useCourseReady, usePublishCourse } from "@/lib/hooks/useInstructor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CheckIcon({ checked, isError = false }: { checked: boolean, isError?: boolean }) {
    return (
        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${isError ? "bg-red-50 border-red-500 text-red-500" :
            checked ? "bg-primary/10 border-primary text-primary" :
                "bg-background border-border text-border"
            }`}>
            <span className="text-[10px] font-mono leading-none">{isError ? "✕" : "✓"}</span>
        </div>
    )
}

export function PublishStep({ isSubmitting, courseId }: { isSubmitting: boolean, courseId: number | null }) {
    const { data: readyRes, isLoading, refetch } = useCourseReady(courseId);
    const publishCourse = usePublishCourse();
    const router = useRouter();

    // `lib/api.ts` إرجاع response.data بالكامل (success/message/data/meta)، لذا الحقول تكون داخل `data`
    const isReady = readyRes?.data?.is_ready ?? false;
    const issues = readyRes?.data?.issues ?? [];

    const handlePublish = async () => {
        if (!courseId) return;
        try {
            await publishCourse.mutateAsync(courseId);
            toast.success("تم نشر الدورة بنجاح! الدورة الآن متاحة للطلاب.");
            router.push('/instructor/courses');
        } catch (error: any) {
            // `lib/api.ts` normalizes errors into `error.errors` (على شكل object)
            const backendIssues = error?.errors?.issues;
            if (Array.isArray(backendIssues) && backendIssues.length > 0) {
                backendIssues.forEach((msg: string) => toast.error(msg));
            } else {
                toast.error(error?.message || "فشل نشر الدورة");
            }
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">المراجعة النهائية للإطلاق</h2>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className={`p-6 border rounded-[4px] ${isReady ? "bg-green-50/50 border-green-200" : "bg-red-50 border-red-100"}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <CheckIcon checked={isReady} isError={!isReady} />
                                حالة جاهزية الدورة: {isReady ? "جاهزة للنشر" : "توجد ملاحظات"}
                            </h3>
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        await refetch();
                                        toast.success("تم تحديث حالة جاهزية الدورة");
                                    } catch (e: any) {
                                        toast.error(e?.message || "فشل تحديث حالة الجاهزية");
                                    }
                                }}
                                className="text-[10px] font-bold text-primary hover:underline"
                            >
                                تحديث الحالة
                            </button>
                        </div>

                        {issues.length > 0 ? (
                            <ul className="flex flex-col gap-3">
                                {issues.map((issue: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs font-medium text-red-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-xs font-medium text-green-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 shrink-0" />
                                    جميع البيانات الأساسية مكتملة.
                                </div>
                                <div className="flex items-center gap-3 text-xs font-medium text-green-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 shrink-0" />
                                    المنهج الدراسي يحتوي على محتوى تعليمي في جميع الدروس.
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-text/60 leading-relaxed border-r-2 border-primary/50 pr-4 py-1">
                        بمجرد ضغطك على "نشر الدورة الآن"، ستكون الدورة متاحة للطلاب للتسجيل، وسيتم تفعيل حسابك كمدرب منشئ تلقائياً في صفحة البحث العامة للمنصة.
                    </p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-border/40 font-mono flex justify-end">
                <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting || !isReady || publishCourse.isPending}
                    className="px-8 py-4 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {publishCourse.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {publishCourse.isPending ? "جاري النشر..." : "نشر الدورة الآن"}
                </button>
            </div>
        </div>
    );
}

import { Loader2, PlusCircle, Layers } from "lucide-react";
import { useState } from "react";
import { useInstructorCourse, useCreateModule, useDeleteModule } from "@/lib/hooks/useInstructor";
import { toast } from "sonner";
import { ModuleItem } from "./ModuleItem";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function CurriculumBuilder({ onNext, courseId }: { onNext: () => void, courseId: number | null }) {
    const { data: courseRes, refetch } = useInstructorCourse(courseId);
    const modules = courseRes?.data?.modules || [];

    const [deleteModuleId, setDeleteModuleId] = useState<number | null>(null);
    const { mutateAsync: createModule, isPending: isAddingModule } = useCreateModule();
    const { mutateAsync: deleteModule, isPending: isDeletingModule } = useDeleteModule();

    const handleAddModule = async () => {
        if (!courseId) {
            toast.error("يرجى حفظ بيانات الدورة الأساسية أولاً");
            return;
        }
        try {
            await createModule({
                course_id: courseId,
                title: "وحدة جديدة",
                order: modules.length
            });
            toast.success("تم إضافة الوحدة بنجاح");
            await refetch();
        } catch (error: any) {
            console.error("Add module error:", error);
            toast.error(error.message || "فشل إضافة الوحدة");
        }
    };

    const handleConfirmDeleteModule = async () => {
        if (deleteModuleId == null) return;
        try {
            await deleteModule(deleteModuleId);
            toast.success("تم حذف الوحدة");
            setDeleteModuleId(null);
            await refetch();
        } catch (error) {
            toast.error("فشل حذف الوحدة");
        }
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h2 className="text-xl font-bold">هيكلة المنهج الدراسي</h2>
                <div className="flex-1 max-w-xs w-full">
                    <button
                        type="button"
                        onClick={handleAddModule}
                        disabled={isAddingModule}
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border/80 rounded-[4px] bg-background hover:bg-primary/5 hover:border-primary/40 transition-all group w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAddingModule ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4 text-text/40 group-hover:text-primary transition-colors" />}
                        إضافة وحدة جديدة
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {modules.map((module: any, idx: number) => (
                    <ModuleItem
                        key={module.id}
                        module={module}
                        isExpanded={idx === 0}
                        onDelete={() => setDeleteModuleId(module.id)}
                        onUpdate={() => refetch()}
                        isDeleting={isDeletingModule}
                    />
                ))}
                <ConfirmDialog
                    open={deleteModuleId != null}
                    title="حذف الوحدة التعليمية"
                    message="هل أنت متأكد من حذف هذه الوحدة وجميع الدروس فيها؟ لا يمكن التراجع عن هذا الإجراء."
                    confirmLabel="حذف الوحدة"
                    cancelLabel="إلغاء"
                    variant="danger"
                    onConfirm={handleConfirmDeleteModule}
                    onCancel={() => setDeleteModuleId(null)}
                />
                {modules.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-border rounded-[4px] bg-background/30">
                        <Layers className="w-12 h-12 text-border mx-auto mb-4" />
                        <p className="text-text/50 text-sm">ابدأ بإضافة أول وحدة تعليمية لمنهجك الدراسي.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-border/40 font-mono flex justify-end">
                <button type="button" onClick={onNext} className="px-6 py-3 bg-secondary text-white text-sm font-bold rounded-[4px] hover:bg-secondary/90 transition-colors">
                    متابعة للتسعير
                </button>
            </div>
        </div>
    );
}

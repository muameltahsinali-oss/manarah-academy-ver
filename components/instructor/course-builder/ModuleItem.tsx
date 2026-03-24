import { useState } from "react";
import { Layers, Edit2, Trash2, ChevronDown, PlusCircle, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateModule, useCreateLesson, useDeleteLesson } from "@/lib/hooks/useInstructor";
import { toast } from "sonner";
import { LessonItem } from "./LessonItem";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function ModuleItem({ module, isExpanded: defaultExpanded = false, onDelete, onUpdate, isDeleting }: { module: any, isExpanded?: boolean, onDelete: () => void, onUpdate: () => void, isDeleting?: boolean }) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(module.title);
    const [deleteLessonId, setDeleteLessonId] = useState<number | null>(null);

    const { mutateAsync: updateModule, isPending: isUpdatingModule } = useUpdateModule();
    const { mutateAsync: createLesson, isPending: isAddingLesson } = useCreateLesson();
    const { mutateAsync: deleteLesson, isPending: isDeletingLesson } = useDeleteLesson();

    const handleSaveTitle = async () => {
        try {
            await updateModule({ id: module.id, data: { title } });
            setIsEditing(false);
            await onUpdate();
            toast.success("تم تحديث عنوان الوحدة");
        } catch (error) {
            toast.error("فشل تحديث عنوان الوحدة");
        }
    };

    const handleAddLesson = async () => {
        try {
            await createLesson({
                module_id: module.id,
                title: "درس جديد",
                lesson_type: "video",
                // keep legacy "type" in sync for backward compatibility
                type: "video",
                order: module.lessons ? module.lessons.length : 0
            });
            await onUpdate();
            toast.success("تم إضافة الدرس بنجاح");
        } catch (error: any) {
            toast.error(error.message || "فشل إضافة الدرس");
        }
    };

    const handleConfirmDeleteLesson = async () => {
        if (deleteLessonId == null) return;
        try {
            await deleteLesson(deleteLessonId);
            toast.success("تم حذف الدرس");
            setDeleteLessonId(null);
            onUpdate();
        } catch (error) {
            toast.error("فشل حذف الدرس");
        }
    };

    return (
        <div className="border border-border/80 rounded-[4px] overflow-hidden bg-white transition-all shadow-sm">
            <div className="flex items-center justify-between bg-background border-b border-border/40 group">
                <div className="flex-1 flex items-center gap-3 p-4">
                    <Layers className="w-4 h-4 text-text/50 shrink-0" />
                    {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white border border-primary px-2 py-1 text-sm font-bold rounded-[4px] w-full outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                            />
                            <button onClick={handleSaveTitle} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                            <button onClick={() => { setIsEditing(false); setTitle(module.title); }} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <span className="font-bold text-sm truncate">{module.title}</span>
                    )}
                </div>

                <div className="flex items-center gap-1 px-4">
                    {!isEditing && (
                        <>
                            <button onClick={() => setIsEditing(true)} className="p-2 text-text/40 hover:text-primary hover:bg-primary/5 rounded transition-colors opacity-0 group-hover:opacity-100"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={onDelete} disabled={isDeleting} className="p-2 text-text/40 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
                        </>
                    )}
                    <div className="w-px h-4 bg-border/40 mx-2" />
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-4 text-text/50 hover:text-text"
                    >
                        <span className="text-xs font-mono">{module.lessons?.length || 0} دروس</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 flex flex-col gap-2">
                            {module.lessons?.map((lesson: any) => (
                                <LessonItem
                                    key={lesson.id}
                                    lesson={lesson}
                                    onDelete={() => setDeleteLessonId(lesson.id)}
                                    onUpdate={onUpdate}
                                />
                            ))}
                            <ConfirmDialog
                                open={deleteLessonId != null}
                                title="حذف الدرس"
                                message="هل أنت متأكد من حذف هذا الدرس؟ لا يمكن التراجع عن هذا الإجراء."
                                confirmLabel="حذف الدرس"
                                cancelLabel="إلغاء"
                                variant="danger"
                                onConfirm={handleConfirmDeleteLesson}
                                onCancel={() => setDeleteLessonId(null)}
                            />

                            <button
                                type="button"
                                onClick={handleAddLesson}
                                className="flex items-center justify-center gap-2 p-3 mt-2 border border-dashed border-border text-text hover:border-primary hover:text-primary hover:bg-primary/5 rounded-[4px] text-sm font-bold transition-all w-full"
                            >
                                {isAddingLesson ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                                إضافة درس جديد
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

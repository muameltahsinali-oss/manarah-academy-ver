"use client";

import { useState } from "react";
import { Link as LinkIcon, FileText, ExternalLink, Trash2, PlusCircle, Edit2, Check, X, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { useCreateLessonResource, useDeleteLessonResource, useUpdateLessonResource, useReorderLessonResources } from "@/lib/hooks/useInstructor";
import { toast } from "sonner";

type ResourceItem = { id: number; title: string; type: string; url?: string | null; download_url?: string | null; order?: number };

export function ResourceBuilder({ lessonId, resources, onUpdate }: { lessonId: number; resources: ResourceItem[]; onUpdate: () => void }) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState<"link" | "file" | "pdf">("link");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const createResource = useCreateLessonResource();
    const updateResource = useUpdateLessonResource();
    const deleteResource = useDeleteLessonResource();
    const reorderResources = useReorderLessonResources(lessonId);

    const handleAddLink = async () => {
        if (!title.trim() || !url.trim()) {
            toast.error("يرجى إدخال العنوان والرابط");
            return;
        }
        try {
            await createResource.mutateAsync({
                lessonId,
                data: { title: title.trim(), type: "link", url: url.trim() },
            });
            toast.success("تم إضافة المرفق");
            setIsAdding(false);
            setTitle("");
            setUrl("");
            setType("link");
            onUpdate();
        } catch (e: any) {
            toast.error(e?.message || "فشل إضافة المرفق");
        }
    };

    const handleAddFile = async () => {
        if (!title.trim() || !file) {
            toast.error("يرجى إدخال العنوان واختيار الملف");
            return;
        }
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("type", type);
        formData.append("file", file);
        try {
            await createResource.mutateAsync({ lessonId, formData });
            toast.success("تم رفع الملف بنجاح");
            setIsAdding(false);
            setTitle("");
            setFile(null);
            onUpdate();
        } catch (e: any) {
            toast.error(e?.message || "فشل رفع الملف");
        }
    };

    const handleSaveEdit = async (id: number) => {
        if (!editTitle.trim()) return;
        try {
            await updateResource.mutateAsync({ id, data: { title: editTitle.trim() } });
            toast.success("تم تحديث العنوان");
            setEditingId(null);
            onUpdate();
        } catch (e: any) {
            toast.error(e?.message || "فشل التحديث");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteResource.mutateAsync(id);
            toast.success("تم حذف المرفق");
            onUpdate();
        } catch (e: any) {
            toast.error(e?.message || "فشل الحذف");
        }
    };

    const handleMove = async (index: number, direction: "up" | "down") => {
        const newOrder = [...resources].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((r) => r.id);
        const i = direction === "up" ? index - 1 : index + 1;
        if (i < 0 || i >= newOrder.length) return;
        [newOrder[index], newOrder[i]] = [newOrder[i], newOrder[index]];
        try {
            await reorderResources.mutateAsync(newOrder);
            toast.success("تم تغيير الترتيب");
            onUpdate();
        } catch (e: any) {
            toast.error(e?.message || "فشل تغيير الترتيب");
        }
    };

    const sortedResources = [...resources].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return (
        <div className="flex flex-col gap-3">
            {sortedResources.map((res, index) => (
                <div
                    key={res.id}
                    className="flex items-center gap-2 p-3 bg-white border border-border/60 rounded-[4px] hover:border-text/20 transition-colors group"
                >
                    <div className="flex flex-col shrink-0 text-text/40">
                        <button
                            type="button"
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0}
                            className="p-0.5 hover:text-primary disabled:opacity-30"
                            title="تحريك لأعلى"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleMove(index, "down")}
                            disabled={index === sortedResources.length - 1}
                            className="p-0.5 hover:text-primary disabled:opacity-30"
                            title="تحريك لأسفل"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded bg-primary/5 flex items-center justify-center text-primary/60 shrink-0">
                            {res.type === "link" ? <LinkIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                        </div>
                        {editingId === res.id ? (
                            <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="flex-1 px-2 py-1 text-xs border border-primary rounded-[4px] outline-none"
                                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(res.id)}
                                    autoFocus
                                />
                                <button type="button" onClick={() => handleSaveEdit(res.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                    <Check className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => { setEditingId(null); }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="text-xs font-bold truncate">{res.title}</span>
                                <a
                                    href={res.type === "link" ? res.url ?? "#" : res.download_url ?? "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline shrink-0"
                                    title={res.type === "link" ? "فتح الرابط" : "تحميل"}
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </>
                        )}
                    </div>
                    {editingId !== res.id && (
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={() => { setEditingId(res.id); setEditTitle(res.title); }}
                                className="p-1.5 text-text/40 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                                title="تعديل العنوان"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(res.id)}
                                className="p-1.5 text-text/20 hover:text-red-500 transition-colors"
                                title="حذف"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {!isAdding ? (
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="flex items-center justify-center gap-2 p-3 border border-dashed border-border text-xs font-bold text-text/50 hover:text-primary hover:border-primary/40 rounded-[4px] transition-all"
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    إضافة رابط أو رفع ملف
                </button>
            ) : (
                <div className="p-4 bg-white border border-primary/20 rounded-[4px] flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="عنوان المرفق"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-background border border-border/80 px-3 py-2 text-xs rounded-[4px] outline-none focus:border-primary transition-colors"
                        />
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as "link" | "file" | "pdf")}
                            className="bg-background border border-border/80 px-3 py-2 text-xs rounded-[4px] outline-none"
                        >
                            <option value="link">رابط خارجي</option>
                            <option value="pdf">ملف PDF</option>
                            <option value="file">ملف (مستند، ZIP، ...)</option>
                        </select>
                    </div>
                    {type === "link" ? (
                        <input
                            placeholder="رابط المصدر (URL)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-background border border-border/80 px-3 py-2 text-xs font-mono rounded-[4px] outline-none focus:border-primary transition-colors"
                            dir="ltr"
                        />
                    ) : (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-text/70">اختر الملف (PDF, ZIP, DOC, XLS, TXT, CSV — حد أقصى 50 ميجا)</label>
                            <input
                                type="file"
                                accept=".pdf,.zip,.doc,.docx,.xls,.xlsx,.txt,.csv"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                className="text-xs file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:font-bold"
                            />
                            {file && <span className="text-xs text-text/60">{file.name}</span>}
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => { setIsAdding(false); setTitle(""); setUrl(""); setFile(null); }}
                            className="px-3 py-1.5 text-xs font-bold text-text/40 hover:text-text transition-colors"
                        >
                            إلغاء
                        </button>
                        {type === "link" ? (
                            <button
                                type="button"
                                onClick={handleAddLink}
                                disabled={createResource.isPending}
                                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-[4px] hover:bg-primary/90 transition-colors shadow-none disabled:opacity-50 flex items-center gap-2"
                            >
                                {createResource.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                حفظ المرفق
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAddFile}
                                disabled={createResource.isPending || !file}
                                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-[4px] hover:bg-primary/90 transition-colors shadow-none disabled:opacity-50 flex items-center gap-2"
                            >
                                {createResource.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                رفع الملف
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

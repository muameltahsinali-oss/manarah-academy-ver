import { useState } from "react";
import { Video, FileText, Check, X, Edit2, Trash2, ChevronDown, UploadCloud, Paperclip, HelpCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateLesson } from "@/lib/hooks/useInstructor";
import { toast } from "sonner";
import { VideoUpload } from "@/components/instructor/VideoUpload";
import { ResourceBuilder } from "./ResourceBuilder";
import { DocsEditor } from "./DocsEditor";
import { QuizBuilder } from "./QuizBuilder";

const lessonTypeLabels: Record<string, string> = {
    video: "فيديو",
    documentation: "توثيق",
    quiz: "اختبار",
};

function lessonTypeLabel(type: string): string {
    return lessonTypeLabels[type] || type || "درس";
}

export function LessonItem({ lesson, onDelete, onUpdate }: { lesson: any; onDelete: () => void; onUpdate: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState(lesson.title);
    const [localType, setLocalType] = useState<string>(lesson.lesson_type || lesson.type || "video");

    const { mutateAsync: updateLesson } = useUpdateLesson();

    const handleSaveTitle = async () => {
        try {
            await updateLesson({ id: lesson.id, data: { title } });
            setIsEditing(false);
            onUpdate();
            toast.success("تم تحديث عنوان الدرس");
        } catch {
            toast.error("فشل تحديث عنوان الدرس");
        }
    };

    const handleChangeType = async (newType: "video" | "documentation" | "quiz") => {
        setLocalType(newType);
        try {
            await updateLesson({
                id: lesson.id,
                data: {
                    lesson_type: newType,
                    // إبقاء حقل type القديم متوافقاً مؤقتاً
                    type: newType === "documentation" ? "document" : newType,
                },
            });
            onUpdate();
            toast.success("تم تحديث نوع الدرس");
        } catch {
            toast.error("فشل تحديث نوع الدرس");
            setLocalType(lesson.lesson_type || lesson.type || "video");
        }
    };

    return (
        <div className="flex flex-col border border-border/40 rounded-[4px] bg-white group hover:border-text/30 transition-colors shadow-sm overflow-hidden">
            <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => !isEditing && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <div
                        className="w-8 h-8 rounded border border-border/80 bg-background flex items-center justify-center text-text/50 shrink-0"
                        title={lessonTypeLabel(localType)}
                    >
                        {localType === "video" && <Video className="w-4 h-4" />}
                        {localType === "quiz" && <HelpCircle className="w-4 h-4" />}
                        {localType === "documentation" && <BookOpen className="w-4 h-4" />}
                        {!["video", "quiz", "documentation"].includes(localType) && <FileText className="w-4 h-4" />}
                    </div>
                    {isEditing ? (
                        <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white border border-primary px-2 py-1 text-sm font-bold rounded-[4px] w-full outline-none"
                                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                            />
                            <button onClick={handleSaveTitle} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setTitle(lesson.title);
                                }}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 flex-1" onClick={(e) => e.stopPropagation()}>
                            <span className="text-sm font-medium truncate flex-1">{lesson.title}</span>
                            <select
                                value={localType}
                                onChange={(e) => handleChangeType(e.target.value as "video" | "documentation" | "quiz")}
                                className="text-xs border border-border/60 rounded-[4px] px-2 py-1 bg-white text-text/80"
                            >
                                <option value="video">فيديو</option>
                                <option value="documentation">توثيق</option>
                                <option value="quiz">اختبار</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {!isEditing && (
                        <>
                            {localType === "video" && (lesson.has_video || lesson.media_id) && (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded mr-2 border border-green-200">
                                    فيديو مرفوع
                                </span>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                                className="p-2 text-text/40 hover:text-primary hover:bg-primary/5 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="p-2 text-text/40 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-px h-4 bg-border/40 mx-2" />
                            <ChevronDown className={`w-4 h-4 text-text/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && !isEditing && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/40 bg-background/50 p-4"
                    >
                        {localType === "video" && (
                            <>
                                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 mt-2">
                                    <UploadCloud className="w-4 h-4 text-primary" />
                                    محتوى الدرس (فيديو)
                                </h4>
                                <VideoUpload
                                    lessonId={lesson.id}
                                    courseId={lesson.module_id}
                                    currentVideoUrl={lesson.has_video || lesson.media_id ? "uploaded" : null}
                                    onUploadComplete={onUpdate}
                                />

                                <div className="h-px bg-border/40 my-6" />
                            </>
                        )}

                        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-primary" />
                            المرفقات والمصادر الخارجية
                        </h4>
                        <ResourceBuilder lessonId={lesson.id} resources={lesson.resources || []} onUpdate={onUpdate} />

                        {localType === "documentation" && (
                            <DocsEditor lessonId={lesson.id} initialContent={lesson.docs_content} />
                        )}

                        {localType === "quiz" && (
                            <QuizBuilder lessonId={lesson.id} initialConfig={lesson.quiz_config} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


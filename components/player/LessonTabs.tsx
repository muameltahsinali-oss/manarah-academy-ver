"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { usePlayer } from "./PlayerContext";
import { readLessonNotes, writeLessonNotes } from "@/lib/player/lessonNotesStorage";
import { useCourseData } from "@/lib/hooks/useCoursePlayer";
import { useParams } from "next/navigation";
import { Link as LinkIcon, FileDown, Loader2 } from "lucide-react";
import api from "@/lib/api";

const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "notes", label: "ملاحظات" },
    { id: "resources", label: "المصادر" },
];

function LessonResourcesList({ resources }: { resources: Array<{ id: number; title: string; type: string; url?: string | null; download_url?: string | null }> }) {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const handleDownload = async (res: { id: number; title: string; download_url?: string | null }) => {
        if (!res.download_url) return;
        setDownloadingId(res.id);
        try {
            const blob = await api.get(res.download_url, { responseType: "blob" }) as Blob;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = res.title || "resource";
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            window.open(res.download_url!, "_blank");
        } finally {
            setDownloadingId(null);
        }
    };

    const handleOpenLink = (url: string | null | undefined) => {
        if (url) window.open(url, "_blank", "noopener,noreferrer");
    };

    if (!resources?.length) {
        return (
            <div className="text-text/50 text-sm p-6 bg-white border border-border/40 rounded-[4px]">
                لا توجد مصادر إضافية لهذا الدرس.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {resources.map((res: any) => (
                <div
                    key={res.id}
                    className="flex items-center justify-between p-4 border border-border/60 rounded-[4px] hover:border-primary/40 transition-colors bg-white gap-4"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {res.type === "link" ? (
                            <LinkIcon className="w-5 h-5 text-primary shrink-0" />
                        ) : (
                            <FileDown className="w-5 h-5 text-primary shrink-0" />
                        )}
                        <span className="text-sm font-medium text-text/80 truncate">{res.title}</span>
                    </div>
                    {res.type === "link" ? (
                        <button
                            type="button"
                            onClick={() => handleOpenLink(res.url)}
                            className="shrink-0 px-3 py-1.5 text-xs font-bold text-primary border border-primary/40 rounded-[4px] hover:bg-primary/5 transition-colors"
                        >
                            فتح الرابط
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleDownload(res)}
                            disabled={downloadingId === res.id}
                            className="shrink-0 px-3 py-1.5 text-xs font-bold text-primary border border-primary/40 rounded-[4px] hover:bg-primary/5 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {downloadingId === res.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                            تحميل
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

function LessonNotesEditor({ slug, lessonId }: { slug: string; lessonId: number | null }) {
    const [text, setText] = useState("");
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (lessonId == null) return;
        setText(readLessonNotes(slug, lessonId));
    }, [slug, lessonId]);

    const handleChange = (v: string) => {
        setText(v);
        if (lessonId == null) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            writeLessonNotes(slug, lessonId, v);
        }, 450);
    };

    if (lessonId == null) {
        return <p className="text-text/50 text-sm">اختر درساً لكتابة الملاحظات.</p>;
    }

    return (
        <div className="space-y-2">
            <textarea
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full min-h-[180px] rounded-[4px] border border-border/80 bg-background px-4 py-3 text-sm text-text focus:outline-none focus:border-primary resize-y leading-relaxed"
                placeholder="اكتب ملاحظاتك لهذا الدرس… تُحفظ محلياً على هذا الجهاز فقط."
                dir="rtl"
                aria-label="ملاحظات الدرس"
            />
            <p className="text-[11px] text-text/45">تُحفظ تلقائياً في المتصفح — خاصة بهذا الجهاز.</p>
        </div>
    );
}

export function LessonTabs() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const { currentLessonId } = usePlayer();
    const params = useParams();
    const slug = params.slug as string;
    const { data: courseRes } = useCourseData(slug);

    const currentLesson = courseRes?.data?.modules
        ?.flatMap((m: any) => m.lessons)
        ?.find((l: any) => Number(l.id) === currentLessonId);

    return (
        <div className="w-full mt-12 mb-16 text-right" dir="rtl">
            {/* Tab Navigation */}
            <div className="flex items-center gap-6 md:gap-8 border-b border-border/80">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-4 text-sm font-bold transition-colors ${activeTab === tab.id ? "text-primary" : "text-text/60 hover:text-text"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="lesson-tab-underline"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-[2px]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="mt-8 min-h-[200px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {activeTab === "overview" && (
                            <div className="prose prose-sm max-w-none text-text/80 leading-relaxed shadow-sm p-6 bg-white border border-border/40 rounded-[4px]">
                                <h3 className="text-lg font-bold text-text mb-4">عن هذا الدرس</h3>
                                {currentLesson?.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                                ) : (
                                    <p className="text-text/50 italic">لا يوجد وصف متاح لهذا الدرس حالياً.</p>
                                )}
                            </div>
                        )}
                        {activeTab === "notes" && (
                            <div className="p-6 bg-white border border-border/40 rounded-[4px]">
                                <h3 className="text-lg font-bold text-text mb-4">ملاحظاتك</h3>
                                <LessonNotesEditor slug={slug} lessonId={currentLessonId} />
                            </div>
                        )}
                        {activeTab === "resources" && (
                            <LessonResourcesList resources={currentLesson?.resources ?? []} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

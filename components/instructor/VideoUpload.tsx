"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Film, CheckCircle2, AlertCircle, Loader2, X, Play } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import * as tus from "tus-js-client";
import { useLessonMedia } from "@/lib/hooks/useCoursePlayer";
import { HlsPlayer } from "@/components/player/HlsPlayer";

interface VideoUploadProps {
    lessonId: number;
    courseId: number;
    onUploadComplete?: () => void;
    currentVideoUrl?: string | null;
}

export function VideoUpload({ lessonId, courseId, onUploadComplete, currentVideoUrl }: VideoUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const tusUploadRef = useRef<tus.Upload | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith("video/")) {
            toast.error("يرجى اختيار ملف فيديو صالح");
            return;
        }

        setFile(selectedFile);
        setStatus("idle");
        setProgress(0);
        setErrorMessage("");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;

        if (!droppedFile.type.startsWith("video/")) {
            toast.error("يرجى إفلات ملف فيديو صالح");
            return;
        }

        setFile(droppedFile);
        setStatus("idle");
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setStatus("uploading");
            setErrorMessage("");
            setProgress(0);

            // Step 1: Request upload metadata from our backend
            const res = await api.post(`/instructor/lessons/${lessonId}/video/request`) as any;

            // Handle both wrapped and unwrapped responses from the axios interceptor
            const data = res?.data || res;
            const { video_id, library_id, signature, expire } = data;

            if (!video_id || !library_id || !signature || !expire) {
                throw new Error("بيانات رفع Bunny.net غير مكتملة. تحقق من إعدادات السيرفر.");
            }

            // Step 2: Initialize TUS upload directly to Bunny.net
            const upload = new tus.Upload(file, {
                endpoint: "https://video.bunnycdn.com/tusupload",
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    AuthorizationSignature: signature,
                    AuthorizationExpire: expire.toString(),
                    LibraryId: library_id.toString(),
                    VideoId: video_id,
                },
                metadata: {
                    filetype: file.name.split('.').pop() || 'mp4',
                    title: file.name,
                },
                onError: (error) => {
                    console.error("TUS error:", error);
                    setStatus("error");
                    setErrorMessage("فشل الرفع إلى الخادم الموزع. يرجى المحاولة لاحقاً.");
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
                    setProgress(percentage);
                },
                onSuccess: async () => {
                    // Step 3: Confirm with our backend
                    try {
                        await api.post(`/instructor/lessons/${lessonId}/video/confirm`);
                        setStatus("success");
                        toast.success("تم رفع فيديو الـ Streaming بنجاح");
                        if (onUploadComplete) onUploadComplete();
                    } catch (err) {
                        setStatus("error");
                        setErrorMessage("تم رفع الملف ولكن فشل تأكيده في النظام.");
                    }
                },
            });

            tusUploadRef.current = upload;
            upload.start();

        } catch (error: any) {
            console.error("Upload preparation error:", error);
            setStatus("error");
            setErrorMessage(error.message || "فشل بدء عملية الرفع. تأكد من إعدادات Bunny.net");
        }
    };

    const cancelUpload = () => {
        if (tusUploadRef.current) {
            tusUploadRef.current.abort();
            tusUploadRef.current = null;
        }
        setFile(null);
        setStatus("idle");
        setProgress(0);
    };

    const hasVideo = status === "success" || currentVideoUrl;
    const { data: mediaData, isLoading: isLoadingMedia, isFetched: isMediaFetched } = useLessonMedia(hasVideo ? lessonId : null);
    const playbackUrl = mediaData?.playback_url ?? null;
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPreviewOpen(false);
        };
        if (previewOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [previewOpen]);

    if (hasVideo) {
        return (
            <div className="w-full space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-primary/5 border border-primary/20 rounded-[4px] shadow-sm">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">بث الفيديو (Streaming) جاهز</p>
                            <p className="text-xs opacity-80">يتم الآن معالجة الجودات المتعددة في الخلفية.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {playbackUrl && (
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(true)}
                                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-white bg-white hover:bg-primary border border-primary/20 p-2 px-4 rounded transition-all duration-300 shadow-sm"
                            >
                                <Play className="w-4 h-4" />
                                معاينة
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => { setFile(null); setStatus("idle"); }}
                            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-white bg-white hover:bg-primary border border-primary/20 p-2 px-4 rounded transition-all duration-300 shadow-sm"
                        >
                            تغيير الفيديو
                        </button>
                    </div>
                </div>

                {/* معاينة الفيديو الحالي */}
                {playbackUrl && (
                    <div className="rounded-[4px] border border-border/80 overflow-hidden bg-black/5">
                        <p className="text-xs font-bold text-text/70 px-3 py-2 border-b border-border/40 bg-background/50">
                            معاينة الفيديو الحالي
                        </p>
                        <div className="aspect-video bg-black relative">
                            <HlsPlayer
                                url={playbackUrl}
                                onError={(msg) => toast.error(msg)}
                            />
                        </div>
                    </div>
                )}

                {hasVideo && isLoadingMedia && (
                    <div className="flex items-center justify-center gap-2 py-8 rounded-[4px] border border-border/80 bg-background/50">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-sm text-text/60">جاري تحميل المعاينة...</span>
                    </div>
                )}

                {hasVideo && !isLoadingMedia && !playbackUrl && isMediaFetched && (
                    <div className="py-6 text-center text-sm text-text/50 rounded-[4px] border border-border/80 bg-background/50">
                        لا يمكن تحميل رابط التشغيل. تأكد من اكتمال معالجة الفيديو وجرب المعاينة لاحقاً.
                    </div>
                )}

                {/* نافذة المعاينة الكاملة */}
                {previewOpen && playbackUrl && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
                        <button
                            type="button"
                            onClick={() => setPreviewOpen(false)}
                            className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="إغلاق المعاينة"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                            <HlsPlayer
                                url={playbackUrl}
                                onError={(msg) => {
                                    toast.error(msg);
                                    setPreviewOpen(false);
                                }}
                            />
                        </div>
                        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/80">
                            اضغط Esc أو زر الإغلاق للخروج
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full">
            {!file ? (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border/80 rounded-[4px] bg-background hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <UploadCloud className="w-10 h-10 text-text/40 group-hover:text-primary mb-2 transition-all group-hover:scale-110" />
                    <p className="text-sm font-bold text-text/70 mb-1">انقر أو اسحب ملف الفيديو هنا</p>
                    <p className="text-[10px] text-text/40 font-mono tracking-wider uppercase">Streaming optimized (HLS)</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="video/*"
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="border border-border/80 rounded-[4px] p-6 shadow-xl bg-white relative overflow-hidden">
                    {status === "uploading" && (
                        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300 animate-pulse" style={{ width: `${progress}%` }} />
                    )}

                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg items-center justify-center flex shrink-0 border border-primary/20 shadow-inner">
                                <Film className="w-6 h-6 text-primary" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{file.name}</p>
                                <p className="text-[10px] text-text/40 font-mono uppercase tracking-tighter">{(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR CDN</p>
                            </div>
                        </div>

                        <button onClick={cancelUpload} className="p-2 hover:bg-red-50 text-text/40 hover:text-red-500 rounded-full transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {status === "uploading" && (
                        <div className="mb-6 space-y-2">
                            <div className="flex justify-between text-[11px] font-mono font-bold">
                                <span className="text-primary flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    جاري الرفع إلى CDN...
                                </span>
                                <span className="text-primary">{progress}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-border/20 rounded-full overflow-hidden p-0.5 border border-border/10">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="mb-6 space-y-3">
                            <div className="flex items-start gap-3 text-sm font-bold text-red-600 p-4 bg-red-50 border border-red-100 rounded-[4px]">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{errorMessage}</p>
                            </div>
                            <p className="text-xs text-text/60">يمكنك إلغاء الرفع وتغيير الملف، أو إعادة المحاولة بنفس الملف.</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4 flex-wrap">
                        {status === "error" && (
                            <button
                                type="button"
                                onClick={() => { setStatus("idle"); setErrorMessage(""); setProgress(0); }}
                                className="px-6 py-2.5 border border-border/80 text-sm font-bold rounded hover:bg-black/5 transition-colors"
                            >
                                إعادة المحاولة
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={status === "uploading"}
                            className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {status === "uploading" ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> الرفع مستمر...</>
                            ) : (
                                "تفعيل البث المباشر (Start Streaming)"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

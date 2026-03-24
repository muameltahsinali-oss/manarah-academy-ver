"use client";

import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Image from "next/image";
import { isBackendImageUrl } from "@/lib/utils/image";

const API_BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api") : "";

function buildStorageUrl(path: string): string {
    const origin = API_BASE.replace(/\/api\/?$/, "");
    return `${origin}/storage/${path.replace(/^\/+/, "")}`;
}

interface ImageUploadProps {
    value?: string | null;
    onChange: (url: string) => void;
    collection?: string;
}

export function ImageUpload({ value, onChange, collection = "course_thumbnails" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // local object URL before upload completes
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const displayUrl = previewUrl || value || null;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("يرجى اختيار ملف صورة صالح");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("حجم الصورة يجب أن لا يتجاوز 5 ميجابايت");
            return;
        }

        const previousValue = value || null;
        let objectUrl: string | null = null;

        try {
            objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("collection", collection);

            const token = Cookies.get("auth_token");
            const res = await axios.post(API_BASE + "/media", formData, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                withCredentials: true,
            });

            const body = res.data;
            const inner = body?.data ?? body;
            const serverUrl =
                inner?.url ??
                (inner?.file_path ? buildStorageUrl(inner.file_path) : null);
            if (!serverUrl || typeof serverUrl !== "string") {
                console.error("Media response:", body);
                toast.error("لم يُرجع الخادم رابط الصورة");
                setPreviewUrl(null);
                onChange(previousValue ?? "");
                return;
            }
            setPreviewUrl(null);
            onChange(serverUrl);
            toast.success("تم رفع الصورة بنجاح");
        } catch (error: any) {
            const errData = error.response?.data;
            let msg = errData?.message ?? error?.message ?? "حدث خطأ أثناء رفع الصورة.";
            if (errData?.errors && typeof errData.errors === "object") {
                const first = Object.values(errData.errors).flat()[0];
                if (first) msg = String(first);
            }
            toast.error(msg);
            setPreviewUrl(null);
            onChange(previousValue ?? "");
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;

        // Manually trigger the select handling
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(droppedFile);
            fileInputRef.current.files = dataTransfer.files;

            // Dispatch change event
            const event = new Event('change', { bubbles: true });
            fileInputRef.current.dispatchEvent(event);
        }
    };

    if (displayUrl) {
        return (
            <div className="relative rounded-[4px] overflow-hidden border border-border/80 group aspect-video w-full max-w-md bg-background flex items-center justify-center">
                <Image
                    src={displayUrl}
                    alt="صورة الغلاف"
                    fill
                    className="object-cover"
                    unoptimized={displayUrl.startsWith("blob:") || isBackendImageUrl(displayUrl)}
                    onError={() => {
                        setPreviewUrl(null);
                        if (displayUrl?.startsWith("blob:")) onChange("");
                    }}
                />
                {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="flex flex-col items-center text-white">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-sm font-bold">جاري الرفع...</span>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            setPreviewUrl(null);
                            onChange("");
                        }}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-border/80 rounded-[4px] bg-background hover:bg-primary/5 hover:border-primary/40 transition-all ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"}`}
        >
            {isUploading ? (
                <div className="flex flex-col items-center text-primary">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-sm font-bold">جاري الرفع...</span>
                </div>
            ) : (
                <>
                    <ImageIcon className="w-10 h-10 text-text/40 group-hover:text-primary mb-2 transition-colors" />
                    <p className="text-sm font-bold text-text/70 mb-1">انقر أو اسحب الصورة هنا</p>
                    <p className="text-xs text-text/40 font-mono">JPG, PNG (الحد الأقصى 5MB)</p>
                </>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
            />
        </div>
    );
}

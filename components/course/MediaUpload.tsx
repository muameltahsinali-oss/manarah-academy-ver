"use client";

import { useState } from "react";
import { Upload, X, File, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFadeIn } from "@/lib/motion";

interface MediaUploadProps {
    onUploadComplete?: (media: any) => void;
    accept?: string;
}

export function MediaUpload({ onUploadComplete, accept = "video/*" }: MediaUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            // In a real implementation, this would trigger the upload mutation
        }
    };

    return (
        <div className="w-full">
            {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border/80 rounded-[4px] bg-background hover:bg-black/5 hover:border-black/20 cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-text/40 mb-3" />
                        <p className="mb-2 text-sm font-bold">انقر أو اسحب الملف هنا</p>
                        <p className="text-xs text-text/40 font-mono tracking-tight">{accept} (حتى 100MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="p-4 border border-border/80 rounded-[4px] bg-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 rounded-[4px] flex items-center justify-center text-primary">
                            <File className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                            <p className="text-[10px] text-text/40 font-mono uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span className="text-xs font-mono font-bold">{progress}%</span>
                            </div>
                        ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <button
                            onClick={() => setFile(null)}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-text/40" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

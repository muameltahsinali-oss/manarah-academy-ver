"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

/** مسافة: تشغيل/إيقاف — فقط عندما لا يكون التركيز في حقل إدخال */
function useVideoKeyboardToggle(videoRef: React.RefObject<HTMLVideoElement | null>, enabled: boolean) {
    useEffect(() => {
        if (!enabled) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.code !== "Space") return;
            const el = e.target as HTMLElement | null;
            if (
                el &&
                (el.tagName === "INPUT" ||
                    el.tagName === "TEXTAREA" ||
                    el.tagName === "SELECT" ||
                    (el as HTMLElement).isContentEditable)
            ) {
                return;
            }
            const v = videoRef.current;
            if (!v) return;
            e.preventDefault();
            if (v.paused) {
                void v.play();
            } else {
                v.pause();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [enabled, videoRef]);
}

interface HlsPlayerProps {
    url: string;
    onError?: (message: string) => void;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export function HlsPlayer({ url, onError, videoRef: externalRef }: HlsPlayerProps) {
    const internalRef = useRef<HTMLVideoElement>(null);
    const videoRef = externalRef ?? internalRef;
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);
    const onErrorRef = useRef<HlsPlayerProps["onError"]>(onError);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useVideoKeyboardToggle(videoRef, true);

    useEffect(() => {
        setError(null);
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        const handleError = (msg: string) => {
            setError(msg);
            onErrorRef.current?.(msg);
        };

        if (Hls.isSupported()) {
            hls = new Hls({
                startLevel: -1,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
            });
            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            handleError("فشل تحميل الفيديو. تحقق من الاتصال وحاول مرة أخرى.");
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls?.recoverMediaError();
                            break;
                        default:
                            handleError("حدث خطأ أثناء تشغيل الفيديو.");
                    }
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            video.addEventListener("error", () => {
                handleError("فشل تحميل الفيديو.");
            });
        } else {
            handleError("المتصفح لا يدعم تشغيل هذا الفيديو.");
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [url, retryKey]);

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black/90 text-white p-6 text-center">
                <p className="text-sm font-medium">{error}</p>
                <button
                    type="button"
                    onClick={() => setRetryKey((k) => k + 1)}
                    className="text-xs font-bold text-primary hover:underline"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <video
            ref={videoRef}
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
            onError={() => setError("حدث خطأ أثناء تشغيل الفيديو.")}
        />
    );
}

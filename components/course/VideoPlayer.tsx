"use client";

import { useEffect, useRef } from "react";
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // This is a shell for a custom video player. 
    // In Phase 6, we'll decide on Video.js vs Plyr. 
    // For now, using standard HTML5 with custom styling.

    return (
        <div className="relative aspect-video bg-black rounded-[4px] overflow-hidden group">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                controls
            />
            {/* Overlay controls can be implemented later with Plyr or Video.js */}
        </div>
    );
}

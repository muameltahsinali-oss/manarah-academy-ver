'use client';

import { Loader2 } from 'lucide-react';

export function SkeletonLoader() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <div className="h-6 w-48 rounded-xl bg-border/60 animate-pulse" />
                <div className="h-8 w-28 rounded-xl bg-border/60 animate-pulse" />
            </div>

            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-border/80 bg-white p-5 flex gap-5 animate-pulse"
                >
                    <div className="w-10 h-10 rounded-full bg-border/60" />
                    <div className="flex-1">
                        <div className="h-4 w-72 rounded-lg bg-border/60 mb-3" />
                        <div className="h-3 w-[90%] rounded-lg bg-border/60 mb-2" />
                        <div className="h-3 w-[70%] rounded-lg bg-border/60 mb-2" />
                        <div className="h-2.5 w-28 rounded-lg bg-border/60 mt-4" />
                    </div>
                </div>
            ))}

            {/* Keep loader2 import referenced in case you want spinner later */}
            <span className="sr-only">
                <Loader2 />
            </span>
        </div>
    );
}


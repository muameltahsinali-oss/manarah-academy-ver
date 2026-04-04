'use client';

import { motion } from 'framer-motion';

export function ProgressHeader({ step, totalSteps }: { step: number; totalSteps: number }) {
    const progress = ((step - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-text/60">تهيئة حسابك</div>
                <div className="px-3 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-extrabold font-mono">
                    {step}/{totalSteps}
                </div>
            </div>
            <div className="h-2 rounded-full bg-border/70 overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

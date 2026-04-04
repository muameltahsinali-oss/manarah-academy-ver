'use client';

import { Bell, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-2xl border border-border/80 bg-white p-10 text-center"
        >
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-text">أنت متابع كل شيء 🎉</h3>
            <p className="mt-2 text-sm text-text/60 max-w-md mx-auto">
                لا توجد إشعارات جديدة حالياً. استمر بالتعلم وستصلتك تحديثات مهمة هنا.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border/80 text-text/60 text-xs font-mono">
                <Bell className="w-4 h-4" />
                الإشعارات ستظهر تلقائياً عند توفرها
            </div>
        </motion.div>
    );
}


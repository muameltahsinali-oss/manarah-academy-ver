'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ComponentType } from 'react';

type IconType = ComponentType<{ className?: string }>;

export const selectCardItemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

export function SelectCard({
    title,
    description,
    icon: Icon,
    active,
    onClick,
}: {
    title: string;
    description: string;
    icon: IconType;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            type="button"
            variants={selectCardItemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            onClick={onClick}
            className={[
                'w-full rounded-xl border text-right p-4 transition-all duration-200',
                active
                    ? 'border-primary/45 bg-primary/10 shadow-[0_8px_24px_-16px_rgba(255,107,87,0.65)]'
                    : 'border-border/80 bg-white hover:border-primary/30 hover:bg-primary/5',
            ].join(' ')}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-background border border-border/70 text-primary flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                        </span>
                        <span className="font-bold text-text">{title}</span>
                    </div>
                    <p className="mt-2 text-xs text-text/60">{description}</p>
                </div>
                <span
                    className={[
                        'w-6 h-6 rounded-full border flex items-center justify-center mt-0.5',
                        active ? 'border-primary bg-primary text-white' : 'border-border/80 text-transparent',
                    ].join(' ')}
                >
                    <Check className="w-3.5 h-3.5" />
                </span>
            </div>
        </motion.button>
    );
}

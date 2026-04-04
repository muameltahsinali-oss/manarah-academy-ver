"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

type TabItemProps = {
    id: string;
    label: string;
    isActive: boolean;
    onSelect: (id: string) => void;
    variants?: Variants;
};

export function TabItem({ id, label, isActive, onSelect, variants }: TabItemProps) {
    const reduce = useReducedMotion();

    return (
        <motion.button
            type="button"
            variants={variants}
            onClick={() => onSelect(id)}
            className={`relative flex min-h-[44px] shrink-0 items-center gap-2 rounded-t-lg px-3.5 py-2 text-left text-xs font-bold transition-colors md:min-h-[40px] md:px-4 md:text-[13px] ${
                isActive
                    ? "z-[1] bg-white/95 text-text shadow-[0_-1px_0_0_rgba(255,255,255,1)] ring-1 ring-primary/20"
                    : "bg-white/40 text-text/55 hover:bg-white/75 hover:text-text/85"
            }`}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            aria-selected={isActive}
            role="tab"
            id={`hero-tab-${id}`}
            aria-controls={`hero-tabpanel-${id}`}
        >
            <span className="max-w-[8.5rem] truncate md:max-w-[11rem]">{label}</span>
            {isActive && (
                <motion.span
                    layoutId="hero-tab-active-glow"
                    className="pointer-events-none absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-gradient-to-l from-primary to-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
            )}
        </motion.button>
    );
}

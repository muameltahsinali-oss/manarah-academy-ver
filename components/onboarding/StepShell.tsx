'use client';

import type { ReactNode } from 'react';

export function StepShell({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-border/80 bg-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)] p-5 sm:p-7 md:p-8">
            <div className="mb-7 text-right">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-text">{title}</h2>
                <p className="mt-2 text-sm text-text/60">{subtitle}</p>
            </div>
            {children}
        </div>
    );
}

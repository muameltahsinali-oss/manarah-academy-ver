'use client';

import { motion } from 'framer-motion';
import { Award, MessageSquare, ShieldAlert } from 'lucide-react';
import type { ComponentType } from 'react';

type NotificationKind = 'system' | 'course' | 'achievement' | 'social';

export interface NotificationItemData {
    id: number;
    title: string;
    message: string;
    created_at?: string;
    isUnread: boolean;
    type?: NotificationKind | string;
}

const KIND_ICON: Record<string, ComponentType<{ className?: string }>> = {
    system: ShieldAlert,
    achievement: Award,
    course: MessageSquare,
    social: MessageSquare,
};

function formatRelativeTime(input?: string): string {
    if (!input) return '';
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return '';

    const diffMs = Date.now() - date.getTime();
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);

    try {
        const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
        if (sec < 60) return rtf.format(-sec, 'second');
        if (min < 60) return rtf.format(-min, 'minute');
        if (hour < 24) return rtf.format(-hour, 'hour');
        if (day < 30) return rtf.format(-day, 'day');
    } catch {
        // Fallback to simple output if Intl fails
    }

    if (sec < 60) return `${sec}s ago`;
    if (min < 60) return `${min}m ago`;
    if (hour < 24) return `${hour}h ago`;
    return `${day}d ago`;
}

export function NotificationItem({
    notification,
    highlighted,
    onMarkRead,
}: {
    notification: NotificationItemData;
    highlighted?: boolean;
    onMarkRead: (id: number) => void;
}) {
    const Icon = KIND_ICON[notification.type ?? 'course'] ?? MessageSquare;

    return (
        <motion.button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            className={[
                'w-full text-right rounded-2xl border p-5 transition-colors',
                notification.isUnread
                    ? 'bg-primary/5 border-primary/20 hover:border-primary/30'
                    : 'bg-white border-border/80 hover:bg-background/50 hover:border-border/90',
                highlighted ? 'ring-1 ring-primary/40' : '',
            ].join(' ')}
        >
            <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                    <div
                        className={[
                            'w-10 h-10 rounded-xl flex items-center justify-center border',
                            notification.isUnread
                                ? 'bg-primary/10 border-primary/30 text-primary'
                                : 'bg-background border-border text-text/50',
                        ].join(' ')}
                    >
                        <Icon className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className={`text-base font-bold ${notification.isUnread ? 'text-text' : 'text-text/80'}`}>
                            {notification.title}
                        </h3>
                        {notification.isUnread ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-1.5" title="غير مقروء" />
                        ) : null}
                    </div>

                    <p
                        className={`mt-2 text-sm leading-relaxed ${
                            notification.isUnread ? 'text-text/80' : 'text-text/60'
                        }`}
                    >
                        {notification.message}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-text/40">
                            {formatRelativeTime(notification.created_at)}
                        </span>
                        {notification.isUnread ? (
                            <span className="text-[11px] text-primary font-bold">اضغط لقراءة</span>
                        ) : (
                            <span className="text-[11px] text-text/40 font-mono">تمت قراءته</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.button>
    );
}


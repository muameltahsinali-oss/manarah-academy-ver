'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/lib/api';
import { useStudentNotifications } from '@/lib/hooks/useDashboard';
import { EmptyState } from './EmptyState';
import { NotificationItem, type NotificationItemData } from './NotificationItem';
import { SkeletonLoader } from './SkeletonLoader';

function mapBackendTypeToKind(type?: string): NotificationItemData['type'] {
    if (!type) return 'course';

    if (type === 'badge') return 'achievement';
    if (type === 'enrollment') return 'course';
    if (type === 'certificate') return 'achievement';

    return 'system';
}

export function NotificationsPanel() {
    const queryClient = useQueryClient();
    const { data: res, isLoading, error } = useStudentNotifications();

    const mappedFromApi = useMemo<NotificationItemData[]>(() => {
        const apiNotifications = res?.data?.notifications ?? [];
        return apiNotifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            created_at: n.created_at,
            isUnread: n.read_at == null,
            type: mapBackendTypeToKind(n.type),
        }));
    }, [res]);

    const [items, setItems] = useState<NotificationItemData[]>([]);
    const unreadCount = useMemo(() => items.filter((n) => n.isUnread).length, [items]);
    const [newlyAddedIds, setNewlyAddedIds] = useState<Set<number>>(() => new Set());
    const prevIdsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        const nextIds = new Set(mappedFromApi.map((n) => n.id));
        const prevIds = prevIdsRef.current;
        const added = new Set<number>();

        for (const id of nextIds) {
            if (!prevIds.has(id)) added.add(id);
        }

        prevIdsRef.current = nextIds;
        setItems(mappedFromApi);
        setNewlyAddedIds(added);

        if (added.size > 0) {
            const t = window.setTimeout(() => setNewlyAddedIds(new Set()), 1800);
            return () => window.clearTimeout(t);
        }

        return undefined;
    }, [mappedFromApi]);

    const markAsReadMutation = useMutation({
        mutationFn: (id: number) => post<any>(`/notifications/${id}/read`),
        onMutate: async (id: number) => {
            const prev = items;

            setItems((curr) =>
                curr.map((n) => (n.id === id ? { ...n, isUnread: false } : n)),
            );

            // return context for rollback
            return { prev };
        },
        onError: (_err, _id, ctx) => {
            if (!ctx) return;
            setItems(ctx.prev);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
            // Local state will be refreshed from API via useEffect.
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => post<any>('/notifications/read-all'),
        onMutate: async () => {
            const prev = items;
            setItems((curr) => curr.map((n) => ({ ...n, isUnread: false })));
            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            if (!ctx) return;
            setItems(ctx.prev);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
        },
    });

    const handleMarkRead = (id: number) => {
        const target = items.find((n) => n.id === id);
        if (!target || !target.isUnread) return;
        markAsReadMutation.mutate(id);
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-6 md:py-8">
            <motion.div
                {...{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.4, ease: 'easeOut' },
                }}
                className="flex items-end justify-between gap-4 mb-6"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">الإشعارات</h1>
                    <p className="mt-1 text-sm text-text/60">آخر التحديثات المهمة لرحلتك.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-extrabold font-mono">
                        {unreadCount} غير مقروء
                    </div>
                    <button
                        type="button"
                        onClick={() => markAllAsReadMutation.mutate()}
                        disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
                        className="hidden sm:inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-border/80 bg-white text-text font-bold hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-4 h-4 text-primary" />
                        تحديد الكل كمقروء
                    </button>
                </div>
            </motion.div>

            <div className="rounded-2xl border border-border/80 bg-white p-4 md:p-5">
                {isLoading ? (
                    <SkeletonLoader />
                ) : error ? (
                    <EmptyState />
                ) : items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <motion.div layout className="flex flex-col gap-3">
                        {items.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                highlighted={newlyAddedIds.has(n.id)}
                                onMarkRead={handleMarkRead}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}


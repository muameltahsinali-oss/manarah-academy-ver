"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getFadeUp, getFadeIn } from "@/lib/motion";
import { useState } from "react";
import { Bell, ShieldAlert, Award, MessageSquare } from "lucide-react";

type Tab = "all" | "unread" | "system";

export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    isUnread: boolean;
    type: "system" | "course" | "achievement" | "social";
}
import { useStudentNotifications } from "@/lib/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export function NotificationsClient() {
    const { data: res, isLoading } = useStudentNotifications();
    const notifications: Notification[] = res?.data || [];
    const [activeTab, setActiveTab] = useState<Tab>("all");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const filtered = notifications.filter(n => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return n.isUnread;
        if (activeTab === "system") return n.type === "system";
        return true;
    });

    const markAllAsRead = () => {
        // UI only simulation
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)} className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">الإشعارات</h1>
                    <p className="text-sm text-text/60">آخر التحديثات وتنبيهات النظام.</p>
                </div>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary font-bold hover:underline"
                >
                    تحديد الكل كمقروء
                </button>
            </motion.div>

            {/* Tabs */}
            <motion.div {...getFadeUp(0.1, 0.4)} className="flex gap-2 border-b border-border/80 pb-px">
                <TabButton isActive={activeTab === "all"} onClick={() => setActiveTab("all")}>الكل</TabButton>
                <TabButton isActive={activeTab === "unread"} onClick={() => setActiveTab("unread")}>غير مقروءة</TabButton>
                <TabButton isActive={activeTab === "system"} onClick={() => setActiveTab("system")}>النظام</TabButton>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    {...getFadeIn(0, 0.3)}
                    className="flex flex-col border border-border/80 bg-white rounded-[4px]"
                >
                    {filtered.length === 0 ? (
                        <div className="p-12 text-center text-text/50">
                            لا توجد إشعارات لعرضها في هذا القسم.
                        </div>
                    ) : (
                        filtered.map((notification, idx) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                isLast={idx === filtered.length - 1}
                            />
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function TabButton({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 border-b-2 transition-colors font-bold text-sm ${isActive ? "border-primary text-primary" : "border-transparent text-text/60 hover:text-text hover:border-border"
                }`}
        >
            {children}
        </button>
    );
}

function NotificationItem({ notification, isLast }: { notification: Notification, isLast: boolean }) {
    const Icon =
        notification.type === "system" ? ShieldAlert :
            notification.type === "achievement" ? Award :
                MessageSquare;

    return (
        <div className={`p-6 flex gap-6 hover:bg-background/50 transition-colors ${!isLast ? "border-b border-border/80" : ""}`}>
            <div className="shrink-0 mt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${notification.isUnread ? "bg-primary/5 text-primary border-primary/20" : "bg-background text-text/50 border-border"
                    }`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-base font-bold ${notification.isUnread ? "text-text" : "text-text/80"}`}>
                        {notification.title}
                    </h3>
                    {notification.isUnread && (
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" title="غير مقروء" />
                    )}
                </div>
                <p className={`text-sm mb-3 leading-relaxed max-w-2xl ${notification.isUnread ? "text-text/80" : "text-text/60"}`}>
                    {notification.message}
                </p>
                <div className="text-[10px] font-mono uppercase tracking-widest text-text/40">
                    {notification.time}
                </div>
            </div>
        </div>
    );
}

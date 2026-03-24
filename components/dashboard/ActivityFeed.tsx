"use client";

import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle, Lock, Loader2, Ghost } from "lucide-react";
import { useStudentDashboard } from "@/lib/hooks/useDashboard";

export function ActivityFeed() {
    const { data: res, isLoading } = useStudentDashboard();
    const activitiesData = res?.data?.recent_activities || [];

    if (isLoading) {
        return (
            <div className="w-full bg-white border border-border/80 rounded-[4px] p-8 flex justify-center items-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="w-full bg-white border border-border/80 rounded-[4px] p-4 md:p-6 lg:p-8"
        >
            <h2 className="text-base md:text-lg font-bold tracking-tight mb-4 md:mb-6">الأنشطة الأخيرة</h2>

            {activitiesData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Ghost className="w-8 h-8 text-text/20 mb-3" />
                    <p className="text-sm text-text/40">لا توجد أنشطة مسجلة بعد. ابدأ رحلة التعلم اليوم!</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {activitiesData.map((activity: any, idx: number) => {
                        const Icon = activity.status === 'completed' ? CheckCircle2 : activity.status === 'active' ? PlayCircle : Lock;
                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + (idx * 0.1) }}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 border-b border-border/40 last:border-0 transition-colors ${activity.status === 'active' ? 'bg-primary/5' : 'hover:bg-background/50'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${activity.status === 'completed' ? 'text-primary' :
                                        activity.status === 'active' ? 'text-accent' :
                                            'text-text/40'
                                        }`} />
                                    <div>
                                        <h3 className={`font-bold text-sm ${activity.status === 'locked' ? 'text-text/60' : 'text-text'}`}>
                                            {activity.title}
                                        </h3>
                                        <p className="text-xs text-text/50 mt-1">{activity.course}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium sm:text-left ${activity.status === 'active' ? 'text-accent' : 'text-text/40'
                                    }`}>
                                    {activity.time}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

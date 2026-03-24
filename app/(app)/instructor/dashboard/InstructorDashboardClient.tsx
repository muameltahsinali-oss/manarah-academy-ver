"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { DollarSign, BookOpen, Users, TrendingUp, Presentation, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInstructorDashboard } from "@/lib/hooks/useInstructor";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function InstructorDashboardClient() {
    const { data: res, isLoading } = useInstructorDashboard();
    const stats = res?.data;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 w-full mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-3xl font-bold tracking-tight mb-2">لوحة التحكم</h1>
                <p className="text-sm text-text/60">نظرة عامة على أداء دوراتك وعوائدك المالية.</p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard delay={0.1} icon={DollarSign} label="إجمالي الأرباح" value={stats?.total_earnings || 0} isCurrency isTrending />
                <StatCard delay={0.2} icon={BookOpen} label="الدورات النشطة" value={stats?.active_courses_count || 0} />
                <StatCard delay={0.3} icon={Users} label="إجمالي الطلاب" value={stats?.total_students_count || 0} isTrending />
                <StatCard delay={0.4} icon={Presentation} label="معدل الإكمال" value={stats?.completion_rate || 0} suffix="%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recharts Area Chart for Weekly Enrollments */}
                <motion.div
                    {...getFadeUp(0.5, 0.5)}
                    className="lg:col-span-2 border border-border/80 bg-white rounded-[4px] p-6 lg:p-8 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-lg font-bold">تسجيلات الطلاب (أسبوعيًا)</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary rounded-[4px] font-bold">مباشر</span>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.weekly_enrollments || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B57" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#FF6B57" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }}
                                    dy={10}
                                    tickFormatter={(str: string) => {
                                        const date = new Date(str);
                                        return date.toLocaleDateString('ar-EG', { weekday: 'short' });
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#FF6B57"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#enrollmentGradient)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Activity List */}
                <motion.div
                    {...getFadeUp(0.6, 0.5)}
                    className="border border-border/80 bg-white rounded-[4px] p-6 lg:p-8 shadow-sm"
                >
                    <h2 className="text-lg font-bold mb-8">نشاطات الطُلاب الدورية</h2>
                    <div className="flex flex-col gap-6 relative">
                        {/* Vertical connecting line */}
                        <div className="absolute right-3.5 top-2 bottom-6 w-px bg-border/80" />

                        {stats?.recent_activities?.map((activity: any, idx: number) => (
                            <ActivityItem
                                key={idx}
                                time={activity.time}
                                text={activity.message}
                                isPrimary={idx === 0}
                            />
                        ))}
                        {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="text-sm text-text/40 italic">لا توجد نشاطات حديثة.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

/* =========================================================================
   UI HELPERS
   ========================================================================= */

function StatCard({ delay, icon: Icon, label, value, suffix = "", isCurrency = false, isTrending = false }: {
    delay: number, icon: any, label: string, value: number, suffix?: string, isCurrency?: boolean, isTrending?: boolean
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (value === 0) {
            setCount(0);
            return;
        }
        const step = value / 30; // 30 frames
        let current = 0;
        const interval = setInterval(() => {
            current += step;
            if (current >= value) {
                setCount(value);
                clearInterval(interval);
            } else {
                setCount(Math.ceil(current));
            }
        }, 16);
        return () => clearInterval(interval);
    }, [value]);

    return (
        <motion.div
            {...getFadeUp(delay, 0.5)}
            className="border border-border/80 bg-white rounded-[4px] p-6 relative overflow-hidden group shadow-sm"
        >
            <div className="absolute -left-6 -top-6 text-primary/5 transition-transform group-hover:scale-110 duration-500">
                <Icon className="w-24 h-24" />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-text/50 font-bold">{label}</span>
                {isTrending && <TrendingUp className="w-4 h-4 text-accent" />}
            </div>

            <div className="flex items-baseline gap-2 relative z-10 text-primary">
                {isCurrency && <span className="text-lg font-bold opacity-80">$</span>}
                <span className="text-4xl font-bold font-mono tracking-tighter">
                    {count.toLocaleString()}
                </span>
                {suffix && <span className="text-sm font-bold opacity-80">{suffix}</span>}
            </div>
        </motion.div>
    );
}

function ActivityItem({ time, text, isPrimary = false }: {
    time: string, text: string, isPrimary?: boolean
}) {
    return (
        <div className="flex gap-6 relative z-10">
            <div className="flex flex-col items-center shrink-0 mt-1">
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors bg-white ${isPrimary ? "border-primary text-primary" : "border-border/80 text-border"
                    }`}>
                    {isPrimary ? <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> :
                        <div className="w-2 h-2 rounded-full bg-border" />}
                </div>
            </div>
            <div className="pb-6">
                <div className="text-[10px] font-mono text-text/50 mb-1 leading-none">{time}</div>
                <p className={`text-sm leading-relaxed ${isPrimary ? "text-primary font-bold" : "text-text/70"}`}>{text}</p>
            </div>
        </div>
    );
}

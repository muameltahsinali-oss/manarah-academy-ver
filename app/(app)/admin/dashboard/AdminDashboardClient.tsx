"use client";

import { motion } from "framer-motion";
import { getFadeUp, staggerContainer } from "@/lib/motion";
import { Users, BookOpen, DollarSign, Activity, MonitorPlay, Loader2 } from "lucide-react";
import { useAdminDashboard } from "@/lib/hooks/useDashboard";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

export function AdminDashboardClient() {
    const { data: res, isLoading } = useAdminDashboard();
    const data = res?.data;

    if (isLoading) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                <p className="text-text/60">تعذر تحميل بيانات لوحة التحكم.</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-8 pb-12"
        >
            <motion.div {...getFadeUp(0)}>
                <h1 className="text-3xl font-bold tracking-tight mb-2">لوحة المراقبة الشاملة</h1>
                <p className="text-text/60">نظرة عامة على أداء المنصة والإيرادات الإجمالية.</p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div {...getFadeUp(0.1)}>
                    <StatCard
                        title="إجمالي الإيرادات"
                        value={`$${data.total_revenue.toLocaleString()}`}
                        icon={DollarSign}
                        trend="+12% الشهر الحالي"
                        trendUp={true}
                    />
                </motion.div>
                <motion.div {...getFadeUp(0.2)}>
                    <StatCard
                        title="الدورات المنشورة"
                        value={data.course_stats.published.toLocaleString()}
                        icon={BookOpen}
                        description={`من أصل ${data.course_stats.total} دورة`}
                    />
                </motion.div>
                <motion.div {...getFadeUp(0.3)}>
                    <StatCard
                        title="إجمالي المستخدمين"
                        value={data.user_stats.total.toLocaleString()}
                        icon={Users}
                        description={`${data.user_stats.students} طالب و ${data.user_stats.instructors} مدرب`}
                    />
                </motion.div>
                <motion.div {...getFadeUp(0.4)}>
                    <StatCard
                        title="إجمالي التسجيلات"
                        value={data.total_enrollments.toLocaleString()}
                        icon={Activity}
                        trend="+4% عن الأسبوع الماضي"
                        trendUp={true}
                    />
                </motion.div>
            </div>

            {/* Review Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...getFadeUp(0.45)} className="bg-white border border-border/80 rounded-[4px] p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold">الدورات بانتظار المراجعة</h2>
                            <p className="text-xs text-text/60 mt-1">دورات تم إرسالها من المدربين للمراجعة.</p>
                        </div>
                        <div className="text-3xl font-black text-primary">
                            {data.review_queues?.pending_courses?.toLocaleString?.("ar-EG") ?? 0}
                        </div>
                    </div>
                    <div className="mt-5">
                        <Link
                            href="/admin/courses"
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-[4px] border border-border/80 hover:bg-black/5 transition-colors"
                        >
                            فتح قائمة الدورات
                        </Link>
                    </div>
                </motion.div>

                <motion.div {...getFadeUp(0.5)} className="bg-white border border-border/80 rounded-[4px] p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold">مدربين بانتظار الاعتماد</h2>
                            <p className="text-xs text-text/60 mt-1">حسابات مدربين جديدة تحتاج موافقة.</p>
                        </div>
                        <div className="text-3xl font-black text-accent">
                            {data.review_queues?.pending_instructors?.toLocaleString?.("ar-EG") ?? 0}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder for actual chart integration like Recharts) */}
                <motion.div {...getFadeUp(0.55)} className="lg:col-span-2 bg-white border border-border/80 rounded-[4px] p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold">نمو الإيرادات والتسجيلات</h2>
                            <p className="text-xs text-text/60 mt-1">آخر 30 يوم</p>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 mt-4">
                        {data.revenue_chart && data.revenue_chart.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.revenue_chart} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px', color: '#fff' }}
                                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                        itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                                        formatter={(value: any) => [`$${value}`, 'الإيرادات'] as [string, string]}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-text/40 bg-black/5 rounded-[4px] border border-border/40 border-dashed">
                                <p className="text-sm font-bold">لا تتوفر بيانات كافية لعرض الرسم البياني</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-mono text-text/40 border-t border-border/40 pt-4">
                        <span>قبل أسبوعين</span>
                        <span>اليوم</span>
                    </div>
                </motion.div>

                {/* Recent Users List */}
                <motion.div {...getFadeUp(0.65)} className="bg-white border border-border/80 rounded-[4px] p-6">
                    <h2 className="text-lg font-bold mb-6">أحدث المستخدمين</h2>
                    <div className="flex flex-col gap-6">
                        {data.recent_users?.map((user: any) => (
                            <div key={user.id} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5 text-text/60" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate">{user.name}</div>
                                    <div className="text-xs text-text/60 truncate flex justify-between mt-1">
                                        <span>{user.email}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.role === 'admin' ? 'bg-accent/10 text-accent' :
                                            user.role === 'instructor' ? 'bg-primary/10 text-primary' :
                                                'bg-black/5 text-text/70'
                                            }`}>
                                            {user.role === 'admin' ? 'مدير' : user.role === 'instructor' ? 'مدرب' : 'طالب'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!data.recent_users || data.recent_users.length === 0) && (
                            <div className="text-sm text-text/60 text-center py-4">لا يوجد مستخدمين جدد.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, description }: any) {
    return (
        <div className="bg-white border border-border/80 rounded-[4px] p-6 hover:border-accent/40 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-black/5 rounded-[4px] group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-5 h-5 text-text group-hover:text-accent transition-colors" />
                </div>
                {trend && (
                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                        }`}>
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <div className="text-sm font-bold text-text/60 mb-1">{title}</div>
                <div className="text-3xl font-black">{value}</div>
                {description && <div className="text-xs text-text/50 mt-2">{description}</div>}
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { BarChart3, TrendingDown, Clock, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { useInstructorCourses, useAnalytics } from "@/lib/hooks/useInstructor";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function CourseAnalyticsClient() {
    const { data: coursesRes, isLoading: coursesLoading } = useInstructorCourses();
    const courses = coursesRes?.data || [];

    const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');

    // Only fetch analytics if a course is selected
    const { data: analyticsRes, isLoading: analyticsLoading } = useAnalytics(selectedCourseId as number);
    const analytics = analyticsRes?.data;

    return (
        <div className="flex flex-col gap-12 w-full mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-3xl font-bold tracking-tight mb-2">تحليل أداء الدورات</h1>
                <p className="text-sm text-text/60">مراقبة التفاعل، معدلات الإكمال، والتسرب الخاصة بدوراتك النشطة.</p>
            </motion.div>

            {/* Top Stat Selection & Snapshot */}
            <div className="flex flex-col md:flex-row gap-6">
                <motion.div
                    {...getFadeUp(0.1, 0.4)}
                    className="w-full md:w-1/3 bg-background border border-border/80 rounded-[4px] p-6 lg:p-8"
                >
                    <label className="block text-sm font-bold text-text mb-4">عرض بيانات الدورة:</label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(Number(e.target.value) || '')}
                        className="w-full bg-white border border-border/80 rounded-[4px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors outline-none cursor-pointer appearance-none mb-8"
                        disabled={coursesLoading}
                    >
                        <option value="">اختر دورة...</option>
                        {courses.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>

                    {analyticsLoading ? (
                        <div className="flex flex-col items-center justify-center p-8 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : selectedCourseId && analytics ? (
                        <div className="flex flex-col gap-6">
                            <MiniStat icon={BarChart3} label="عدد الطلاب" value={String(analytics.totalStudents ?? 0)} />
                            <MiniStat icon={Activity} label="معدل الإكمال" value={`${analytics.completionRate ?? 0}%`} />
                            <MiniStat icon={Clock} label="متوسط التقدم" value={`${analytics.averageProgress ?? 0}%`} />
                            <MiniStat icon={BarChart3} label="إجمالي المشاهدات" value={String(analytics.totalViews || 0)} />
                            <MiniStat icon={Activity} label="المتفاعلون أسبوعياً" value={String(analytics.activeUsers || 0)} />
                            <MiniStat icon={TrendingDown} label="معدل تسرب الطلاب" value={`${analytics.dropOffRate || 0}%`} isNegative />
                        </div>
                    ) : (
                        <div className="text-text/50 text-sm text-center py-8">
                            الرجاء اختيار دورة لعرض الإحصائيات الخاصة بها.
                        </div>
                    )}
                </motion.div>

                {/* Recharts Retention Graph */}
                <motion.div
                    {...getFadeUp(0.2, 0.4)}
                    className="flex-1 border border-border/80 bg-white rounded-[4px] p-6 lg:p-8 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-lg font-bold">منحنى الاستمرارية (Retention Curve)</h2>
                        <span className="text-xs font-mono px-3 py-1 bg-background text-text/60 rounded-[4px] border border-border/80 font-bold">حسب الوحدات</span>
                    </div>

                    <div className="h-72 w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.moduleRetention || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }}
                                    domain={[0, 100]}
                                    tickFormatter={(val: number) => `${val}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                    formatter={(val: any) => [`${val}%`, 'معدل الاستمرار']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="percentage"
                                    stroke="#EF4444"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#retentionGradient)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Engagement Table/List */}
            <motion.div
                {...getFadeUp(0.3, 0.4)}
                className="border border-border/80 bg-white rounded-[4px] overflow-hidden"
            >
                <div className="p-6 border-b border-border/80">
                    <h2 className="text-lg font-bold">أكثر الدروس تفاعلاً</h2>
                </div>

                <div className="w-full">
                    {/* Headers */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-background border-b border-border/40 text-xs font-bold text-text/50">
                        <div className="col-span-6">عنوان الدرس</div>
                        <div className="col-span-2 text-center">المشاهدات</div>
                        <div className="col-span-2 text-center">المراجعات</div>
                        <div className="col-span-2 text-center">التقييم</div>
                    </div>

                    {/* Rows */}
                    {analytics?.topLessons ? (
                        analytics.topLessons.map((lesson: any, i: number) => (
                            <EngagementRow
                                key={i}
                                title={lesson.title}
                                views={lesson.views}
                                replays={lesson.replays}
                                rating={lesson.rating}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 gap-4 text-text/50 text-sm">
                            {analyticsLoading ? "جاري تحميل البيانات..." : "لا توجد بيانات تفاعل لهذه الدورة حالياً."}
                        </div>
                    )}
                </div>
            </motion.div>

        </div>
    );
}

function MiniStat({ icon: Icon, label, value, isNegative = false }: { icon: any, label: string, value: string, isNegative?: boolean }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-[4px] border flex items-center justify-center shrink-0 ${isNegative ? "bg-red-50 border-red-100 text-red-500" : "bg-primary/5 border-primary/20 text-primary"
                }`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-xs font-bold text-text/60 mb-0.5">{label}</div>
                <div className="text-lg font-mono font-bold leading-none">{value}</div>
            </div>
        </div>
    );
}

function EngagementRow({ title, views, replays, rating }: { title: string, views: string, replays: string, rating: string }) {
    return (
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/40 hover:bg-black/5 transition-colors text-sm items-center">
            <div className="col-span-6 font-bold">{title}</div>
            <div className="col-span-2 font-mono text-center tracking-widest">{views}</div>
            <div className="col-span-2 font-mono text-center tracking-widest text-primary">{replays}</div>
            <div className="col-span-2 font-mono text-center tracking-widest border border-border/80 bg-background/50 py-1 rounded-[4px]">{rating}</div>
        </div>
    );
}

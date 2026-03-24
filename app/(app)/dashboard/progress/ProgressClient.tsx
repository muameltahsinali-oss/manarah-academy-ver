"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Clock, CheckCircle2, TrendingUp, Trophy, Flame } from "lucide-react";
import { useEffect, useState } from "react";

export function ProgressClient() {
    return (
        <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-3xl font-bold tracking-tight mb-2">تقدمي</h1>
                <p className="text-sm text-text/60">تحليل مفصل لأدائك وسرعة تعلمك عبر المنصة.</p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard delay={0.1} icon={Clock} label="ساعات التعلم" value={124} suffix="ساعة" />
                <StatCard delay={0.2} icon={CheckCircle2} label="الدورات المكتملة" value={8} />
                <StatCard delay={0.3} icon={Flame} label="أيام متتالية" value={14} suffix="يوم" isTrending />
                <StatCard delay={0.4} icon={Trophy} label="نقاط الخبرة" value={4520} suffix="XP" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Line Chart for Weekly Learning */}
                <motion.div
                    {...getFadeUp(0.5, 0.5)}
                    className="lg:col-span-2 border border-border/80 bg-white rounded-[4px] p-6 lg:p-8"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-lg font-bold">نشاط التعلم الأسبوعي</h2>
                        <span className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary rounded-[4px] font-bold">نشط</span>
                    </div>

                    {/* Active Chart Area */}
                    <div className="relative h-64 w-full">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[0, 1, 2, 3, 4].map(line => (
                                <div key={line} className="w-full h-px bg-border/40" />
                            ))}
                        </div>

                        {/* Dynamic SVG Drawing */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                            {/* Gradient Def */}
                            <defs>
                                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FF6B57" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#FF6B57" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Area Fill */}
                            <motion.path
                                d="M 0,100 L 0,80 L 16.6,60 L 33.3,70 L 50,40 L 66.6,80 L 83.3,30 L 100,50 L 100,100 Z"
                                fill="url(#lineGrad)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                            />

                            {/* Electric Indigo Line */}
                            <motion.path
                                d="M 0,80 L 16.6,60 L 33.3,70 L 50,40 L 66.6,80 L 83.3,30 L 100,50"
                                fill="none"
                                stroke="#FF6B57"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            />

                            {/* Data points */}
                            {[
                                { x: 0, y: 80 }, { x: 16.6, y: 60 }, { x: 33.3, y: 70 },
                                { x: 50, y: 40 }, { x: 66.6, y: 80 }, { x: 83.3, y: 30 }, { x: 100, y: 50 }
                            ].map((point, idx) => (
                                <motion.circle
                                    key={idx}
                                    cx={`${point.x}%`}
                                    cy={`${point.y}%`}
                                    r="3"
                                    fill="white"
                                    stroke="#FF6B57"
                                    strokeWidth="2"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1 + idx * 0.1, duration: 0.3 }}
                                />
                            ))}
                        </svg>

                        {/* X-Axis Labels */}
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-[10px] font-mono text-text/50">
                            <span>السبت</span>
                            <span>الأحد</span>
                            <span>الإثنين</span>
                            <span>الثلاثاء</span>
                            <span>الأربعاء</span>
                            <span>الخميس</span>
                            <span>الجمعة</span>
                        </div>
                    </div>
                </motion.div>

                {/* Skill Progress Indicators */}
                <motion.div
                    {...getFadeUp(0.6, 0.5)}
                    className="border border-border/80 bg-white rounded-[4px] p-6 lg:p-8"
                >
                    <h2 className="text-lg font-bold mb-8">نمو المهارات</h2>
                    <div className="flex flex-col gap-6">
                        <SkillBar name="هندسة الواجهات الأمامية" percentage={85} />
                        <SkillBar name="خوارزميات التشفير" percentage={60} />
                        <SkillBar name="تصميم النظم الموزعة" percentage={45} />
                        <SkillBar name="هندسة الذكاء الاصطناعي" percentage={20} />
                        <SkillBar name="إدارة قواعد البيانات" percentage={90} />
                    </div>
                </motion.div>
            </div>

            {/* Milestones Timeline */}
            <motion.div
                {...getFadeUp(0.7, 0.5)}
                className="border border-border/80 bg-white rounded-[4px] p-6 lg:p-8"
            >
                <h2 className="text-lg font-bold mb-8">رحلة التعلم والمراحل</h2>
                <div className="flex flex-col gap-6 relative">
                    {/* Vertical connecting line */}
                    <div className="absolute right-3.5 top-2 bottom-6 w-px bg-border/80" />

                    <MilestoneItem
                        date="أكتوبر 2026"
                        title="خبير واجهات أمامية"
                        description="إكمال مسار واجهات المستخدم المتقدم بالكامل مع مشاريع التخرج الثلاثة."
                        isCompleted
                    />
                    <MilestoneItem
                        date="نوفمبر 2026"
                        title="أول 100 ساعة"
                        description="تخطي حاجز 100 ساعة من التعلم المستمر والتركيز."
                        isCompleted
                    />
                    <MilestoneItem
                        date="ديسمبر 2026"
                        title="مهندس نظم ناشئ"
                        description="طور التنفيذ في مسار هندسة النظم الموزعة والخدمات المصغرة."
                        isActive
                    />
                    <MilestoneItem
                        date="يناير 2027"
                        title="مساهم مفتوح المصدر"
                        description="تقديم أول مساهمة فعلية في مكتبة مفتوحة المصدر."
                    />
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ delay, icon: Icon, label, value, suffix = "", isTrending = false }: {
    delay: number, icon: any, label: string, value: number, suffix?: string, isTrending?: boolean
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
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
            className="border border-border/80 bg-white rounded-[4px] p-6 relative overflow-hidden group"
        >
            <div className="absolute -left-6 -top-6 text-primary/5 transition-transform group-hover:scale-110 duration-500">
                <Icon className="w-24 h-24" />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-text/50">{label}</span>
                {isTrending && <TrendingUp className="w-4 h-4 text-accent" />}
            </div>

            <div className="flex items-baseline gap-2 relative z-10 text-primary">
                <span className="text-4xl font-bold font-mono tracking-tighter">
                    {count}
                </span>
                {suffix && <span className="text-sm font-bold opacity-80">{suffix}</span>}
            </div>
        </motion.div>
    );
}

function SkillBar({ name, percentage }: { name: string, percentage: number }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-text/80">{name}</span>
                <span className="text-[10px] font-mono text-text/50">{percentage}%</span>
            </div>
            <div className="w-full h-1 bg-border/40 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

function MilestoneItem({ date, title, description, isCompleted = false, isActive = false }: {
    date: string, title: string, description: string, isCompleted?: boolean, isActive?: boolean
}) {
    return (
        <div className="flex gap-6 relative z-10">
            <div className="flex flex-col items-center shrink-0 mt-1">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors bg-white ${isCompleted ? "border-primary text-primary" :
                        isActive ? "border-primary/50 text-primary" : "border-border/80 text-border"
                    }`}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                        isActive ? <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> :
                            <div className="w-2 h-2 rounded-full bg-border" />}
                </div>
            </div>
            <div className={`pb-8 ${!isCompleted && !isActive ? "opacity-60" : ""}`}>
                <div className="text-[10px] font-mono text-text/50 mb-1">{date}</div>
                <h3 className={`text-base font-bold mb-2 ${isActive ? "text-primary" : "text-text"}`}>{title}</h3>
                <p className="text-sm text-text/70 leading-relaxed max-w-lg">{description}</p>
            </div>
        </div>
    );
}

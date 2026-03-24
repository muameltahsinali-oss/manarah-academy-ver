"use client";

import { motion } from "framer-motion";

const modules = [
    { id: 1, title: "الأساسيات البرمجية", status: "completed" },
    { id: 2, title: "هيكلية الحالة (State)", status: "completed" },
    { id: 3, title: "الأنماط المتقدمة", status: "active" },
    { id: 4, title: "مرونة النظام", status: "pending" },
];

export function CurrentRoadmap() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="w-full bg-white border border-border/80 rounded-[4px] p-4 md:p-6 lg:p-8 h-full"
        >
            <div className="flex justify-between items-end mb-5 md:mb-8 relative z-10 gap-2">
                <div className="min-w-0">
                    <h2 className="text-base md:text-lg font-bold tracking-tight mb-0.5 md:mb-1">المسار الحالي</h2>
                    <p className="text-xs md:text-sm text-text/60 truncate">هندسة الواجهات الأمامية</p>
                </div>
                <div className="text-left font-mono text-primary font-bold text-xl">
                    72%
                </div>
            </div>

            <div className="relative flex flex-col gap-3 md:gap-6 mt-2 md:mt-4 z-10 h-full">
                {modules.map((mod, idx) => (
                    <motion.div
                        key={mod.id}
                        className="relative z-10 flex items-center gap-4 group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + (idx * 0.1) }}
                    >
                        {/* Status Node */}
                        <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-300 ${mod.status === 'completed' ? 'border-primary' :
                            mod.status === 'active' ? 'border-accent ring-4 ring-accent/20' :
                                'border-border/80'
                            }`}>
                            {(mod.status === 'completed' || mod.status === 'active') && (
                                <div className={`w-2 h-2 rounded-full ${mod.status === 'completed' ? 'bg-primary' : 'bg-accent'}`} />
                            )}
                        </div>

                        {/* Module Card */}
                        <div className={`flex-1 p-4 rounded-[4px] border transition-all duration-300 ${mod.status === 'active'
                            ? 'border-accent bg-accent/5'
                            : 'border-border/80 bg-background/50 group-hover:bg-white group-hover:border-text/20'
                            }`}>
                            <h3 className={`font-bold text-sm ${mod.status === 'active' ? 'text-text' : 'text-text/80'}`}>
                                {mod.title}
                            </h3>
                            <p className="text-xs text-text/50 mt-1 font-medium">
                                {mod.status === 'completed' ? 'مكتمل' : mod.status === 'active' ? 'قيد الدراسة الآن' : 'قيد الانتظار'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

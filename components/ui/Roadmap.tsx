"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface RoadmapModule {
    id: string | number;
    title: string;
    status: "completed" | "active" | "pending";
    description?: string;
    duration?: string;
    tag?: string;
}

interface RoadmapProps {
    modules: RoadmapModule[];
    progress?: number;
    className?: string;
}

export function Roadmap({ modules, progress = 0, className = "" }: RoadmapProps) {
    return (
        <div className={`relative space-y-0 ${className}`}>
            {/* Connecting Line Background */}
            <div className="absolute right-[15px] top-4 bottom-[20%] w-px bg-border z-0" />
            {/* Connecting Line Foreground (Animated) */}
            <motion.div
                className="absolute right-[15px] top-4 w-px bg-primary z-0"
                initial={{ height: 0 }}
                whileInView={{ height: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />

            {modules.map((item, i) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + (i * 0.1), ease: "easeOut" }}
                    className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 py-4 group"
                >
                    <div className="relative pt-1 sm:pt-0">
                        <div className={`w-8 h-8 rounded-[4px] border flex items-center justify-center bg-background transition-colors
              ${item.status === 'completed' ? 'border-primary' :
                                item.status === 'active' ? 'border-primary' : 'border-border'}`}
                        >
                            {item.status === 'completed' && <div className="w-2 h-2 rounded-full bg-accent" />}
                            {item.status === 'active' && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                    </div>

                    <div className={`flex-1 p-4 rounded-[4px] border transition-colors duration-300 w-full
            ${item.status === 'active' ? 'border-primary bg-white pointer-events-none' : 'border-border/50 hover:border-border bg-white'}
            ${item.status === 'pending' ? 'opacity-50' : 'opacity-100'}
          `}
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-1">
                            <h4 className={`text-base font-bold ${item.status === 'active' ? 'text-primary' : 'text-text'}`}>
                                {item.title}
                            </h4>
                            <div className="flex gap-4">
                                {item.tag && (
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-background border border-border rounded-[4px]">
                                        {item.tag}
                                    </span>
                                )}
                                {item.duration && (
                                    <span className="text-[10px] font-mono text-text/50 uppercase tracking-wider">
                                        {item.duration}
                                    </span>
                                )}
                            </div>
                        </div>
                        {item.description && (
                            <p className="text-sm text-text/70 mt-2">{item.description}</p>
                        )}
                        <div className="text-xs font-mono text-text/50 uppercase tracking-wider mt-2">
                            {item.status === 'completed' ? 'مكتمل' : item.status === 'active' ? 'نشط' : 'قيد الانتظار'}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

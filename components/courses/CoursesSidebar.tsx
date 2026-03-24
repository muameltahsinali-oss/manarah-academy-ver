"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export type CourseFilters = {
    query: string;
    category: string | null;
    level: string | null;
    duration: "lt2" | "2to5" | "gt5" | null;
};

const FILTERS = {
    category: ["المعمارية", "الواجهات الأمامية", "الخوادم", "عمليات التطوير", "تكامل الذكاء الاصطناعي", "عام"],
    level: ["مبتدئ", "متوسط", "متقدم"],
    duration: [
        { id: "lt2" as const, label: "أقل من ساعتين" },
        { id: "2to5" as const, label: "2-5 ساعات" },
        { id: "gt5" as const, label: "أكثر من 5 ساعات" },
    ],
};

export function CoursesSidebar({
    filters,
    onChange,
    onClear,
    activeCount = 0,
}: {
    filters: CourseFilters;
    onChange: (next: CourseFilters) => void;
    onClear: () => void;
    activeCount?: number;
}) {
    const [open, setOpen] = useState(true);

    return (
        <div className="rounded-[4px] border border-border/80 bg-white">
            <div className="w-full px-4 py-3 flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex-1 flex items-center justify-between text-right"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-[4px] bg-primary/10 flex items-center justify-center">
                            <SlidersHorizontal className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-mono text-text/50 uppercase tracking-[0.18em]">
                                فلاتر الكتالوج
                            </span>
                            <span className="text-sm font-semibold text-text">
                                تخصيص النتائج {activeCount ? `(${activeCount})` : ""}
                            </span>
                        </div>
                    </div>
                    <span className="text-xs text-text/50">{open ? "إخفاء" : "إظهار"}</span>
                </button>

                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-xs px-2.5 py-1 rounded-[4px] border border-border/70 bg-background hover:bg-slate-50 transition-colors flex items-center gap-1"
                        title="مسح الفلاتر"
                    >
                        <X className="w-3.5 h-3.5" />
                        مسح
                    </button>
                )}
            </div>

            {open && (
                <div className="px-4 pb-4 space-y-5">
                    {/* Category */}
                    <div className="pt-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-text/70">الفئة</h3>
                        <div className="flex flex-wrap gap-2">
                            {FILTERS.category.map((c) => {
                                const active = filters.category === c;
                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => onChange({ ...filters, category: active ? null : c })}
                                        className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-colors ${
                                            active
                                                ? "bg-primary text-white border-primary"
                                                : "bg-background text-text/70 border-border/70 hover:border-primary/40 hover:bg-primary/5"
                                        }`}
                                    >
                                        {c}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Level */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-text/70">المستوى</h3>
                        <div className="flex flex-wrap gap-2">
                            {FILTERS.level.map((lvl) => {
                                const active = filters.level === lvl;
                                return (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => onChange({ ...filters, level: active ? null : lvl })}
                                        className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-colors ${
                                            active
                                                ? "bg-secondary text-white border-secondary"
                                                : "bg-background text-text/70 border-border/70 hover:border-secondary/40 hover:bg-secondary/5"
                                        }`}
                                    >
                                        {lvl}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-2 text-text/70">المدة</h3>
                        <div className="flex flex-wrap gap-2">
                            {FILTERS.duration.map((d) => {
                                const active = filters.duration === d.id;
                                return (
                                    <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => onChange({ ...filters, duration: active ? null : d.id })}
                                        className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-colors ${
                                            active
                                                ? "bg-accent text-white border-accent"
                                                : "bg-background text-text/70 border-border/70 hover:border-accent/40 hover:bg-accent/10"
                                        }`}
                                    >
                                        {d.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

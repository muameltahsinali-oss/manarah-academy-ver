"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Search, Mail, Filter, Loader2, Ghost } from "lucide-react";
import { useState } from "react";
import { useInstructorStudents } from "@/lib/hooks/useDashboard";

export interface StudentRecord {
    id: string;
    name: string;
    course: string;
    progress: number;
    lastActive: string;
    status: "active" | "completed" | "inactive";
}

export function InstructorStudentsClient() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: res, isLoading } = useInstructorStudents();
    const students: StudentRecord[] = res?.data || [];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toString().includes(searchQuery) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-12 w-full mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)} className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">إدارة الطلاب</h1>
                    <p className="text-sm text-text/60">متابعة سجلات الطلاب، تقدمهم المكتمل والتواصل المباشر.</p>
                </div>
                <div className="flex gap-4">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-background border border-border/80 text-text text-sm font-bold rounded-[4px] hover:bg-black/5 transition-colors">
                        <Filter className="w-4 h-4" />
                        تصفية
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-colors">
                        <Mail className="w-4 h-4" />
                        مراسلة جماعية
                    </button>
                </div>
            </motion.div>

            {/* Controls */}
            <motion.div {...getFadeUp(0.1, 0.4)} className="relative max-w-md">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary w-4 h-4 transition-colors" />
                <input
                    type="text"
                    placeholder="البحث بالاسم، الدورة، أو المعرّف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-border/80 rounded-[4px] pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
            </motion.div>

            {/* Structured Table */}
            {filteredStudents.length === 0 ? (
                <div className="py-20 text-center bg-white border border-dashed border-border/80 rounded-[4px]">
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                        <Ghost className="w-12 h-12 text-text/20 mb-4" />
                        <h2 className="text-xl font-bold mb-2">لا توجد نتائج</h2>
                        <p className="text-sm text-text/50">لم نعثر على أي طلاب يطابقون بحثك الحالي.</p>
                    </div>
                </div>
            ) : (
                <motion.div
                    {...getFadeUp(0.2, 0.4)}
                    className="bg-white border border-border/80 rounded-[4px] w-full overflow-hidden overflow-x-auto shadow-sm"
                >
                    <div className="min-w-[900px]">
                        {/* Headers */}
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-bold text-text/50 uppercase tracking-widest bg-background/50">
                            <div className="col-span-3">الطالب</div>
                            <div className="col-span-3">الدورة المسجلة</div>
                            <div className="col-span-3">مستوى التقدم</div>
                            <div className="col-span-1 text-center font-mono">آخر نشاط</div>
                            <div className="col-span-2 text-center">الحالة</div>
                        </div>

                        {/* Rows */}
                        {filteredStudents.map((student, idx) => (
                            <div
                                key={student.id}
                                className="grid grid-cols-12 gap-4 p-4 border-b border-border/40 text-sm hover:bg-background/40 transition-colors items-center last:border-0 group cursor-pointer"
                            >
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full border border-primary/10 bg-primary/5 flex items-center justify-center font-bold text-xs text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                                        {student.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-bold mb-0.5 group-hover:text-primary transition-colors">{student.name}</div>
                                        <div className="text-[10px] font-mono text-text/30">ID: {student.id}</div>
                                    </div>
                                </div>

                                <div className="col-span-3 font-medium text-text/80">{student.course}</div>

                                <div className="col-span-3 flex items-center gap-3 pr-2">
                                    <span className="font-mono font-bold text-xs w-8 text-right">{student.progress}%</span>
                                    <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${student.progress === 100 ? "bg-accent" : "bg-primary"}`}
                                            style={{ width: `${student.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1 font-mono text-[10px] text-text/50 text-center uppercase tracking-widest leading-tight">
                                    {student.lastActive}
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <span className={`text-[10px] font-mono font-bold px-2 py-1 border rounded-[4px] uppercase tracking-widest shadow-sm ${student.status === "completed" ? "bg-accent/10 border-accent/20 text-accent/80" :
                                        student.status === "active" ? "bg-green-50 border-green-200 text-green-600" :
                                            "bg-background/80 border-border text-text/50"
                                        }`}>
                                        {student.status === 'active' ? 'نشط' : student.status === 'completed' ? 'مكتمل' : 'غير نشط'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

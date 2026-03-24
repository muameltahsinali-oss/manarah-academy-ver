"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, patch, del } from "@/lib/api";
import { BookOpen, CheckCircle, AlertCircle, Loader2, Search, Filter, MoreVertical, Eye, Trash2, ShieldCheck, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminCoursesPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: coursesRes, isLoading } = useQuery({
        queryKey: ["admin", "courses"],
        queryFn: () => get<any>("/admin/courses"),
    });

    const toggleStatusMutation = useMutation({
        mutationFn: (courseId: number) => patch(`/admin/courses/${courseId}/toggle-status`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
            toast.success("تم تحديث حالة الدورة بنجاح");
        },
        onError: () => {
            toast.error("حدث خطأ أثناء تحديث حالة الدورة");
        }
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (courseId: number) => del(`/admin/courses/${courseId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
            toast.success("تم حذف الدورة بنجاح");
        },
        onError: () => {
            toast.error("حدث خطأ أثناء حذف الدورة");
        }
    });

    const courses = coursesRes?.data || [];

    const filteredCourses = courses.filter((c: any) => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'published': return { label: 'منشور', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: CheckCircle };
            case 'draft': return { label: 'مسودة', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
            default: return { label: status, color: 'text-text/40', bg: 'bg-background', border: 'border-border', icon: AlertCircle };
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">إدارة الدورات</h1>
                    <p className="text-sm text-text/60">مراجعة واعتماد الدورات التدريبية المرفوعة.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="بحث عن دورة أو مدرس..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-border/80 rounded h-10 pr-10 pl-4 text-xs focus:outline-none focus:border-primary w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'all' ? 'bg-secondary text-white' : 'bg-white border border-border/80 text-text/60'}`}
                >
                    الكل
                </button>
                <button
                    onClick={() => setStatusFilter("published")}
                    className={`px-4 py-2 rounded text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'published' ? 'bg-green-600 text-white' : 'bg-white border border-border/80 text-text/60'}`}
                >
                    المنشورة
                </button>
                <button
                    onClick={() => setStatusFilter("draft")}
                    className={`px-4 py-2 rounded text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-white border border-border/80 text-text/60'}`}
                >
                    المسودات
                </button>
            </div>

            <div className="bg-white border border-border/80 rounded-[4px] overflow-hidden shadow-sm">
                <table className="w-full text-right text-sm">
                    <thead className="bg-background border-b border-border/80 text-text/50 font-mono uppercase tracking-widest text-[10px]">
                        <tr>
                            <th className="px-6 py-4 font-bold">الدورة</th>
                            <th className="px-6 py-4 font-bold">المدرس</th>
                            <th className="px-6 py-4 font-bold">الحالة</th>
                            <th className="px-6 py-4 font-bold">السعر</th>
                            <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        <span className="text-xs text-text/40 font-bold">جاري تحميل الدورات...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredCourses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-text/40 font-bold italic">لا توجد نتائج لعملية البحث.</td>
                            </tr>
                        ) : (
                            filteredCourses.map((course: any) => {
                                const statusInfo = getStatusInfo(course.status);
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <tr key={course.id} className="hover:bg-background/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text group-hover:text-primary transition-colors">{course.title}</span>
                                                <span className="text-[10px] text-text/40">{course.level}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] text-accent font-bold">
                                                    {course.instructor?.name?.charAt(0)}
                                                </div>
                                                <span className="font-medium">{course.instructor?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded w-fit border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold">{statusInfo.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[11px] font-bold">
                                            {course.price > 0 ? `$${course.price}` : 'مجانية'}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleStatusMutation.mutate(course.id)}
                                                    disabled={toggleStatusMutation.isPending}
                                                    className={`p-2 rounded transition-colors ${course.status === 'published' ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    title={course.status === 'published' ? 'إرجاع للمسودة' : 'اعتماد ونشر'}
                                                >
                                                    {course.status === 'published' ? <ShieldCheck className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
                                                            deleteCourseMutation.mutate(course.id);
                                                        }
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="حذف الدورة"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-text/40 hover:text-text hover:bg-black/5 rounded transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

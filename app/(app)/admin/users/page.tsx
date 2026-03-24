"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "@/lib/api";
import { Users, ShieldCheck, Mail, Calendar, Loader2, Ban, CheckCircle2, MoreVertical, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const { data: usersRes, isLoading } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: () => get<any>("/admin/users"),
    });

    const toggleStatusMutation = useMutation({
        mutationFn: (userId: number) => patch(`/admin/users/${userId}/toggle-status`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            toast.success("تم تحديث حالة المستخدم بنجاح");
        },
        onError: () => {
            toast.error("حدث خطأ أثناء تحديث حالة المستخدم");
        }
    });

    const users = usersRes?.data || [];

    const filteredUsers = users.filter((u: any) => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleName = (role: string) => {
        switch (role) {
            case 'admin': return 'مدير';
            case 'instructor': return 'مدرب';
            case 'student': return 'طالب';
            default: return role;
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">إدارة المستخدمين</h1>
                    <p className="text-sm text-text/60">عرض والتحكم في كافة حسابات المنصة.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو البريد..."
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
                    onClick={() => setRoleFilter("all")}
                    className={`px-4 py-2 rounded text-xs font-bold transition-all whitespace-nowrap ${roleFilter === 'all' ? 'bg-secondary text-white shadow-lg shadow-secondary/10' : 'bg-white border border-border/80 text-text/60 hover:border-secondary/30'}`}
                >
                    الكل
                </button>
                <button
                    onClick={() => setRoleFilter("student")}
                    className={`px-4 py-2 rounded text-xs font-bold transition-all whitespace-nowrap ${roleFilter === 'student' ? 'bg-green-600 text-white shadow-lg shadow-green-600/10' : 'bg-white border border-border/80 text-text/60 hover:border-green-300'}`}
                >
                    الطلاب
                </button>
                <button
                    onClick={() => setRoleFilter("instructor")}
                    className={`px-4 py-2 rounded text-xs font-bold transition-all whitespace-nowrap ${roleFilter === 'instructor' ? 'bg-accent text-white shadow-lg shadow-accent/15' : 'bg-white border border-border/80 text-text/60 hover:border-accent/40'}`}
                >
                    المدربين
                </button>
                <button
                    onClick={() => setRoleFilter("admin")}
                    className={`px-4 py-2 rounded text-xs font-bold transition-all whitespace-nowrap ${roleFilter === 'admin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'bg-white border border-border/80 text-text/60 hover:border-red-300'}`}
                >
                    المدراء
                </button>
            </div>

            <div className="bg-white border border-border/80 rounded-[4px] overflow-hidden shadow-sm">
                <table className="w-full text-right text-sm">
                    <thead className="bg-background border-b border-border/80 text-text/50 font-mono uppercase tracking-widest text-[10px]">
                        <tr>
                            <th className="px-6 py-4 font-bold">المستخدم</th>
                            <th className="px-6 py-4 font-bold">الدور</th>
                            <th className="px-6 py-4 font-bold">الحالة</th>
                            <th className="px-6 py-4 font-bold">تاريخ الانضمام</th>
                            <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        <span className="text-xs text-text/40 font-bold">جاري جلب البيانات...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-text/40 font-bold italic">لا توجد نتائج لعملية البحث.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-background/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{user.name}</span>
                                                <span className="text-[10px] font-mono text-text/40">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold border ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                                            user.role === 'instructor' ? 'bg-accent/10 text-accent border-accent/20' :
                                                'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                            {getRoleName(user.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 px-2 py-1 rounded w-fit border border-border/40">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            <span className={`text-[10px] font-bold ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.status === 'active' ? 'نشط' : 'موقف'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-text/50 font-mono text-[11px]">
                                        {new Date(user.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => toggleStatusMutation.mutate(user.id)}
                                                disabled={toggleStatusMutation.isPending}
                                                className={`p-2 rounded transition-colors ${user.status === 'active'
                                                    ? 'text-red-500 hover:bg-red-50'
                                                    : 'text-green-500 hover:bg-green-50'}`}
                                                title={user.status === 'active' ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                                            >
                                                {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            </button>
                                            <button className="p-2 text-text/40 hover:text-text hover:bg-black/5 rounded transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

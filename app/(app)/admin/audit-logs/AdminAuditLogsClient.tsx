"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { Loader2, Search } from "lucide-react";
import { Pagination } from "@/components/courses/Pagination";

export function AdminAuditLogsClient() {
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [action, setAction] = useState("");
    const [entityType, setEntityType] = useState("");

    const params = useMemo(
        () => ({
            page,
            per_page: perPage,
            action: action || undefined,
            entity_type: entityType || undefined,
        }),
        [page, perPage, action, entityType]
    );

    const { data: res, isLoading } = useQuery({
        queryKey: ["admin", "audit-logs", params],
        queryFn: () => get<any>("/admin/audit-logs", params),
    });

    const logs = res?.data || [];
    const meta = res?.meta || {};

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">سجل التدقيق</h1>
                    <p className="text-sm text-text/60">
                        تتبّع إجراءات الإدارة (حالة المستخدمين، حذف الدورات، إعدادات المنصة…).
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="فلترة بالإجراء (مثال: user_suspended)"
                            value={action}
                            onChange={(e) => {
                                setAction(e.target.value);
                                setPage(1);
                            }}
                            className="bg-white border border-border/80 rounded h-10 pr-10 pl-4 text-xs focus:outline-none focus:border-primary w-[280px] transition-all"
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="entity_type (user/course/setting)"
                        value={entityType}
                        onChange={(e) => {
                            setEntityType(e.target.value);
                            setPage(1);
                        }}
                        className="bg-white border border-border/80 rounded h-10 px-4 text-xs focus:outline-none focus:border-primary w-[240px] transition-all"
                    />
                </div>
            </div>

            <div className="bg-white border border-border/80 rounded-[4px] overflow-hidden shadow-sm">
                <table className="w-full text-right text-sm">
                    <thead className="bg-background border-b border-border/80 text-text/50 font-mono uppercase tracking-widest text-[10px]">
                        <tr>
                            <th className="px-6 py-4 font-bold">الإجراء</th>
                            <th className="px-6 py-4 font-bold">المدير</th>
                            <th className="px-6 py-4 font-bold">الكيان</th>
                            <th className="px-6 py-4 font-bold">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        <span className="text-xs text-text/40 font-bold">جاري تحميل السجل...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-text/40 font-bold italic">
                                    لا توجد نتائج.
                                </td>
                            </tr>
                        ) : (
                            logs.map((row: any) => (
                                <tr key={row.id} className="hover:bg-background/40 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-[11px] font-bold text-text/70">
                                            {row.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{row.admin?.name ?? `#${row.admin_id}`}</span>
                                            {row.admin?.email && (
                                                <span className="text-[10px] font-mono text-text/40" dir="ltr">
                                                    {row.admin.email}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] font-mono text-text/60">
                                            {row.entity_type}
                                            {row.entity_id ? `#${row.entity_id}` : ""}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text/50 font-mono text-[11px]">
                                        {row.created_at
                                            ? new Date(row.created_at).toLocaleString("ar-EG")
                                            : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-xs text-text/50 font-mono">
                    الإجمالي: {Number(meta.total ?? 0).toLocaleString("ar-EG")}
                </div>
            </div>

            <Pagination
                currentPage={Number(meta.current_page ?? 1)}
                lastPage={Number(meta.last_page ?? 1)}
                onPageChange={(p) => setPage(p)}
            />
        </div>
    );
}


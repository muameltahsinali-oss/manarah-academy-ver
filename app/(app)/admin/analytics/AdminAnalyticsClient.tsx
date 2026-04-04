"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { Loader2 } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Pagination } from "@/components/courses/Pagination";

export function AdminAnalyticsClient() {
    const funnelQ = useQuery({
        queryKey: ["admin", "analytics", "funnel"],
        queryFn: () => get<any>("/admin/analytics/funnel"),
    });

    const retentionQ = useQuery({
        queryKey: ["admin", "analytics", "retention"],
        queryFn: () => get<any>("/admin/analytics/retention"),
    });

    const completionQ = useQuery({
        queryKey: ["admin", "analytics", "completion", { page: 1, per_page: 20 }],
        queryFn: () => get<any>("/admin/analytics/completion", { page: 1, per_page: 20 }),
    });

    const funnelSteps = funnelQ.data?.data?.steps ?? [];
    const retentionCohorts = retentionQ.data?.data?.cohorts ?? [];
    const completion = completionQ.data?.data?.courses ?? [];
    const completionMeta = completionQ.data?.data?.meta ?? {};

    const funnelChartData = useMemo(() => {
        return funnelSteps.map((s: any) => ({
            name:
                s.name === "registered"
                    ? "مسجل"
                    : s.name === "enrolled"
                    ? "ملتحق"
                    : s.name === "started_course"
                    ? "بدأ"
                    : s.name === "completed_course"
                    ? "أكمل"
                    : s.name,
            count: s.count ?? 0,
        }));
    }, [funnelSteps]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">التحليلات</h1>
                <p className="text-sm text-text/60">
                    Funnel + retention + completion rates مبنية على بيانات فعلية (التسجيلات، التسجيل بالدورات، تقدم الدروس).
                </p>
            </div>

            {/* Funnel */}
            <div className="bg-white border border-border/80 rounded-[4px] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold">Funnel</h2>
                        <p className="text-xs text-text/60 mt-1">
                            مسجل → ملتحق → بدأ → أكمل (آخر 30 يوم افتراضيًا)
                        </p>
                    </div>
                </div>

                {funnelQ.isLoading ? (
                    <div className="flex items-center justify-center h-56">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }} />
                                <YAxis tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px" }}
                                    formatter={(v: any) => [Number(v).toLocaleString("ar-EG"), "عدد المستخدمين"]}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Retention */}
            <div className="bg-white border border-border/80 rounded-[4px] p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Retention cohorts</h2>
                    <p className="text-xs text-text/60 mt-1">Day 1 / Day 7 / Day 30</p>
                </div>

                {retentionQ.isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-background border-b border-border/80 text-text/50 font-mono uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-4 py-3 font-bold">Cohort</th>
                                    <th className="px-4 py-3 font-bold">Users</th>
                                    <th className="px-4 py-3 font-bold">D1</th>
                                    <th className="px-4 py-3 font-bold">D7</th>
                                    <th className="px-4 py-3 font-bold">D30</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {retentionCohorts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-14 text-center text-text/40 font-bold italic">
                                            لا توجد بيانات كافية.
                                        </td>
                                    </tr>
                                ) : (
                                    retentionCohorts.map((c: any) => (
                                        <tr key={c.date} className="hover:bg-background/40 transition-colors">
                                            <td className="px-4 py-3 font-mono text-[11px] text-text/60">{c.date}</td>
                                            <td className="px-4 py-3 font-bold">{Number(c.users ?? 0).toLocaleString("ar-EG")}</td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold">{Number(c.day_1 ?? 0).toLocaleString("ar-EG")}</span>
                                                <span className="text-xs text-text/50 ms-2">({c.day_1_rate ?? 0}%)</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold">{Number(c.day_7 ?? 0).toLocaleString("ar-EG")}</span>
                                                <span className="text-xs text-text/50 ms-2">({c.day_7_rate ?? 0}%)</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold">{Number(c.day_30 ?? 0).toLocaleString("ar-EG")}</span>
                                                <span className="text-xs text-text/50 ms-2">({c.day_30_rate ?? 0}%)</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Completion */}
            <div className="bg-white border border-border/80 rounded-[4px] p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-bold">Completion rates</h2>
                    <p className="text-xs text-text/60 mt-1">حسب enrollments.progress = 100</p>
                </div>

                {completionQ.isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-sm">
                                <thead className="bg-background border-b border-border/80 text-text/50 font-mono uppercase tracking-widest text-[10px]">
                                    <tr>
                                        <th className="px-4 py-3 font-bold">Course</th>
                                        <th className="px-4 py-3 font-bold">Enrolled</th>
                                        <th className="px-4 py-3 font-bold">Completed</th>
                                        <th className="px-4 py-3 font-bold">Rate</th>
                                        <th className="px-4 py-3 font-bold">Avg progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {completion.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-14 text-center text-text/40 font-bold italic">
                                                لا توجد بيانات.
                                            </td>
                                        </tr>
                                    ) : (
                                        completion.map((r: any) => (
                                            <tr key={r.course_id} className="hover:bg-background/40 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="font-bold">{r.title}</div>
                                                    <div className="text-[10px] font-mono text-text/40">#{r.course_id}</div>
                                                </td>
                                                <td className="px-4 py-3 font-bold">{Number(r.enrolled ?? 0).toLocaleString("ar-EG")}</td>
                                                <td className="px-4 py-3 font-bold">{Number(r.completed ?? 0).toLocaleString("ar-EG")}</td>
                                                <td className="px-4 py-3 font-bold">{r.completion_rate ?? 0}%</td>
                                                <td className="px-4 py-3 font-bold">{r.average_progress ?? 0}%</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6">
                            <Pagination
                                currentPage={Number(completionMeta.current_page ?? 1)}
                                lastPage={Number(completionMeta.last_page ?? 1)}
                                onPageChange={() => {
                                    // keep v1 simple; can be upgraded to pageable state like other admin tables
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


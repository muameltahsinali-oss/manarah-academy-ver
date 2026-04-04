"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { usePayments } from "@/lib/hooks/useCheckout";
import { Loader2, Receipt, CreditCard, ChevronLeft, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";

export default function PaymentsHistoryPage() {
    const { data: res, isLoading, error } = usePayments();
    const payments = res?.data || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-3xl font-bold tracking-tight mb-2">سجل المدفوعات</h1>
                <p className="text-sm text-text/60">تتبع جميع عمليات الشراء والاشتراكات الخاصة بك.</p>
            </motion.div>

            {payments.length === 0 ? (
                <motion.div
                    {...getFadeUp(0.1, 0.5)}
                    className="flex flex-col items-center justify-center py-24 text-center border border-border/80 bg-white rounded-[4px]"
                >
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6">
                        <Receipt className="w-8 h-8 text-text/20" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">لا يوجد سجل مدفوعات</h3>
                    <p className="text-sm text-text/60 max-w-md">
                        لم تقم بأي عملية شراء حتى الآن. تصفح الدورات المتوفرة وابدأ رحلتك التعليمية.
                    </p>
                    <Link
                        href="/courses"
                        className="mt-6 px-6 py-2 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-colors"
                    >
                        استكشف الدورات
                    </Link>
                </motion.div>
            ) : (
                <motion.div {...getFadeUp(0.1, 0.5)} className="w-full overflow-hidden border border-border/80 bg-white rounded-[4px] shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-background border-b border-border/80">
                                    <th className="px-6 py-4 text-xs font-bold text-text/50 uppercase tracking-widest">التاريخ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text/50 uppercase tracking-widest">الدورة</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text/50 uppercase tracking-widest">المبلغ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text/50 uppercase tracking-widest">الحالة</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text/50 uppercase tracking-widest">رقم العملية</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text/50 uppercase tracking-widest text-center">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {payments.map((payment: any) => (
                                    <tr key={payment.id} className="hover:bg-background/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-text/60">
                                            {format(new Date(payment.created_at), "dd MMM yyyy", { locale: ar })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold">{payment.course.title}</div>
                                            <div className="text-[10px] text-text/40">{payment.course.instructor?.name || "مدرّب مجهول"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-primary">
                                            ${payment.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-text/40">
                                            {payment.transaction_reference || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {payment.status === 'pending' ? (
                                                <Link
                                                    href={`/checkout?payment_id=${payment.id}`}
                                                    className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1"
                                                >
                                                    إكمال الدفع
                                                    <ChevronLeft className="w-3 h-3" />
                                                </Link>
                                            ) : (
                                                <button className="text-xs font-bold text-text/40 cursor-not-allowed">
                                                    لا يوجد إجراء
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'paid':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                    مكتمل
                </span>
            );
        case 'pending':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                    معلق
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                    فشل
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                    {status}
                </span>
            );
    }
}

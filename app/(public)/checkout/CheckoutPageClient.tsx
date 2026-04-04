"use client";

import { useSearchParams } from "next/navigation";
import { usePayment, useSimulatePayment } from "@/lib/hooks/useCheckout";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { CreditCard, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPageClient() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const router = useRouter();

    const { data: paymentResponse, isLoading, error } = usePayment(paymentId);
    const simulateMutation = useSimulatePayment();
    const payment = paymentResponse?.data ?? paymentResponse;

    const hasValidPaymentId = paymentId != null && paymentId !== "" && !Number.isNaN(Number(paymentId));

    const handleSimulatePayment = async () => {
        if (!paymentId) return;

        try {
            await simulateMutation.mutateAsync(Number(paymentId));
            toast.success("تمت محاكاة عملية الدفع بنجاح!");
            const courseSlug = payment?.course?.slug;
            if (courseSlug) {
                router.push(`/learn/${courseSlug}`);
                return;
            }

            toast.success("تم الدفع بنجاح، يمكنك متابعة التعلم من صفحة دوراتي.");
            router.push("/dashboard/courses");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "فشل محاكاة الدفع.";
            toast.error(msg);
        }
    };

    if (!hasValidPaymentId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-red-500">رابط الدفع غير صالح أو منتهي</h2>
                <p className="text-text/70">استخدم الرابط المرسل بعد بدء عملية الدفع، أو اختر دورة للاشتراك فيها.</p>
                <Link href="/courses" className="text-primary hover:underline">
                    العودة للدورات
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !payment || !payment?.course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-red-500">حدث خطأ أثناء تحميل بيانات الدفع</h2>
                <p className="text-text/70">
                    {(error as Error)?.message || "تأكد من تسجيل الدخول واستخدام رابط الدفع الصحيح."}
                </p>
                <Link href="/courses" className="text-primary hover:underline">
                    العودة للدورات
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div {...getFadeUp(0, 0.5)}>
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">إتمام عملية الدفع</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="p-6 bg-white border border-border/80 rounded-lg shadow-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    تفاصيل الدورة
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start border-b border-border/40 pb-4">
                                        <div>
                                            <h3 className="font-bold">{payment.course.title}</h3>
                                            <p className="text-sm text-text/60">المدرّب: {payment.course.instructor_name}</p>
                                        </div>
                                        <div className="font-mono font-bold">${payment.amount}</div>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>المجموع الكلي</span>
                                        <span className="text-primary">${payment.amount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white border border-border/80 rounded-lg shadow-sm">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    بوابة الدفع
                                </h2>
                                <div className="bg-primary/5 border border-primary/10 p-4 rounded-md text-sm leading-relaxed mb-6">
                                    <p className="font-medium text-primary mb-1">تنبيه المطور:</p>
                                    <p className="text-text/70">
                                        بوابة الدفع (Stripe/PayPal) سيتم ربطها قريباً. حالياً يمكنك محاكاة نجاح الدفع لتجربة نظام الاشتراكات والمشغل.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSimulatePayment}
                                    disabled={simulateMutation.isPending}
                                    className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {simulateMutation.isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            محاكاة نجاح الدفع (تطوير)
                                            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-secondary text-white rounded-lg">
                                <ShieldCheck className="w-10 h-10 mb-4 text-primary" />
                                <h3 className="font-bold mb-2 text-lg">دفع آمن 100%</h3>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    جميع معاملاتنا مشفرة وآمنة تماماً. حقوقك محفوظة في استرجاع المبلغ خلال 14 يوم.
                                </p>
                            </div>

                            <div className="text-xs text-text/40 leading-relaxed text-center">
                                بالضغط على إتمام الدفع، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بمنصة منارة اكاديمي.
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

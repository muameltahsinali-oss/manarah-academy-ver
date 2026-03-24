"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { Award, Download, Share2, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCertificates, downloadCertificate } from "@/lib/hooks/useCertificates";
import { useState } from "react";
import { toast } from "sonner";

export default function CertificatesPage() {
    const { data, isLoading, isError } = useCertificates();
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [downloadedId, setDownloadedId] = useState<number | null>(null);

    const certificates = (data?.data ?? []) as Array<{
        id: number;
        certificate_code: string;
        issued_at: string;
        course: { id: number; title: string; instructor?: { name: string } };
    }>;

    const handleDownload = async (certId: number) => {
        setDownloadingId(certId);
        try {
            await downloadCertificate(certId);
            setDownloadedId(certId);
            toast.success("تم تحميل الشهادة بنجاح.");
        } catch {
            toast.error("فشل تحميل الشهادة. تأكد من تسجيل الدخول.");
        } finally {
            setDownloadingId(null);
        }
    };

    const getVerificationUrl = (code: string) => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/verify-certificate/${code}`;
    };

    const handleShare = (code: string) => {
        const url = getVerificationUrl(code);
        navigator.clipboard.writeText(url);
        toast.success("تم نسخ رابط التحقق إلى الحافظة.");
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 md:gap-12 w-full max-w-6xl mx-auto py-4 md:py-8 min-w-0">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2">شهاداتي</h1>
                <p className="text-xs md:text-sm text-text/60">استعرض وشارك إنجازاتك التعليمية في منارة اكاديمي.</p>
            </motion.div>

            {isError && (
                <motion.div {...getFadeUp(0.1, 0.5)} className="p-4 bg-destructive/10 border border-destructive/20 rounded-[4px] text-destructive text-sm">
                    تعذر تحميل الشهادات. حاول مرة أخرى لاحقاً.
                </motion.div>
            )}

            {!isError && certificates.length === 0 ? (
                <motion.div
                    {...getFadeUp(0.1, 0.5)}
                    className="flex flex-col items-center justify-center py-12 md:py-24 text-center border border-border/80 bg-white rounded-[4px] px-4"
                >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-background rounded-full flex items-center justify-center mb-4 md:mb-6">
                        <Award className="w-7 h-7 md:w-8 md:h-8 text-text/20" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold mb-1.5 md:mb-2">لا توجد شهادات حالياً</h3>
                    <p className="text-xs md:text-sm text-text/60 max-w-md mb-6 md:mb-8">
                        أكمل دوراتك التدريبية بنجاح لتحصل على شهادات إتمام معتمدة.
                    </p>
                    <Link
                        href="/dashboard/courses"
                        className="flex items-center justify-center gap-2 min-h-[2.75rem] px-6 py-3 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 active:scale-[0.98] transition-transform touch-manipulation"
                    >
                        استمر في التعلم
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {certificates.map((cert, idx) => (
                        <motion.div
                            key={cert.id}
                            {...getFadeUp(0.1 + idx * 0.05, 0.4)}
                            className="group bg-white border border-border/80 rounded-[4px] p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-primary/5 rounded-[4px] border border-primary/20 flex items-center justify-center">
                                <Award className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                            </div>
                            <div className="flex-1 text-center md:text-right min-w-0 order-first md:order-none">
                                <div className="text-[10px] font-mono font-bold text-text/40 uppercase tracking-widest mb-0.5 md:mb-1">
                                    {cert.certificate_code}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-0.5 md:mb-1 group-hover:text-primary transition-colors truncate">
                                    {cert.course?.title ?? "—"}
                                </h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-xs font-mono text-text/60 font-medium">
                                    <span>تاريخ الإصدار: {new Date(cert.issued_at).toLocaleDateString("ar-SA")}</span>
                                </div>
                            </div>
                            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                                <button
                                    onClick={() => handleDownload(cert.id)}
                                    disabled={downloadingId === cert.id}
                                    className="flex-1 md:w-full flex items-center justify-center gap-2 min-h-[2.75rem] px-4 py-2 bg-black text-white text-xs font-bold rounded-[4px] hover:bg-black/90 active:scale-[0.98] transition-transform font-mono disabled:opacity-60 touch-manipulation"
                                >
                                    {downloadingId === cert.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : downloadedId === cert.id ? (
                                        <CheckCircle className="w-3.5 h-3.5" />
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    {downloadingId === cert.id ? "جاري التحميل..." : "تحميل PDF"}
                                </button>
                                <button
                                    onClick={() => handleShare(cert.certificate_code)}
                                    className="flex-1 md:w-full flex items-center justify-center gap-2 min-h-[2.75rem] px-4 py-2 bg-white border border-border text-text text-xs font-bold rounded-[4px] hover:bg-black/5 active:scale-[0.98] transition-transform font-mono touch-manipulation"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    مشاركة
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <motion.div
                {...getFadeUp(0.3, 0.5)}
                className="mt-4 md:mt-8 p-4 md:p-6 bg-accent/5 border border-accent/20 rounded-[4px] flex items-start gap-3 md:gap-4"
            >
                <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <Award className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-xs md:text-sm mb-0.5 md:mb-1">مصداقية الشهادات</h4>
                    <p className="text-[11px] md:text-xs text-text/60 leading-relaxed font-medium">
                        جميع الشهادات الصادرة من منارة اكاديمي مزودة برمز تحقق فريد يمكن استخدامه للتحقق من صحة الشهادة عبر صفحة التحقق. يمكنك مشاركة رابط التحقق أو إضافة الشهادات لملفك الشخصي في LinkedIn.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

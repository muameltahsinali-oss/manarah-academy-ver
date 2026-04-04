"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type VerifyResult = {
    success: boolean;
    verified?: boolean;
    message?: string;
    data?: {
        verified?: boolean;
        certificate_code: string;
        student_name: string;
        course_title: string;
        instructor_name: string;
        completion_date: string;
        issued_at: string;
    };
};

export default function VerifyCertificateClient() {
    const params = useParams();
    const code = (params?.code as string) ?? "";
    const [result, setResult] = useState<VerifyResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!code) {
            setLoading(false);
            setResult({ success: false, message: "رمز الشهادة مطلوب." });
            return;
        }
        fetch(`${API_URL}/certificates/verify/${encodeURIComponent(code)}`)
            .then((res) => res.json())
            .then((data: VerifyResult) => {
                setResult(data);
            })
            .catch(() => {
                setResult({ success: false, message: "تعذر التحقق من الشهادة." });
            })
            .finally(() => setLoading(false));
    }, [code]);

    const copyVerificationUrl = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            toast.success("تم نسخ الرابط");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    const isVerified =
        Boolean(result?.verified) ||
        Boolean(result?.data && typeof result.data === "object" && "verified" in result.data && result.data.verified);
    const certificateData = result?.data;
    const verified = isVerified && certificateData;

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <Link href="/" className="text-sm font-medium text-primary hover:underline">
                        ← العودة للرئيسية
                    </Link>
                </div>

                <div
                    className={`rounded-[4px] border-2 p-8 ${
                        verified
                            ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/20"
                            : "border-red-500/30 bg-red-50/50 dark:bg-red-950/20"
                    }`}
                >
                    <div className="flex flex-col items-center gap-6">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                verified ? "bg-green-500/20" : "bg-red-500/20"
                            }`}
                        >
                            {verified ? (
                                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                            ) : (
                                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-center">
                            {verified ? "شهادة موثّقة" : "شهادة غير موجودة"}
                        </h1>
                        <p className="text-sm text-text/70 text-center">
                            {verified
                                ? "تم التحقق من صحة هذه الشهادة من منارة اكاديمي."
                                : result?.message ?? "لم يتم العثور على شهادة بهذا الرمز."}
                        </p>

                        {verified && certificateData && (
                            <div className="w-full text-right space-y-3 pt-4 border-t border-border/50">
                                <div className="flex justify-between gap-4">
                                    <span className="text-text/60 text-sm">الطالب</span>
                                    <span className="font-medium">{certificateData.student_name}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-text/60 text-sm">الدورة</span>
                                    <span className="font-medium">{certificateData.course_title}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-text/60 text-sm">المدرب</span>
                                    <span className="font-medium">{certificateData.instructor_name}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-text/60 text-sm">تاريخ الإكمال</span>
                                    <span className="font-medium">
                                        {new Date(certificateData.completion_date).toLocaleDateString("ar-SA")}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-text/60 text-sm">رقم الشهادة</span>
                                    <span className="font-mono text-xs">{certificateData.certificate_code}</span>
                                </div>
                            </div>
                        )}

                        {verified && (
                            <button
                                type="button"
                                onClick={copyVerificationUrl}
                                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-[4px] border border-border bg-background hover:bg-muted/50 text-sm font-medium"
                            >
                                <Copy className="w-4 h-4" />
                                نسخ رابط التحقق
                            </button>
                        )}
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-text/50">
                    للتحقق من أي شهادة صادرة عن منارة اكاديمي، استخدم الرابط الموجود على الشهادة أو صفحة شهاداتي في لوحة التحكم.
                </p>
            </div>
        </div>
    );
}

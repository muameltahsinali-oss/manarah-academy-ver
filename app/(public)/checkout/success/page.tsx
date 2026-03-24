"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Here we could optionally verify the session with the backend
        // for extra confirmation, but the webhook handles the heavy lifting.
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-bold text-text/60">جاري تأكيد عملية الدفع...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <motion.div
                {...getFadeUp(0, 0.5)}
                className="max-w-md w-full bg-white border border-border/80 rounded-[4px] p-12 text-center shadow-sm"
            >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>

                <h1 className="text-3xl font-bold mb-4">تم تأكيد اشتراكك!</h1>
                <p className="text-text/60 mb-10 leading-relaxed text-sm">
                    شكراً لك على ثقتك. تم تفعيل وصولك للدورة بنجاح. يمكنك الآن البدء في رحلة التعلم الخاصة بك.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 h-12 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-colors"
                    >
                        انطلق إلى لوحة التحكم
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/my-courses"
                        className="flex items-center justify-center h-12 border border-border text-sm font-bold rounded-[4px] hover:bg-black/5 transition-colors"
                    >
                        استعراض دوراتي
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

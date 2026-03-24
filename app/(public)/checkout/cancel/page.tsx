"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <motion.div
                {...getFadeUp(0, 0.5)}
                className="max-w-md w-full bg-white border border-border/80 rounded-[4px] p-12 text-center shadow-sm"
            >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold mb-4">تم إلغاء عملية الدفع</h1>
                <p className="text-text/60 mb-10 leading-relaxed text-sm">
                    يبدو أنك قمت بإلغاء عملية الدفع. لا تقلق، لم يتم خصم أي مبالغ من حسابك. يمكنك المحاولة مرة أخرى في أي وقت.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/courses"
                        className="flex items-center justify-center gap-2 h-12 bg-secondary text-white text-sm font-bold rounded-[4px] hover:bg-secondary/90 transition-colors"
                    >
                        العودة للمتجر
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

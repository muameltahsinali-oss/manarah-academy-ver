"use client";

import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { forgotPassword, isForgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            await forgotPassword({ email: email.trim() });
            setIsSent(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMsg(error.message || "Failed to send reset instructions");
            } else {
                setErrorMsg("Failed to send reset instructions");
            }
        }
    };

    return (
        <AuthSplitLayout
            title="نسيت كلمة المرور؟"
            subtitle="أدخل بريدك الإلكتروني وسنرسل لك رمزًا لإعادة تعيين كلمة المرور الخاصة بك."
        >
            {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[6px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-white"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isForgotPassword}
                        className="w-full py-4 bg-primary text-white text-sm font-extrabold rounded-[6px] hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                        {isForgotPassword ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            "إرسال رمز التعيين"
                        )}
                    </button>

                    {errorMsg && (
                        <div className="text-sm text-red-200 font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-[8px]">
                            {errorMsg}
                        </div>
                    )}
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-sm font-medium text-white/80 mb-4">
                        تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                    </p>

                    <div className="mb-5 text-sm text-white/70">
                        أدخل رمز التعيين في صفحة <span className="font-bold">إعادة تعيين كلمة المرور</span>.
                    </div>

                    <Link
                        href="/reset-password"
                        className="inline-flex items-center justify-center w-full py-3 bg-primary text-white text-sm font-extrabold rounded-[6px] hover:bg-primary/90 transition-colors"
                    >
                        الذهاب لإعادة تعيين كلمة المرور
                    </Link>

                    <button
                        onClick={() => setIsSent(false)}
                        className="mt-3 text-xs font-bold text-primary hover:underline"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            )}

            <div className="mt-8 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:underline">
                    <ArrowRight className="w-4 h-4" />
                    العودة لتسجيل الدخول
                </Link>
            </div>
        </AuthSplitLayout>
    );
}

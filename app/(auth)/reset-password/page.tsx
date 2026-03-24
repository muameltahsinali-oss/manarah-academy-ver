"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';

function getPasswordStrength(password: string) {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const lengthOk = password.length >= 8;
    const categoriesCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    let label = "ضعيفة";
    if (lengthOk && categoriesCount >= 4) label = "قوية";
    else if (lengthOk && categoriesCount >= 3) label = "متوسطة";

    const isStrongEnough = lengthOk && categoriesCount >= 3;

    const requirements = [
        { ok: lengthOk, text: "8 أحرف على الأقل" },
        { ok: hasLower, text: "حرف صغير" },
        { ok: hasUpper, text: "حرف كبير" },
        { ok: hasNumber, text: "رقم" },
        { ok: hasSpecial, text: "رمز (مثل !@#$)" },
    ];

    return { label, isStrongEnough, requirements };
}

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [isDone, setIsDone] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { resetPassword, isResetPassword } = useAuth();

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (password !== passwordConfirmation) {
            setErrorMsg("كلمة المرور وتأكيد كلمة المرور غير متطابقتين.");
            return;
        }

        if (!strength.isStrongEnough) {
            const unmet = strength.requirements.filter((r) => !r.ok).map((r) => r.text);
            // Friendly message: show only unmet items.
            setErrorMsg(
                `كلمة المرور ضعيفة. تأكد من: ${unmet.length ? unmet.join('، ') : 'وجود 3 عناصر على الأقل (حرف كبير/صغير + رقم + رمز)'}`
            );
            return;
        }

        try {
            await resetPassword({
                email: email.trim(),
                token: token.trim(),
                password,
                password_confirmation: passwordConfirmation,
            });
            setIsDone(true);
        } catch (error: any) {
            setErrorMsg(error.message || "Reset failed");
        }
    };

    return (
        <AuthSplitLayout title="إعادة تعيين كلمة المرور" subtitle="أدخل رمز التعيين وكلمة مرور جديدة.">
            {!isDone ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[6px] pl-10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-white"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                                رمز التعيين
                            </label>
                            <input
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[6px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-white"
                                placeholder="رمز من الإيميل"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                                كلمة المرور الجديدة
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[6px] pl-10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-white"
                                    placeholder="كلمة مرور جديدة"
                                    required
                                />
                            </div>
                            <p
                                className={`text-xs mt-2 font-bold ${
                                    strength.label === "قوية"
                                        ? "text-green-200"
                                        : strength.label === "متوسطة"
                                          ? "text-amber-200"
                                          : "text-red-200"
                                }`}
                            >
                                قوة كلمة المرور: {strength.label}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                                تأكيد كلمة المرور
                            </label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[6px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-white"
                                placeholder="تأكيد كلمة المرور"
                                required
                            />
                        </div>

                        {errorMsg && (
                            <div className="text-sm text-red-200 font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-[8px]">
                                {errorMsg}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isResetPassword}
                            className="w-full py-4 bg-primary text-white text-sm font-bold rounded-[6px] hover:bg-primary/90 transition-colors disabled:opacity-60"
                        >
                            {isResetPassword ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "تحديث كلمة المرور"}
                        </button>
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-sm font-bold text-white/90 mb-4">تم تحديث كلمة المرور بنجاح.</p>
                    <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline text-white/90">
                        <ArrowRight className="w-4 h-4" />
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            )}
        </AuthSplitLayout>
    );
}


'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Mail, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';

const verifySchema = z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyEmailClient() {
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams.get('email') || '';

    const [serverMsg, setServerMsg] = useState<string | null>(null);

    const { verifyEmail, isVerifyingEmail, verifyEmailError, resendEmailVerificationCode, isResendingEmailVerificationCode } = useAuth();

    const defaultValues = useMemo<VerifyFormValues>(
        () => ({
            email: emailFromQuery,
            code: '',
        }),
        [emailFromQuery],
    );

    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    } = useForm<VerifyFormValues>({
        resolver: zodResolver(verifySchema),
        defaultValues,
    });

    const onSubmit = async (values: VerifyFormValues) => {
        setServerMsg(null);
        try {
            // Ensure we don't keep a stale cookie from previous attempts.
            Cookies.remove('auth_token');
            await verifyEmail({ email: values.email, code: values.code });
        } catch (error: any) {
            if (error.errors) {
                Object.keys(error.errors).forEach((key) => {
                    setError(key as any, {
                        type: 'manual',
                        message: error.errors[key][0],
                    });
                });
            } else {
                setServerMsg(error.message || 'Verification failed');
            }
        }
    };

    const onResend = async () => {
        setServerMsg(null);
        try {
            const email = getValues('email').trim();
            await resendEmailVerificationCode({ email });
            setServerMsg('تم إرسال رمز جديد إلى بريدك الإلكتروني.');
        } catch (error: any) {
            setServerMsg(error.message || 'Failed to resend code');
        }
    };

    return (
        <AuthSplitLayout title="تأكيد البريد الإلكتروني" subtitle="أدخل رمز التحقق المرسل إلى بريدك الإلكتروني.">
            {serverMsg && (
                <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-200 rounded-lg text-sm font-medium border border-emerald-500/20">
                    {serverMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-white/90 mb-1.5">البريد الإلكتروني</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all sm:text-sm"
                            placeholder="name@example.com"
                        />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs text-red-200">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-white/90 mb-1.5">رمز التحقق</label>
                    <input
                        {...register('code')}
                        inputMode="numeric"
                        placeholder="123456"
                        className="block w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all sm:text-sm"
                    />
                    {errors.code && <p className="mt-1.5 text-xs text-red-200">{errors.code.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isVerifyingEmail}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary/40 transition-colors disabled:opacity-60"
                >
                    {isVerifyingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={onResend}
                    disabled={isResendingEmailVerificationCode}
                    className="text-xs font-bold text-primary hover:underline disabled:opacity-60"
                >
                    {isResendingEmailVerificationCode ? 'جارٍ الإرسال...' : 'إعادة إرسال الرمز'}
                </button>

                {verifyEmailError && !serverMsg && (
                    <p className="mt-3 text-sm text-red-200">{(verifyEmailError as any).message}</p>
                )}
            </div>
        </AuthSplitLayout>
    );
}


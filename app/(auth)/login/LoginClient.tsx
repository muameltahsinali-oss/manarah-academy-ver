'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginClient() {
    const { login, isLoggingIn } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setErrorMsg(null);
        try {
            await login(data);
        } catch (error: any) {
            if (error.errors) {
                Object.keys(error.errors).forEach((key) => {
                    setError(key as any, {
                        type: 'manual',
                        message: error.errors[key][0],
                    });
                });
            } else {
                setErrorMsg(error.message || 'Invalid credentials');
            }
        }
    };

    return (
        <AuthSplitLayout title="تسجيل الدخول" subtitle="مرحباً بعودتك! أدخل بياناتك للدخول">
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-200 rounded-lg text-sm font-medium border border-red-500/20">
                    {errorMsg}
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
                    <label className="block text-sm font-bold text-white/90 mb-1.5">كلمة المرور</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            {...register('password')}
                            type="password"
                            className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-red-200">{errors.password.message}</p>}
                </div>

                <div className="text-left">
                    <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline text-white/80">
                        نسيت كلمة المرور؟
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary/40 transition-colors disabled:opacity-60"
                >
                    {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تسجيل الدخول'}
                </button>
            </form>

            <div className="mt-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/15" />
                <div className="text-xs font-bold text-white/60">أو تابع عبر</div>
                <div className="h-px flex-1 bg-white/15" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" className="h-11 rounded-xl bg-white/5 border border-white/10 text-white/80 font-bold hover:bg-white/10">
                    جوجل
                </button>
                <button type="button" className="h-11 rounded-xl bg-white/5 border border-white/10 text-white/80 font-bold hover:bg-white/10">
                    آبل
                </button>
            </div>

            <p className="mt-7 text-center text-sm text-white/60">
                ليس لديك حساب؟{' '}
                <Link href="/register" className="font-extrabold text-primary hover:underline text-white/90">
                    إنشاء حساب
                </Link>
            </p>
        </AuthSplitLayout>
    );
}

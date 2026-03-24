'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['student', 'instructor']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterClient() {
    const router = useRouter();
    const { register: registerUser, isRegistering } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'student',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setErrorMsg(null);
        try {
            if (!agreeTerms) {
                setErrorMsg('يرجى الموافقة على الشروط والأحكام للمتابعة.');
                return;
            }

            const res = await registerUser(data);

            // Backend may require email verification (student) or admin approval (instructor).
            if (res?.data?.verification_required) {
                Cookies.remove('auth_token');
                router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
                return;
            }

            if (res?.data?.approval_required) {
                Cookies.remove('auth_token');
                router.push('/instructor-pending');
                return;
            }
        } catch (error: any) {
            if (error.errors) {
                Object.keys(error.errors).forEach((key) => {
                    setError(key as any, {
                        type: 'manual',
                        message: error.errors[key][0],
                    });
                });
            } else {
                setErrorMsg(error.message || 'Registration failed');
            }
        }
    };

    return (
        <AuthSplitLayout title="إنشاء حساب" subtitle="سجّل الآن لتبدأ بالتعلّم أو التدريس">
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-200 rounded-lg text-sm font-medium border border-red-500/20">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-white/90 mb-1.5">الاسم الكامل</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            {...register('name')}
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all sm:text-sm"
                            placeholder="الاسم"
                        />
                    </div>
                    {errors.name && <p className="mt-1.5 text-xs text-red-200">{errors.name.message}</p>}
                </div>

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

                <div>
                    <label className="block text-sm font-bold text-white/80 mb-3">أريد أن أكون:</label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="student"
                                {...register('role')}
                                className="peer sr-only"
                            />
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:bg-white/10 transition-all peer-checked:border-primary peer-checked:bg-primary/10">
                                <span className="text-sm font-bold text-white/90">طالب</span>
                            </div>
                        </label>

                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="instructor"
                                {...register('role')}
                                className="peer sr-only"
                            />
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:bg-white/10 transition-all peer-checked:border-primary peer-checked:bg-primary/10">
                                <span className="text-sm font-bold text-white/90">مدرس</span>
                            </div>
                        </label>
                    </div>
                    {errors.role && <p className="mt-1.5 text-xs text-red-200">{errors.role.message}</p>}
                </div>

                <label className="flex items-start gap-3 pt-2">
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span className="text-xs leading-relaxed text-white/70">
                        أوافق على <span className="text-white/90 font-bold">الشروط والأحكام</span> و <span className="text-white/90 font-bold">سياسة الخصوصية</span>
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary/40 transition-colors disabled:opacity-60 mt-2"
                >
                    {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء حساب'}
                </button>
            </form>

            <div className="mt-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/15" />
                <div className="text-xs font-bold text-white/60">أو أنشئ عبر</div>
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
                هل لديك حساب؟{' '}
                <Link href="/login" className="font-extrabold text-primary hover:underline text-white/90">
                    تسجيل الدخول
                </Link>
            </p>
        </AuthSplitLayout>
    );
}

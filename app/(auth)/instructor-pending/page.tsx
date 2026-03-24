'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';

export default function InstructorPendingPage() {
    const { user } = useAuth();
    const msg = user
        ? 'إذا تم تفعيل حسابك بالفعل، انتقل إلى لوحة المدرّس.'
        : 'طلبك قيد المراجعة من قبل مسؤولي الموقع.';

    return (
        <AuthSplitLayout title="طلبك قيد المراجعة" subtitle="سوف يتم اعتماد حسابك من مسؤولي الموقع.">
            <p className="text-sm text-white/70 leading-relaxed mb-5">{msg}</p>
            <div className="text-sm text-white/60 mb-6">
                راح توصل إشعار عبر البريد الإلكتروني عند اعتماد الحساب. بعد الاعتماد تقدر تسجّل دخول عاديًا.
            </div>

            <Link href="/login" className="text-primary font-bold hover:underline text-white/90">
                العودة لتسجيل الدخول
            </Link>
        </AuthSplitLayout>
    );
}


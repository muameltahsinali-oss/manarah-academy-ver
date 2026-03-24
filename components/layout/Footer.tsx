"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold tracking-tight">منارة اكاديمي</span>
                            <span className="h-2 w-2 bg-primary rounded-full" />
                        </Link>
                        <p className="text-sm text-text/60 max-w-xs">
                            تعلّم بمنهجية يركز على الدقة والوضوح. بلا فوضى.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">المنصة</h3>
                        <ul className="space-y-2 text-sm text-text/60">
                            <li><Link href="/courses" className="hover:text-primary transition-colors">الدورات</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">كيف يعمل</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">لوحة التحكم</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">روابط إضافية</h3>
                        <ul className="space-y-2 text-sm text-text/60">
                            <li><Link href="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
                            <li><Link href="/instructor-info" className="hover:text-primary transition-colors">كن مدرّباً</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text/40">
                    <p>© {new Date().getFullYear()} منارة اكاديمي. جميع الحقوق محفوظة.</p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="hover:text-primary transition-colors" aria-label="تويتر">تويتر</Link>
                        <Link href="#" className="hover:text-primary transition-colors" aria-label="جيت هاب">جيت هاب</Link>
                        <Link href="#" className="hover:text-primary transition-colors" aria-label="لينكد إن">لينكد إن</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

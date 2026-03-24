import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
    title: "الشروط والأحكام | منارة اكاديمي",
    description: "شروط استخدام منارة اكاديمي والخدمات المرتبطة بها.",
};

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-[60vh]">
            <Section spacing="xl" className="bg-background">
                <Container className="max-w-3xl">
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                        قانوني
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-8">
                        الشروط والأحكام
                    </h1>
                    <p className="text-text/60 text-sm mb-12">
                        آخر تحديث: مارس 2026
                    </p>
                    <div className="prose prose-lg text-text/80 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">1. قبول الشروط</h2>
                            <p>
                                باستخدامك منارة اكاديمي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا
                                توافق عليها، يرجى عدم استخدام المنصة.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">2. استخدام الخدمة</h2>
                            <p>
                                تقدم المنصة محتوى تعليمياً للاستخدام الشخصي. لا يجوز إعادة نشر المحتوى أو
                                مشاركته بشكل يخالف حقوق الملكية الفكرية. يجب استخدام الحساب بمعلومات صحيحة
                                والحفاظ على سرية كلمة المرور.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">3. الدفع والإلغاء</h2>
                            <p>
                                الدورات المدفوعة تخضع لسياسة الدفع المعروضة عند الشراء. قد نقدم سياسة استرداد
                                خلال فترة محددة حسب نوع الدورة. الشهادات والإنجازات تبقى مرتبطة بحسابك بعد
                                الإكمال.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">4. المحتوى والملكية</h2>
                            <p>
                                المحتوى التعليمي مملوك لـ منارة اكاديمي أو المدرّسين المعتمدين. لا يُسمح بنسخ أو
                                توزيع المحتوى دون إذن كتابي.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">5. التعديلات</h2>
                            <p>
                                نحتفظ بحق تعديل هذه الشروط. سنوضح أي تغييرات جوهرية عبر المنصة أو البريد.
                                استمرارك في الاستخدام بعد التعديل يعني موافقتك على الشروط المحدثة.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">6. التواصل</h2>
                            <p>
                                للاستفسارات: <Link href="/contact" className="text-primary hover:underline">اتصل بنا</Link>.
                            </p>
                        </section>
                    </div>
                    <div className="mt-12 pt-8 border-t border-border">
                        <Link href="/" className="text-primary font-medium hover:underline">
                            ← العودة للرئيسية
                        </Link>
                    </div>
                </Container>
            </Section>
        </div>
    );
}

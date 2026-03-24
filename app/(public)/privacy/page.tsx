import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
    title: "سياسة الخصوصية | منارة اكاديمي",
    description: "سياسة الخصوصية وحماية البيانات في منارة اكاديمي.",
};

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-[60vh]">
            <Section spacing="xl" className="bg-background">
                <Container className="max-w-3xl">
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                        قانوني
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-8">
                        سياسة الخصوصية
                    </h1>
                    <p className="text-text/60 text-sm mb-12">
                        آخر تحديث: مارس 2026
                    </p>
                    <div className="prose prose-lg text-text/80 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">1. مقدمة</h2>
                            <p>
                                تحترم منارة اكاديمي خصوصيتك وتلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية
                                جمعنا واستخدامنا وحماية معلوماتك عند استخدام المنصة.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">2. البيانات التي نجمعها</h2>
                            <p>
                                قد نجمع بيانات مثل الاسم، البريد الإلكتروني، ومعلومات الحساب اللازمة لتقديم الخدمة،
                                تحسين تجربة التعلم، وإصدار الشهادات. لا نبيع بياناتك الشخصية لأطراف ثالثة.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">3. استخدام البيانات</h2>
                            <p>
                                نستخدم البيانات لتشغيل المنصة، إرسال إشعارات ذات صلة بتقدمك، وتحسين المحتوى
                                والمنتج. قد نستخدم بيانات مجمعة لأغراض إحصائية دون تحديد هوية المستخدمين.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">4. الأمان</h2>
                            <p>
                                نطبق إجراءات تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به أو
                                الفقدان أو التعديل.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-text mb-4">5. التواصل</h2>
                            <p>
                                لأي استفسار حول الخصوصية، يرجى <Link href="/contact" className="text-primary hover:underline">اتصالنا</Link>.
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

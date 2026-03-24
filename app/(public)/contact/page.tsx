import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
    title: "اتصل بنا | منارة اكاديمي",
    description: "تواصل مع فريق منارة اكاديمي للاستفسارات والدعم.",
};

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-[60vh]">
            <Section spacing="xl" className="bg-background">
                <Container className="max-w-2xl">
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                        الدعم
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-8">
                        اتصل بنا
                    </h1>
                    <p className="text-lg text-text/70 mb-12">
                        لديك سؤال أو استفسار؟ نرحب برسائلك ونسعى للرد في أقرب وقت.
                    </p>
                    <div className="space-y-6 border border-border rounded-[4px] p-8 bg-white">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-[4px] bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-bold text-text mb-1">البريد الإلكتروني</h2>
                                <a
                                    href="mailto:support@platformx.example"
                                    className="text-primary hover:underline"
                                >
                                    support@platformx.example
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-[4px] bg-primary/10 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-bold text-text mb-1">الدعم الفني</h2>
                                <p className="text-text/70 text-sm">
                                    للاستفسارات التقنية أو مشاكل في الدورة، راسلنا على نفس البريد مع تفاصيل المشكلة.
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-sm text-text/50">
                        يمكنك أيضاً تصفح <Link href="/courses" className="text-primary hover:underline">الدورات</Link> أو
                        قراءة <Link href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link> و
                        <Link href="/terms" className="text-primary hover:underline">الشروط والأحكام</Link>.
                    </p>
                </Container>
            </Section>
        </div>
    );
}

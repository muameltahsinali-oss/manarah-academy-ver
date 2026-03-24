import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "من نحن | منارة اكاديمي",
    description: "تعرف على منارة اكاديمي ورؤيتنا لتعليم تقني منهجي.",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-[60vh]">
            <Section spacing="xl" className="bg-background">
                <Container className="max-w-3xl">
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                        المنصة
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-8">
                        من نحن
                    </h1>
                    <div className="prose prose-lg text-text/80 space-y-6">
                        <p>
                            منارة اكاديمي منصة تعليمية تركز على <strong>المنهجية والدقة</strong>. نقدم مسارات تعلم
                            مهيكلة مصممة هندسياً لتحقيق أقصى استفادة من وقت المتعلم.
                        </p>
                        <p>
                            نؤمن بأن التعلّم التقني يجب أن يكون واضحاً، مرتباً، وقابلاً للتطبيق فوراً. لذلك
                            صممنا دوراتنا مع وحدات متسلسلة، دروس فيديو، تمارين عملية، وشهادات إتمام.
                        </p>
                        <p>
                            سواء كنت مطوّراً مبتدئاً أو محترفاً يريد تطوير مهاراته، منارة اكاديمي توفر لك بيئة
                            واحدة للتعلّم، التتبع، والإنجاز.
                        </p>
                    </div>
                    <div className="mt-12 flex flex-wrap gap-4">
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 h-12 px-6 bg-primary text-white font-medium rounded-[4px] hover:bg-primary/90 transition-colors"
                        >
                            تصفح الدورات
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 h-12 px-6 border border-border font-medium rounded-[4px] hover:bg-border/20 transition-colors"
                        >
                            اتصل بنا
                        </Link>
                    </div>
                </Container>
            </Section>
        </div>
    );
}

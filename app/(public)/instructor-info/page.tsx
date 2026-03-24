import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CheckCircle, Video, Award, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
    title: "كن مدرّباً | منارة اكاديمي",
    description: "انضم كمدرب في منارة اكاديمي وشارك خبرتك مع آلاف المتعلمين.",
};

const benefits = [
    {
        icon: Video,
        title: "أدوات إنشاء احترافية",
        description: "رفع فيديوهات، بناء المنهج، وإدارة الدروس من لوحة تحكم واحدة.",
    },
    {
        icon: BarChart3,
        title: "تحليلات وتقارير",
        description: "تتبع عدد الطلاب، معدل الإكمال، والإيرادات بشكل واضح.",
    },
    {
        icon: Award,
        title: "شهادات للطلاب",
        description: "إصدار شهادات إتمام تلقائية عند إكمال الطالب للدورة.",
    },
    {
        icon: CheckCircle,
        title: "دعم فني",
        description: "فريق دعم لمساعدتك في نشر دوراتك وإجابة استفساراتك.",
    },
];

export default function InstructorInfoPage() {
    return (
        <div className="flex flex-col min-h-[60vh]">
            <Section spacing="xl" className="bg-background">
                <Container className="max-w-4xl">
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">
                        للمدرّسين
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-6">
                        كن مدرّباً على منارة اكاديمي
                    </h1>
                    <p className="text-xl text-text/70 mb-12 max-w-2xl">
                        لديك خبرة وتريد مشاركتها؟ انضم كمدرب وابنِ دوراتك، وصل إلى آلاف الطلاب، واحصل على
                        تحليلات وإيرادات منظمة.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {benefits.map((b) => (
                            <div
                                key={b.title}
                                className="flex gap-4 p-6 border border-border rounded-[4px] bg-white hover:border-primary/20 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-[4px] bg-primary/10 flex items-center justify-center shrink-0">
                                    <b.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-text mb-2">{b.title}</h2>
                                    <p className="text-sm text-text/70">{b.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border border-primary/20 rounded-[4px] bg-primary/5 p-8">
                        <h2 className="text-xl font-bold text-text mb-4">كيف أبدأ؟</h2>
                        <ol className="list-decimal list-inside space-y-2 text-text/80 mb-8">
                            <li>أنشئ حساباً واختر دور «مدرّب» عند التسجيل.</li>
                            <li>ادخل إلى لوحة تحكم المدرّب وأنشئ دورتك الأولى.</li>
                            <li>أضف الوحدات والدروس، ثم انشر الدورة للطلاب.</li>
                        </ol>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-white font-medium rounded-[4px] hover:bg-primary/90 transition-colors"
                        >
                            التسجيل كمدرب
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-text/50">
                        لديك أسئلة؟ <Link href="/contact" className="text-primary hover:underline">اتصل بنا</Link>.
                    </p>
                </Container>
            </Section>
        </div>
    );
}

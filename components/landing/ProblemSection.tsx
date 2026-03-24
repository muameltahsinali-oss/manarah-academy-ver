"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

const problems = [
    {
        title: "مسارات تعلم عشوائية",
        description: "تغرقك معظم المنصات في بحر من مقاطع الفيديو المنفصلة دون مسار واضح. تضيع ساعات في تحديد ما يجب أن تتعلمه بدلاً من النزول للعمل الفعلي.",
    },
    {
        title: "انعدام تتبع التقدم",
        description: "تشاهد الدروس ولكن ليس لديك فكرة عما إذا كنت تتطور فعلياً. لا يوجد مقاييس للاستيعاب، لا بيانات للاحتفاظ بالمهارة، ولا إثبات على اكتسابها.",
    },
    {
        title: "لا يوجد منهج مهيكل",
        description: "شروحات مبهمة تفتقد للمفاهيم الأساسية. عندما تحاول بناء شيء حقيقي، تدرك أنك تعرف فقط كتابة الأكواد، وليس هندسة النظام.",
    }
];

export function ProblemSection() {
    return (
        <Section spacing="xl" className="border-b border-border bg-white">
            <Container>
                <div className="max-w-2xl mb-16">
                    <h2 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4">المشكلة</h2>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-text leading-tight">
                        التعلم لا يجب أن يشبه التجول في متاهة.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-x border-border md:border-x-0 md:rounded-none rounded-[4px] overflow-hidden">
                    {problems.map((problem, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                            className={`p-8 md:p-12 hover:bg-background transition-colors
                ${idx !== problems.length - 1 ? 'border-b md:border-b-0 md:border-l border-border' : ''}
              `}
                        >
                            <h4 className="text-xl font-bold mb-4">{problem.title}</h4>
                            <p className="text-text/70 leading-relaxed text-sm">
                                {problem.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

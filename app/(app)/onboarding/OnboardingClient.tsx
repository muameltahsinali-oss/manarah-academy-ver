'use client';

import { useMemo, useState, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ProgressHeader } from '@/components/onboarding/ProgressHeader';
import { SelectCard, selectCardItemVariants } from '@/components/onboarding/SelectCard';
import { StepActions } from '@/components/onboarding/StepActions';
import { StepShell } from '@/components/onboarding/StepShell';
import {
    BarChart3,
    BookOpen,
    BrainCircuit,
    CheckCircle2,
    Code,
    Compass,
    Gauge,
    Layers,
    Loader2,
    PenTool,
    Rocket,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react';

type InterestCode = 'web-dev' | 'ai' | 'programming-basics' | 'data-science' | 'ui-ux';
type LearningLevelCode = 'beginner' | 'intermediate' | 'advanced';
type GoalCode = 'career' | 'skill-upgrade' | 'consistency' | 'build-project';
type Step = 1 | 2 | 3 | 4 | 5;
type IconType = ComponentType<{ className?: string }>;

const TOTAL_STEPS = 5;

const INTERESTS: Array<{ code: InterestCode; label: string; desc: string; Icon: IconType }> = [
    { code: 'web-dev', label: 'تطوير الويب', desc: 'واجهات وتكاملات وتطوير عملي.', Icon: Code },
    { code: 'ai', label: 'الذكاء الاصطناعي', desc: 'نماذج وتطبيقات ذكية.', Icon: BrainCircuit },
    { code: 'programming-basics', label: 'أساسيات البرمجة', desc: 'ابدأ بثبات وبأساس قوي.', Icon: BookOpen },
    { code: 'data-science', label: 'علم البيانات', desc: 'تحليل وقراءة نتائج بذكاء.', Icon: BarChart3 },
    { code: 'ui-ux', label: 'UI/UX', desc: 'واجهات جميلة وتجارب مستخدم.', Icon: PenTool },
];

const LEVELS: Array<{ code: LearningLevelCode; label: string; desc: string; Icon: IconType }> = [
    { code: 'beginner', label: 'مبتدئ', desc: 'ابدأ بخطوات واضحة وإيقاع مريح.', Icon: Gauge },
    { code: 'intermediate', label: 'متوسط', desc: 'طور مهاراتك مع تطبيقات أعمق.', Icon: Layers },
    { code: 'advanced', label: 'متقدم', desc: 'تحديات أكثر لتسريع مستواك.', Icon: Rocket },
];

const GOALS: Array<{ code: GoalCode; label: string; desc: string; Icon: IconType }> = [
    { code: 'career', label: 'الانتقال المهني', desc: 'خطة واضحة للوصول لفرص أفضل.', Icon: Compass },
    { code: 'skill-upgrade', label: 'تطوير المهارات', desc: 'تعلم أعمق في مجال تخصصك.', Icon: Zap },
    { code: 'consistency', label: 'الالتزام اليومي', desc: 'بناء عادة تعلم مستمرة.', Icon: Target },
    { code: 'build-project', label: 'بناء مشروع حقيقي', desc: 'تطبيق عملي ينقل مهاراتك.', Icon: Code },
];

const stepVariants = {
    initial: { opacity: 0, y: 18, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -12, scale: 0.995, transition: { duration: 0.24, ease: "easeOut" as const } },
};

export default function OnboardingClient() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isSessionPending } = useAuth();

    const [step, setStep] = useState<Step>(1);
    const [serverMsg, setServerMsg] = useState<string | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<InterestCode[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<LearningLevelCode | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<GoalCode | null>(null);

    const selectedInterestSet = useMemo(() => new Set(selectedInterests), [selectedInterests]);

    const saveMutation = useMutation({
        mutationFn: (payload: { interests?: InterestCode[]; learning_level?: LearningLevelCode | null }) =>
            post<{ success: boolean; message: string }>('/user/interests', payload),
    });

    const goToDashboard = () => {
        router.replace("/");
    };

    const extractError = (err: unknown) => {
        if (err instanceof Error) return err.message;
        return 'تعذر حفظ بيانات التهيئة. حاول مرة أخرى.';
    };

    const nextStep = () => {
        setServerMsg(null);
        setStep((prev): Step => Math.min(TOTAL_STEPS, prev + 1) as Step);
    };

    const prevStep = () => {
        setServerMsg(null);
        setStep((prev): Step => Math.max(1, prev - 1) as Step);
    };

    const finishOnboarding = async () => {
        setServerMsg(null);
        try {
            const res = await saveMutation.mutateAsync({
                interests: selectedInterests,
                learning_level: selectedLevel,
            });
            toast.success(res?.message || 'تم تخصيص تجربتك بنجاح');
            await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            await queryClient.invalidateQueries({ queryKey: ['courses', 'recommended'] });
            goToDashboard();
        } catch (err: unknown) {
            setServerMsg(extractError(err));
        }
    };

    if (isSessionPending) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const selectedInterestLabels = INTERESTS.filter((it) => selectedInterestSet.has(it.code)).map((it) => it.label);
    const selectedLevelObj = LEVELS.find((l) => l.code === selectedLevel);
    const selectedGoalObj = GOALS.find((g) => g.code === selectedGoal);

    return (
        <div dir="rtl" className="min-h-screen bg-background relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <ProgressHeader step={step} totalSteps={TOTAL_STEPS} />

                {serverMsg ? (
                    <div className="mb-4 rounded-xl border border-primary/25 bg-primary/10 text-primary text-sm font-bold p-3">
                        {serverMsg}
                    </div>
                ) : null}

                <AnimatePresence mode="wait">
                    <motion.div key={step} variants={stepVariants} initial="initial" animate="animate" exit="exit">
                        {step === 1 ? (
                            <StepShell
                                title="مرحباً بك في منارة أكاديمي"
                                subtitle="تجربة تعلم مصممة لك. خطوات قصيرة، نتيجة أوضح، وبداية أقوى."
                            >
                                <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-white via-background to-primary/5 p-6 sm:p-8 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 mx-auto flex items-center justify-center">
                                        <Sparkles className="w-7 h-7" />
                                    </div>
                                    <p className="mt-5 text-text/70 leading-relaxed">
                                        استلهمنا هذا التدفق من أفضل تجارب onboarding: بداية واضحة مثل Notion،
                                        تدرج ذكي مثل Duolingo، وأناقة واجهات Stripe.
                                    </p>
                                    <StepActions onNext={nextStep} nextLabel="ابدأ التهيئة" />
                                </div>
                            </StepShell>
                        ) : null}

                        {step === 2 ? (
                            <StepShell
                                title="ما المواضيع التي تهمك؟"
                                subtitle="اختر اهتماماتك لنجهز لك محتوى ومسارات أنسب."
                            >
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >
                                    {INTERESTS.map((item) => (
                                        <SelectCard
                                            key={item.code}
                                            title={item.label}
                                            description={item.desc}
                                            icon={item.Icon}
                                            active={selectedInterestSet.has(item.code)}
                                            onClick={() => {
                                                setServerMsg(null);
                                                setSelectedInterests((prev) =>
                                                    prev.includes(item.code)
                                                        ? prev.filter((x) => x !== item.code)
                                                        : [...prev, item.code],
                                                );
                                            }}
                                        />
                                    ))}
                                </motion.div>
                                <StepActions
                                    canBack
                                    onBack={prevStep}
                                    onNext={nextStep}
                                    nextLabel="متابعة"
                                    disabled={selectedInterests.length === 0}
                                />
                            </StepShell>
                        ) : null}

                        {step === 3 ? (
                            <StepShell
                                title="اختر مستوى البداية"
                                subtitle="تحديد المستوى يساعدنا على ضبط سرعة التعلم والتمارين."
                            >
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                >
                                    {LEVELS.map((item) => (
                                        <SelectCard
                                            key={item.code}
                                            title={item.label}
                                            description={item.desc}
                                            icon={item.Icon}
                                            active={selectedLevel === item.code}
                                            onClick={() => {
                                                setServerMsg(null);
                                                setSelectedLevel(item.code);
                                            }}
                                        />
                                    ))}
                                </motion.div>
                                <StepActions
                                    canBack
                                    onBack={prevStep}
                                    onNext={nextStep}
                                    nextLabel="متابعة"
                                    disabled={!selectedLevel}
                                />
                            </StepShell>
                        ) : null}

                        {step === 4 ? (
                            <StepShell
                                title="ما هدفك الأساسي الآن؟"
                                subtitle="سنستخدمه لتحسين ترتيب الدروس والاقتراحات القادمة."
                            >
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >
                                    {GOALS.map((item) => (
                                        <SelectCard
                                            key={item.code}
                                            title={item.label}
                                            description={item.desc}
                                            icon={item.Icon}
                                            active={selectedGoal === item.code}
                                            onClick={() => setSelectedGoal(item.code)}
                                        />
                                    ))}
                                </motion.div>
                                <StepActions
                                    canBack
                                    onBack={prevStep}
                                    onNext={nextStep}
                                    nextLabel="معاينة الخطة"
                                    disabled={!selectedGoal}
                                />
                            </StepShell>
                        ) : null}

                        {step === 5 ? (
                            <StepShell
                                title="هذه تجربتك الشخصية جاهزة"
                                subtitle="ملخص سريع قبل البدء. يمكنك تعديل أي اختيار لاحقاً."
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="rounded-xl border border-border/80 bg-background p-4">
                                        <div className="text-xs text-text/60 mb-2">الاهتمامات</div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedInterestLabels.map((label) => (
                                                <span
                                                    key={label}
                                                    className="px-2.5 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-bold"
                                                >
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-border/80 bg-background p-4">
                                        <div className="text-xs text-text/60 mb-2">المستوى</div>
                                        <div className="font-bold text-text">{selectedLevelObj?.label}</div>
                                        <div className="text-xs text-text/60 mt-1">{selectedLevelObj?.desc}</div>
                                    </div>
                                    <div className="rounded-xl border border-border/80 bg-background p-4">
                                        <div className="text-xs text-text/60 mb-2">الهدف</div>
                                        <div className="font-bold text-text">{selectedGoalObj?.label}</div>
                                        <div className="text-xs text-text/60 mt-1">{selectedGoalObj?.desc}</div>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 p-4 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-accent" />
                                    <p className="text-sm text-text/80">
                                        أول توصياتك ستظهر في لوحة التحكم مع مسار مناسب لمستواك واهتماماتك.
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={finishOnboarding}
                                        disabled={saveMutation.isPending}
                                        className="h-12 px-6 rounded-xl bg-primary text-white font-extrabold hover:bg-primary/90 transition-colors disabled:opacity-55 flex items-center justify-center gap-2"
                                    >
                                        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        ابدأ التعلم الآن
                                    </button>
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={saveMutation.isPending}
                                        className="h-12 px-6 rounded-xl border border-border/80 bg-white text-text font-bold hover:bg-background transition-colors"
                                    >
                                        تعديل الاختيارات
                                    </button>
                                </div>
                            </StepShell>
                        ) : null}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}


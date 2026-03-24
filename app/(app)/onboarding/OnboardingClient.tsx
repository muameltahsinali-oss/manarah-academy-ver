/* eslint-disable no-magic-numbers */
'use client';

import { useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    BarChart3,
    BookOpen,
    BrainCircuit,
    CheckCircle2,
    Code,
    Gauge,
    Loader2,
    Layers,
    PenTool,
    Rocket,
    Sparkles,
} from 'lucide-react';

type InterestCode = 'web-dev' | 'ai' | 'programming-basics' | 'data-science' | 'ui-ux';
type LearningLevelCode = 'beginner' | 'intermediate' | 'advanced';
type Step = 1 | 2 | 3 | 4;

type IconType = ComponentType<{ className?: string }>;

const TOTAL_STEPS = 4;

const INTERESTS: Array<{
    code: InterestCode;
    label: string;
    desc: string;
    Icon: IconType;
}> = [
    { code: 'web-dev', label: 'تطوير الويب', desc: 'واجهات وتكاملات وتطوير عملي.', Icon: Code },
    { code: 'ai', label: 'الذكاء الاصطناعي', desc: 'نماذج وتطبيقات ذكية.', Icon: BrainCircuit },
    { code: 'programming-basics', label: 'أساسيات البرمجة', desc: 'ابدأ بثبات وبأساس قوي.', Icon: BookOpen },
    { code: 'data-science', label: 'علم البيانات', desc: 'تحليل وقراءة نتائج بذكاء.', Icon: BarChart3 },
    { code: 'ui-ux', label: 'UI/UX', desc: 'واجهات جميلة وتجارب مستخدم.', Icon: PenTool },
];

const LEVELS: Array<{
    code: LearningLevelCode;
    label: string;
    desc: string;
    Icon: IconType;
}> = [
    { code: 'beginner', label: 'مبتدئ', desc: 'ابدأ بخطوات واضحة وإيقاع مريح.', Icon: Gauge },
    { code: 'intermediate', label: 'متوسط', desc: 'طور مهاراتك مع تطبيقات أعمق.', Icon: Layers },
    { code: 'advanced', label: 'متقدم', desc: 'تحديات أكثر لتسريع مستواك.', Icon: Rocket },
];

const pageVariants = {
    initial: { opacity: 0, y: 16, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.3, ease: 'easeOut' } },
};

const cardsContainerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: 'easeOut' } },
};

function StepProgress({ step, total }: { step: Step; total: number }) {
    const progress = ((step - 1) / (total - 1)) * 100;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between gap-3 mb-3">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-extrabold text-xs font-mono"
                >
                    {step}/{total}
                </motion.div>

                <div className="text-xs text-text/60 font-bold">مرشدك خطوة بخطوة</div>
            </div>

            <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

function OnboardingLayout({ step, children }: { step: Step; children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background w-full flex items-center justify-center px-4 md:px-8 py-10" dir="rtl">
            <div className="w-full max-w-3xl mx-auto flex flex-col justify-center">
                <StepProgress step={step} total={TOTAL_STEPS} />
                {children}
            </div>
        </div>
    );
}

export default function OnboardingClient() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isLoading } = useAuth();

    const [step, setStep] = useState<Step>(1);
    const [selectedInterests, setSelectedInterests] = useState<InterestCode[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<LearningLevelCode | null>(null);
    const [serverMsg, setServerMsg] = useState<string | null>(null);

    const selectedSet = useMemo(() => new Set(selectedInterests), [selectedInterests]);

    type SavePayload = {
        interests?: InterestCode[];
        learning_level?: LearningLevelCode | null;
    };

    type SaveResponse = { success: boolean; message: string; data: unknown };

    const saveMutation = useMutation({
        mutationFn: (payload: SavePayload) => post<SaveResponse>('/user/interests', payload),
    });

    const toggleInterest = (code: InterestCode) => {
        setSelectedInterests((prev) => {
            const exists = prev.includes(code);
            if (exists) return prev.filter((x) => x !== code);
            return [...prev, code];
        });
    };

    const extractErrorMessage = (err: unknown) => {
        if (err instanceof Error) return err.message;
        return 'حدث خطأ أثناء الحفظ. حاول مرة أخرى.';
    };

    const persistInterestsAndGoNext = async (interests: InterestCode[]) => {
        setServerMsg(null);

        try {
            const res = await saveMutation.mutateAsync({ interests });
            toast.success(res?.message || 'تم حفظ الاهتمامات ✅');
            await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            setStep(3);
        } catch (err: unknown) {
            setServerMsg(extractErrorMessage(err));
        }
    };

    const persistLevelAndGoNext = async (level: LearningLevelCode | null) => {
        setServerMsg(null);

        try {
            const res = await saveMutation.mutateAsync({ learning_level: level });
            toast.success(res?.message || 'تم حفظ المستوى ✅');
            await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            setStep(4);
        } catch (err: unknown) {
            setServerMsg(extractErrorMessage(err));
        }
    };

    const goToDashboard = () => {
        if (user?.role === 'instructor') router.push('/instructor/dashboard');
        else router.push('/dashboard');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <OnboardingLayout step={step}>
            <AnimatePresence mode="wait">
                <motion.div key={step} variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    {serverMsg && (
                        <div className="mb-6 rounded-[4px] bg-red-500/10 border border-red-500/20 p-4 text-sm font-bold text-red-700">
                            {serverMsg}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
                                className="mx-auto w-12 h-12 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20"
                            >
                                <Sparkles className="w-6 h-6" />
                            </motion.div>

                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">مرحباً بك في منارة اكاديمي</h1>
                            <p className="mt-3 text-sm text-text/60">
                                رحلة تعلم مخصصة لك تبدأ باختيار اهتمامك ومستوى البداية.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <motion.button
                                    type="button"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 h-12 rounded-[4px] bg-primary text-white font-extrabold hover:bg-primary/90 transition-colors"
                                    onClick={() => {
                                        setServerMsg(null);
                                        setStep(2);
                                    }}
                                >
                                    ابدأ الآن
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-center md:text-right">اختر اهتماماتك</h2>
                            <p className="mt-2 text-sm text-text/60 text-center md:text-right">
                                نستخدم هذا لاقتراح دورات مناسبة لك بشكل أفضل.
                            </p>

                            <motion.div
                                className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
                                variants={cardsContainerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                {INTERESTS.map((it) => {
                                    const isActive = selectedSet.has(it.code);
                                    return (
                                        <motion.button
                                            key={it.code}
                                            type="button"
                                            variants={cardVariants}
                                            onClick={() => toggleInterest(it.code)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.985 }}
                                            animate={{ scale: isActive ? 1.02 : 1 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                            className={[
                                                'text-right rounded-[4px] border p-4 transition-all duration-200',
                                                isActive
                                                    ? 'bg-primary/10 border-primary/40'
                                                    : 'bg-white border-border/70 hover:border-primary/30 hover:bg-primary/5',
                                            ].join(' ')}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <it.Icon className="w-5 h-5 text-primary" />
                                                        <div className="font-bold">{it.label}</div>
                                                    </div>
                                                    <div className="text-xs text-text/60 mt-2">{it.desc}</div>
                                                </div>

                                                {isActive ? (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="text-primary"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </motion.span>
                                                ) : (
                                                    <span className="inline-block w-5 h-5" />
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </motion.div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.985 }}
                                    onClick={() => {
                                        if (selectedInterests.length === 0) {
                                            setServerMsg('اختر اهتماماً واحداً على الأقل أو اضغط تخطي الآن.');
                                            return;
                                        }
                                        void persistInterestsAndGoNext(selectedInterests);
                                    }}
                                    disabled={saveMutation.isPending}
                                    className="flex-1 h-12 rounded-[4px] bg-primary text-white font-extrabold hover:bg-primary/90 disabled:opacity-60 transition-colors"
                                >
                                    {saveMutation.isPending ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            جاري الحفظ...
                                        </div>
                                    ) : (
                                        'متابعة'
                                    )}
                                </motion.button>

                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.985 }}
                                    onClick={() => void persistInterestsAndGoNext([])}
                                    disabled={saveMutation.isPending}
                                    className="flex-1 h-12 rounded-[4px] bg-white border border-border/80 text-text font-bold hover:bg-background disabled:opacity-60 transition-colors"
                                >
                                    تخطي الآن
                                </motion.button>
                            </div>

                            <p className="mt-4 text-xs text-text/50 text-center md:text-right">
                                يمكنك تعديل الاهتمامات لاحقاً من إعدادات حسابك.
                            </p>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-center md:text-right">
                                ما مستوى البداية المناسب لك؟
                            </h2>
                            <p className="mt-2 text-sm text-text/60 text-center md:text-right">
                                هذا يساعدنا بتقديم مسار يناسبك بشكل أفضل.
                            </p>

                            <motion.div
                                className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
                                variants={cardsContainerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                {LEVELS.map((lvl) => {
                                    const isActive = selectedLevel === lvl.code;
                                    return (
                                        <motion.button
                                            key={lvl.code}
                                            type="button"
                                            variants={cardVariants}
                                            onClick={() => setSelectedLevel(lvl.code)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.985 }}
                                            animate={{ scale: isActive ? 1.02 : 1 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                            className={[
                                                'text-right rounded-[4px] border p-4 transition-all duration-200',
                                                isActive
                                                    ? 'bg-primary/10 border-primary/40'
                                                    : 'bg-white border-border/70 hover:border-primary/30 hover:bg-primary/5',
                                            ].join(' ')}
                                        >
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2">
                                                    <lvl.Icon className="w-5 h-5 text-primary" />
                                                    <div className="font-bold">{lvl.label}</div>
                                                </div>
                                                <div className="text-xs text-text/60">{lvl.desc}</div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-end">
                                                {isActive ? (
                                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <span className="inline-block w-5 h-5" />
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </motion.div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.985 }}
                                    onClick={() => {
                                        if (!selectedLevel) {
                                            setServerMsg('اختر مستوى واحداً على الأقل أو اضغط تخطي.');
                                            return;
                                        }
                                        void persistLevelAndGoNext(selectedLevel);
                                    }}
                                    disabled={saveMutation.isPending}
                                    className="flex-1 h-12 rounded-[4px] bg-primary text-white font-extrabold hover:bg-primary/90 disabled:opacity-60 transition-colors"
                                >
                                    {saveMutation.isPending ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            جاري الحفظ...
                                        </div>
                                    ) : (
                                        'متابعة'
                                    )}
                                </motion.button>

                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.985 }}
                                    onClick={() => void persistLevelAndGoNext(null)}
                                    disabled={saveMutation.isPending}
                                    className="flex-1 h-12 rounded-[4px] bg-white border border-border/80 text-text font-bold hover:bg-background disabled:opacity-60 transition-colors"
                                >
                                    تخطي
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6"
                            >
                                <motion.div
                                    animate={{ rotate: [0, -8, 0] }}
                                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                                >
                                    <CheckCircle2 className="w-8 h-8" />
                                </motion.div>
                            </motion.div>

                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">أنت جاهز بالكامل 🚀</h2>
                            <p className="mt-3 text-sm text-text/60">لنبدأ رحلة التعلم الخاصة بك.</p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <motion.button
                                    type="button"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={goToDashboard}
                                    className="flex-1 h-12 rounded-[4px] bg-primary text-white font-extrabold hover:bg-primary/90 transition-colors"
                                >
                                    الذهاب إلى لوحة التحكم
                                </motion.button>
                            </div>

                            <div className="mt-6 text-xs text-text/50">
                                يمكنك دائماً تعديل الاهتمامات والمستوى من إعدادات حسابك.
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}


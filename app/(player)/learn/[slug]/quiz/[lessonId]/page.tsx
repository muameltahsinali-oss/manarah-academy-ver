"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { LessonTabs } from "@/components/player/LessonTabs";
import { PlayerNextLessonDock } from "@/components/player/PlayerNextLessonDock";
import { usePlayer } from "@/components/player/PlayerContext";
import { useSubmitQuiz } from "@/lib/hooks/useCoursePlayer";
import { useLessonPage } from "@/lib/hooks/useLessonPage";
import { LessonPageLoading, LessonPageLocked, LessonPageNotFound } from "@/components/player/LessonPageShell";
import { QuizOptionCard, type QuizOptionFeedback } from "@/components/player/quiz/QuizOptionCard";
import { QuizProgressBar } from "@/components/player/quiz/QuizProgressBar";
import { QuizResultScreen } from "@/components/player/quiz/QuizResultScreen";
import { toast } from "sonner";
import { lessonHref, type LessonLike } from "@/lib/player/lessonRoutes";
import { readQuizAnswersDraft, writeQuizAnswersDraft, clearQuizAnswersDraft } from "@/lib/player/quizSessionStorage";
import { ClipboardList, Sparkles } from "lucide-react";

interface QuizQuestion {
    id: number | string;
    title: string;
    options: Array<{ id: number | string; text: string }>;
}

export default function QuizLessonPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const lessonIdParam = params.lessonId as string;
    const lessonId = Number(lessonIdParam);

    const { currentLessonId, setCurrentLessonId } = usePlayer();
    const submitQuiz = useSubmitQuiz(lessonId, slug);

    const {
        isLoading,
        error,
        isEnrolled,
        lesson,
        nextLesson,
        canNavigateToNext,
        nextHref,
    } = useLessonPage(slug, lessonId);

    const [answers, setAnswers] = useState<Record<string | number, string | number>>({});
    const [result, setResult] = useState<{ score: number; passed: boolean; passing_score: number } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionFeedback, setQuestionFeedback] = useState<
        Record<string, { is_correct: boolean; selected_option_id: string | number | null }>
    >({});
    const [showResultScreen, setShowResultScreen] = useState(false);

    const questions: QuizQuestion[] =
        lesson?.lesson_type === "quiz" && lesson.quiz_config?.questions ? lesson.quiz_config.questions : [];
    const passingScore: number =
        lesson?.lesson_type === "quiz" && typeof lesson.quiz_config?.passing_score === "number"
            ? lesson.quiz_config.passing_score
            : 100;
    const totalQuestions = questions.length;
    const currentQuestion = totalQuestions > 0 ? questions[currentIndex] : undefined;

    useEffect(() => {
        if (!Number.isNaN(lessonId) && currentLessonId !== lessonId) {
            setCurrentLessonId(lessonId);
        }
    }, [lessonId, currentLessonId, setCurrentLessonId]);

    useEffect(() => {
        setCurrentIndex(0);
        setQuestionFeedback({});
        setResult(null);
        setShowResultScreen(false);
        const draft = readQuizAnswersDraft(slug, lessonId);
        setAnswers(draft && Object.keys(draft).length > 0 ? (draft as Record<string | number, string | number>) : {});
    }, [lessonId, slug]);

    useEffect(() => {
        if (result) return;
        if (Object.keys(answers).length === 0) return;
        writeQuizAnswersDraft(slug, lessonId, answers as Record<string, string | number>);
    }, [answers, slug, lessonId, result]);

    const isAllAnswered = useMemo(() => {
        if (totalQuestions === 0) return false;
        return questions.every((q) => answers[String(q.id)] !== undefined && answers[String(q.id)] !== null);
    }, [questions, answers, totalQuestions]);

    const correctCount = useMemo(() => {
        return Object.values(questionFeedback).filter((v) => v.is_correct).length;
    }, [questionFeedback]);

    if (isLoading) {
        return <LessonPageLoading />;
    }

    if (error || !isEnrolled) {
        return <LessonPageLocked slug={slug} />;
    }

    if (!lesson) {
        return <LessonPageNotFound />;
    }

    if (lesson.lesson_type && lesson.lesson_type !== "quiz") {
        if (lesson.lesson_type === "video") {
            router.replace(`/learn/${slug}/video/${lesson.id}`);
        } else if (lesson.lesson_type === "documentation") {
            router.replace(`/learn/${slug}/docs/${lesson.id}`);
        } else {
            router.replace(`/learn/${slug}`);
        }
        return null;
    }

    const handleSelectOption = (questionId: string | number, optionId: string | number) => {
        setAnswers((prev) => ({ ...prev, [String(questionId)]: optionId }));
    };

    const handleSubmit = async () => {
        if (questions.length === 0) return;
        if (!isAllAnswered) {
            toast.error("يرجى اختيار إجابة لكل الأسئلة أولاً");
            return;
        }

        const payload = questions.map((q) => ({
            question_id: q.id,
            option_id: answers[String(q.id)],
        }));

        const submitRes = await submitQuiz.mutateAsync(payload as never);

        const qResults = (submitRes.data?.question_results ?? []) as Array<{
            question_id: string | number;
            selected_option_id: string | number | null;
            is_correct: boolean;
        }>;

        const map: Record<string, { is_correct: boolean; selected_option_id: string | number | null }> = {};
        qResults.forEach((r) => {
            map[String(r.question_id)] = { is_correct: !!r.is_correct, selected_option_id: r.selected_option_id ?? null };
        });

        setQuestionFeedback(map);
        setResult({
            score: submitRes.data.score,
            passed: submitRes.data.passed,
            passing_score: submitRes.data.passing_score,
        });
        setShowResultScreen(true);
        clearQuizAnswersDraft(slug, lessonId);
    };

    const handlePrev = () => {
        setCurrentIndex((i) => Math.max(0, i - 1));
    };

    const handleNext = () => {
        setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
    };

    const selectedOptionIdForCurrent = currentQuestion ? answers[String(currentQuestion.id)] : undefined;
    const isAnsweredCurrent = selectedOptionIdForCurrent !== undefined && selectedOptionIdForCurrent !== null;
    const isLastQuestion = totalQuestions > 0 && currentIndex >= totalQuestions - 1;
    const isPrimaryDisabled =
        submitQuiz.isPending || questions.length === 0 || (isLastQuestion ? !isAllAnswered : !isAnsweredCurrent);

    const handleRetry = () => {
        setAnswers({});
        setQuestionFeedback({});
        setResult(null);
        setCurrentIndex(0);
        setShowResultScreen(false);
        clearQuizAnswersDraft(slug, lessonId);
    };

    const handleContinueReview = () => {
        setShowResultScreen(false);
    };

    const handleNextLesson = () => {
        if (!result?.passed || !nextHref || !nextLesson) return;
        const nextId = Number((nextLesson as { id: unknown }).id);
        setCurrentLessonId(nextId);
        router.push(nextHref);
    };

    const nextDockHref = nextLesson ? lessonHref(slug, nextLesson as LessonLike) : null;
    const nextTitle = nextLesson ? (nextLesson as { title?: string }).title : null;
    const dockCanNavigate = !!(nextDockHref && (canNavigateToNext || result?.passed));

    return (
        <>
            <div className="flex flex-col w-full pb-28 md:pb-24">
                <PlayerHeader />

                <div className="flex flex-col p-4 md:p-8 md:px-12 w-full max-w-4xl mx-auto gap-10" dir="rtl">
                    <section className="bg-white border border-border/40 rounded-[4px] p-6 shadow-sm" aria-label="محتوى الاختبار">
                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <h1 className="text-xl font-bold text-text">{lesson.title}</h1>
                                <p className="text-sm text-text/60 mt-1">
                                    أجب عن الأسئلة التالية. يجب أن تحصل على درجة لا تقل عن {passingScore}% لاجتياز الدرس.
                                </p>
                            </div>
                            {totalQuestions > 0 && <QuizProgressBar currentIndex={currentIndex} total={totalQuestions} />}
                        </div>

                        {questions.length === 0 ? (
                            <div className="rounded-[4px] border border-dashed border-border/80 bg-primary/[0.03] p-8 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                                    <ClipboardList className="w-7 h-7" aria-hidden />
                                </div>
                                <h2 className="text-lg font-bold text-text mb-2">لم يُضف أسئلة بعد</h2>
                                <p className="text-sm text-text/60 max-w-md mx-auto leading-relaxed">
                                    هذا الاختبار فارغ حالياً. يحتاج المدرّب إلى إضافة أسئلة من لوحة المدرّسين. إن استمرّت المشكلة،
                                    تواصل مع الدعم مع ذكر رقم الدرس.
                                </p>
                            </div>
                        ) : result && showResultScreen ? (
                            <QuizResultScreen
                                scorePercent={result.score}
                                correctCount={correctCount}
                                total={totalQuestions}
                                passed={result.passed}
                                passingScore={result.passing_score}
                                questions={questions}
                                questionFeedback={questionFeedback}
                                onRetry={handleRetry}
                                onContinueReview={handleContinueReview}
                                onNextLesson={handleNextLesson}
                                nextLessonHref={result.passed ? nextHref : null}
                            />
                        ) : (
                            <div className="space-y-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentQuestion?.id ?? currentIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="border border-border/40 rounded-[4px] p-5"
                                        role="group"
                                        aria-labelledby={`quiz-q-${currentQuestion?.id}`}
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <div
                                                    id={`quiz-q-${currentQuestion?.id}`}
                                                    className="text-[11px] font-mono font-bold text-text/50 uppercase tracking-widest mb-2"
                                                >
                                                    سؤال {currentIndex + 1} من {totalQuestions}
                                                </div>
                                                <h2 className="text-lg font-bold text-text leading-relaxed">
                                                    {currentQuestion?.title}
                                                </h2>
                                            </div>

                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                                role="radiogroup"
                                                aria-labelledby={`quiz-q-${currentQuestion?.id}`}
                                            >
                                                {currentQuestion?.options.map((opt) => {
                                                    const qFeedback = currentQuestion
                                                        ? questionFeedback[String(currentQuestion.id)]
                                                        : undefined;
                                                    const isSelected = String(selectedOptionIdForCurrent) === String(opt.id);

                                                    let feedback: QuizOptionFeedback | null = null;
                                                    if (result && qFeedback && isSelected) {
                                                        feedback = qFeedback.is_correct ? { status: "correct" } : { status: "incorrect" };
                                                    }

                                                    return (
                                                        <QuizOptionCard
                                                            key={opt.id}
                                                            optionId={opt.id}
                                                            text={opt.text}
                                                            selected={isSelected}
                                                            onSelect={() =>
                                                                currentQuestion && handleSelectOption(currentQuestion.id, opt.id)
                                                            }
                                                            disabled={submitQuiz.isPending}
                                                            feedback={feedback}
                                                        />
                                                    );
                                                })}
                                            </div>

                                            {!result ? (
                                                <div className="text-xs text-text/50 flex items-center gap-2">
                                                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-primary/70" aria-hidden />
                                                    اختر إجابة واحدة للانتقال للسؤال التالي. تُحفظ مسودة الإجابات مؤقتاً في الجلسة.
                                                </div>
                                            ) : (
                                                currentQuestion && (
                                                    <div
                                                        className={[
                                                            "text-xs font-bold flex items-center gap-2",
                                                            questionFeedback[String(currentQuestion.id)]?.is_correct
                                                                ? "text-green-700"
                                                                : "text-red-700",
                                                        ].join(" ")}
                                                    >
                                                        {questionFeedback[String(currentQuestion.id)]?.is_correct
                                                            ? "إجابتك صحيحة"
                                                            : "إجابتك خاطئة"}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex items-center justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        disabled={submitQuiz.isPending || currentIndex === 0}
                                        className="px-6 py-2 rounded-[4px] bg-background border border-border/60 text-sm font-bold text-text/80 hover:bg-black/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        السابق
                                    </button>

                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (isLastQuestion) {
                                                await handleSubmit();
                                                return;
                                            }
                                            if (!isAnsweredCurrent) return;
                                            handleNext();
                                        }}
                                        disabled={isPrimaryDisabled}
                                        className="px-8 py-2 rounded-[4px] bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitQuiz.isPending
                                            ? "جاري التصحيح..."
                                            : isLastQuestion
                                              ? "إرسال الاختبار"
                                              : "التالي"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    <LessonTabs />
                </div>
            </div>

            <PlayerNextLessonDock nextLessonTitle={nextTitle} nextHref={nextDockHref} canNavigate={dockCanNavigate} />
        </>
    );
}

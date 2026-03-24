"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { LessonTabs } from "@/components/player/LessonTabs";
import { usePlayer } from "@/components/player/PlayerContext";
import { useCourseData, useSubmitQuiz } from "@/lib/hooks/useCoursePlayer";
import { Loader2, Lock } from "lucide-react";

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
    const { data: res, isLoading, error } = useCourseData(slug);
    const submitQuiz = useSubmitQuiz(lessonId);

    const [answers, setAnswers] = useState<Record<string | number, string | number>>({});
    const [result, setResult] = useState<{ score: number; passed: boolean; passing_score: number } | null>(null);

    useEffect(() => {
        if (!Number.isNaN(lessonId) && currentLessonId !== lessonId) {
            setCurrentLessonId(lessonId);
        }
    }, [lessonId, currentLessonId, setCurrentLessonId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-text/60">جاري تحميل الدورة...</p>
            </div>
        );
    }

    if (error || !res?.data?.is_enrolled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
                <div className="p-4 bg-primary/5 rounded-full">
                    <Lock className="w-12 h-12 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-text mb-2">عذراً، لا يمكنك الوصول لهذه الصفحة</h2>
                    <p className="text-sm text-text/60 max-w-md mx-auto">
                        يجب عليك الاشتراك في الدورة أولاً لتتمكن من الوصول إلى المحتوى التعليمي.
                    </p>
                </div>
                <button
                    onClick={() => router.push(`/courses/${slug}`)}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-[4px] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    الذهاب لصفحة الدورة
                </button>
            </div>
        );
    }

    const modules = res?.data?.modules || [];
    const allLessons = modules.flatMap((m: any) => m.lessons || []);
    const lessonIndex = allLessons.findIndex((l: any) => Number(l.id) === lessonId);
    const lesson = lessonIndex >= 0 ? allLessons[lessonIndex] : undefined;
    const nextLesson = lessonIndex >= 0 ? allLessons[lessonIndex + 1] : undefined;

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-sm font-medium text-text/60">لم يتم العثور على هذا الدرس.</p>
            </div>
        );
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

    const config = lesson.quiz_config || {};
    const questions: QuizQuestion[] = config.questions || [];
    const passingScore: number = config.passing_score ?? 100;

    const handleChange = (questionId: string | number, optionId: string | number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        const payload = Object.entries(answers).map(([question_id, option_id]) => ({
            question_id,
            option_id,
        }));
        const res = await submitQuiz.mutateAsync(payload as any);
        setResult({
            score: res.data.score,
            passed: res.data.passed,
            passing_score: res.data.passing_score,
        });
    };

    return (
        <div className="flex flex-col w-full pb-20">
            <PlayerHeader />

            <div className="flex flex-col p-4 md:p-8 md:px-12 w-full max-w-4xl mx-auto gap-10" dir="rtl">
                <section className="bg-white border border-border/40 rounded-[4px] p-6 shadow-sm">
                    <h1 className="text-xl font-bold mb-2 text-text">{lesson.title}</h1>
                    <p className="text-sm text-text/60 mb-6">
                        أجب عن الأسئلة التالية. يجب أن تحصل على درجة لا تقل عن {passingScore}% لاجتياز الدرس.
                    </p>

                    {questions.length === 0 ? (
                        <p className="text-sm text-text/60">لم يتم إعداد أسئلة لهذا الاختبار بعد.</p>
                    ) : (
                        <div className="space-y-6">
                            {questions.map((q, index) => (
                                <div key={q.id} className="border border-border/40 rounded-[4px] p-4">
                                    <h2 className="text-sm font-bold mb-3 text-text">
                                        سؤال {index + 1}: {q.title}
                                    </h2>
                                    <div className="space-y-2">
                                        {q.options.map((opt) => (
                                            <label
                                                key={opt.id}
                                                className="flex items-center gap-2 text-sm cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    className="w-4 h-4 accent-primary"
                                                    checked={answers[q.id] === opt.id}
                                                    onChange={() => handleChange(q.id, opt.id)}
                                                />
                                                <span>{opt.text}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={submitQuiz.isPending || questions.length === 0}
                            className="px-8 py-2 rounded-[4px] bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitQuiz.isPending ? "جاري التصحيح..." : "إرسال الاختبار"}
                        </button>

                        {result && result.passed && nextLesson && (
                            <button
                                type="button"
                                onClick={() => {
                                    const nextId = Number(nextLesson.id);
                                    const href =
                                        nextLesson.lesson_type === "documentation"
                                            ? `/learn/${slug}/docs/${nextId}`
                                            : nextLesson.lesson_type === "quiz"
                                                ? `/learn/${slug}/quiz/${nextId}`
                                                : `/learn/${slug}/video/${nextId}`;
                                    setCurrentLessonId(nextId);
                                    router.push(href);
                                }}
                                className="px-6 py-2 rounded-[4px] bg-secondary text-white text-xs md:text-sm font-bold hover:bg-secondary/90 transition-colors"
                            >
                                الانتقال للدرس التالي
                            </button>
                        )}
                    </div>

                    {result && (
                        <div className="mt-6 p-4 rounded-[4px] border text-sm font-bold bg-slate-50 border-slate-200 text-slate-800">
                            درجتك: {result.score}% —{" "}
                            {result.passed ? "تهانينا! اجتزت هذا الاختبار." : "لم تجتز الاختبار، حاول مرة أخرى."}
                        </div>
                    )}
                </section>

                <LessonTabs />
            </div>
        </div>
    );
}


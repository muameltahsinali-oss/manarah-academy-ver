"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Route,
    Plus,
    Loader2,
    Trash2,
    ChevronLeft,
    BookOpen,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getFadeUp, staggerContainer } from "@/lib/motion";
import {
    useLearningPaths,
    useGenerateLearningPath,
    useDeleteLearningPath,
    type LearningPathItem,
    type LearningPathCourse,
} from "@/lib/hooks/useLearningPaths";
import { isBackendImageUrl } from "@/lib/utils/image";

const DEFAULT_THUMB =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400";

export function LearningPathsClient() {
    const { data: res, isLoading } = useLearningPaths();
    const generatePath = useGenerateLearningPath();
    const deletePath = useDeleteLearningPath();
    const [goal, setGoal] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const paths: LearningPathItem[] = res?.data ?? [];

    const handleGenerate = async () => {
        const trimmed = goal.trim();
        if (!trimmed) {
            toast.error("أدخل هدف التعلم.");
            return;
        }
        try {
            const result = await generatePath.mutateAsync(trimmed);
            if (result?.data) {
                toast.success(result.message || "تم إنشاء مسار التعلم.");
                setGoal("");
                setExpandedId(result.data.id);
            } else {
                toast.error((result as any)?.message || "فشل إنشاء المسار.");
            }
        } catch (e: any) {
            toast.error(e?.message || "حدث خطأ. حاول مرة أخرى.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("حذف هذا المسار؟")) return;
        try {
            await deletePath.mutateAsync(id);
            toast.success("تم حذف المسار.");
            if (expandedId === id) setExpandedId(null);
        } catch (e: any) {
            toast.error(e?.message || "فشل الحذف.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto py-8 px-4">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                    <Route className="w-8 h-8 text-primary" />
                    مسارات التعلم بالذكاء الاصطناعي
                </h1>
                <p className="text-text/60 text-sm">
                    اكتب هدفك وسنرتب لك مسار تعلم من الدورات المتاحة على المنصة.
                </p>
            </motion.div>

            {/* Create path form */}
            <motion.div {...getFadeUp(0.08, 0.4)} className="rounded-[4px] border border-border bg-white p-6 shadow-sm">
                <label className="block text-sm font-medium text-text mb-3">
                    هدف التعلم
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="مثال: أريد تعلم تطوير الويب"
                        className="flex-1 h-12 px-4 rounded-[4px] border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        disabled={generatePath.isPending}
                    />
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={generatePath.isPending}
                        className="flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-medium rounded-[4px] hover:bg-primary/90 disabled:opacity-60 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
                    >
                        {generatePath.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                إنشاء المسار
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* List of paths */}
            <motion.div {...getFadeUp(0.12, 0.4)}>
                <h2 className="text-xl font-bold text-text mb-4">مساراتك</h2>
                {paths.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-[4px] bg-background/50"
                    >
                        <BookOpen className="w-12 h-12 text-text/20 mb-4" />
                        <p className="text-text/60 text-center">
                            لا توجد مسارات بعد. اكتب هدفك واضغط «إنشاء المسار».
                        </p>
                    </motion.div>
                ) : (
                    <motion.ul
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-4"
                    >
                        {paths.map((path, idx) => (
                            <PathCard
                                key={path.id}
                                path={path}
                                index={idx}
                                isExpanded={expandedId === path.id}
                                onToggle={() =>
                                    setExpandedId((id) => (id === path.id ? null : path.id))
                                }
                                onDelete={() => handleDelete(path.id)}
                            />
                        ))}
                    </motion.ul>
                )}
            </motion.div>
        </div>
    );
}

function PathCard({
    path,
    index,
    isExpanded,
    onToggle,
    onDelete,
}: {
    path: LearningPathItem;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    onDelete: () => void;
}) {
    const courses = path.courses ?? [];

    return (
        <motion.li
            variants={{
                initial: { opacity: 0, y: 16 },
                animate: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, delay: index * 0.06 },
                },
            }}
            className="rounded-[4px] border border-border bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 p-5 text-right hover:bg-background/30 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-text truncate">{path.title}</h3>
                    <p className="text-sm text-text/60 truncate mt-0.5">{path.goal}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-text/50">
                        {courses.length} دورات
                    </span>
                    <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronLeft className="w-5 h-5 text-text/50" />
                    </motion.span>
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0 border-t border-border">
                            <div className="flex items-center justify-between mt-4 mb-4">
                                <span className="text-xs font-mono text-primary uppercase tracking-widest">
                                    ترتيب المسار
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    حذف
                                </button>
                            </div>
                            <div className="space-y-4">
                                {courses
                                    .sort((a, b) => a.order - b.order)
                                    .map((course, stepIndex) => (
                                        <StepCourseCard
                                            key={course.id}
                                            course={course}
                                            stepNumber={stepIndex + 1}
                                            isLast={stepIndex === courses.length - 1}
                                        />
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    );
}

function StepCourseCard({
    course,
    stepNumber,
    isLast,
}: {
    course: LearningPathCourse;
    stepNumber: number;
    isLast: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: stepNumber * 0.05 }}
            className="relative flex gap-4 group"
        >
            {/* Step connector line */}
            {!isLast && (
                <div
                    className="absolute top-14 right-5 w-0.5 h-[calc(100%+1rem)] bg-border group-hover:bg-primary/30 transition-colors"
                    style={{ height: "calc(100% + 1rem)" }}
                />
            )}

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 text-primary font-mono font-bold shrink-0 z-10">
                {stepNumber}
            </div>

            <Link
                href={`/courses/${course.slug}`}
                className="flex-1 min-w-0 flex gap-4 p-4 rounded-[4px] border border-border bg-background/50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group/card"
            >
                <div className="relative w-24 h-16 rounded-[4px] overflow-hidden bg-border/30 shrink-0">
                    {course.thumbnail ? (
                        <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                            unoptimized={isBackendImageUrl(course.thumbnail)}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_THUMB;
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                            <BookOpen className="w-6 h-6 text-primary/40" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text group-hover/card:text-primary transition-colors truncate">
                        {course.title}
                    </h4>
                    {course.description && (
                        <p className="text-xs text-text/60 line-clamp-2 mt-0.5">
                            {course.description}
                        </p>
                    )}
                    {course.enrollment_progress > 0 && (
                        <div className="mt-2">
                            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.enrollment_progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <p className="text-[10px] font-mono text-text/50 mt-1">
                                التقدم: {course.enrollment_progress}%
                            </p>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

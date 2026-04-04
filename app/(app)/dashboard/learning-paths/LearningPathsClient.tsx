"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Route,
    Loader2,
    ChevronLeft,
    BookOpen,
    Sparkles,
    MessageSquare,
    Play,
    Send,
    Bot,
    User,
    Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getFadeUp, staggerContainer } from "@/lib/motion";
import {
    useLearningPaths,
    useCreateLearningPathDraft,
    useLearningPathDraftChat,
    useCommitLearningPath,
    useDeleteLearningPath,
    useActiveLearningPath,
    type LearningPathItem,
    type LearningPathCourse,
    type LearningPathDraftPayload,
    type ChatTurn,
    type SuggestedAction,
} from "@/lib/hooks/useLearningPaths";
import { isBackendImageUrl } from "@/lib/utils/image";

const DEFAULT_THUMB =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400";

const LEVEL_AR: Record<string, string> = {
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
};

function formatMoney(amount: number, currency: string): string {
    try {
        const locale = currency === "IQD" ? "ar-IQ" : "ar-SA";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            maximumFractionDigits: currency === "IQD" ? 0 : 2,
        }).format(amount);
    } catch {
        return `${currency === "IQD" ? amount.toFixed(0) : amount.toFixed(2)} ${currency}`;
    }
}

export function LearningPathsClient() {
    const { data: res, isLoading } = useLearningPaths();
    const { data: activeRes } = useActiveLearningPath();
    const createDraft = useCreateLearningPathDraft();
    const commitPath = useCommitLearningPath();
    const deletePath = useDeleteLearningPath();

    const [goal, setGoal] = useState("");
    const [draft, setDraft] = useState<LearningPathDraftPayload | null>(null);
    const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
    const [chatInput, setChatInput] = useState("");
    const [chatMode, setChatMode] = useState<"discussion" | "action">("discussion");
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const draftChat = useLearningPathDraftChat();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [draft?.chat_history]);

    const paths: LearningPathItem[] = res?.data ?? [];
    const activePath = activeRes?.data?.path ?? null;
    const hasActivePath = Boolean(activePath && activePath.status === "active");

    const handleGenerateDraft = async () => {
        const trimmed = goal.trim();
        if (!trimmed) {
            toast.error("أدخل هدف التعلم.");
            return;
        }
        try {
            const result = await createDraft.mutateAsync(trimmed);
            const d = result?.data;
            if (d) {
                setDraft(d);
                setSelectedStepIndex(0);
                setChatInput("");
                setChatMode("discussion");
                setGoal("");
                toast.success(result.message || "تم إنشاء مسودة المسار.");
            }
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err?.message || "حدث خطأ.");
        }
    };

    const handleSendChat = async (
        messageOverride?: string,
        modeOverride?: "discussion" | "action"
    ) => {
        if (!draft?.id) return;
        const text = (messageOverride ?? chatInput).trim();
        const mode = modeOverride ?? chatMode;
        if (!text) {
            toast.error(mode === "discussion" ? "اكتب سؤالك أو تعليقك." : "اكتب تعليمات التعديل.");
            return;
        }
        try {
            const result = await draftChat.mutateAsync({
                draft_id: draft.id,
                message: text,
                mode,
                ...(selectedStepIndex !== null ? { target_step_index: selectedStepIndex } : {}),
            });
            const d = result?.data;
            if (d) {
                setDraft(d);
                if (!messageOverride) setChatInput("");
                if (mode === "action" && d.change_summary) {
                    toast.success(d.change_summary, { duration: 4500 });
                }
            }
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err?.message || "فشل الإرسال.");
        }
    };

    const handleSuggestedAction = async (action: SuggestedAction) => {
        await handleSendChat(action.instruction, "action");
    };

    const handleCommit = async () => {
        if (!draft?.id) return;
        if (hasActivePath) {
            const ok = window.confirm(
                "لديك مسار نشط. بدء هذا المسار سيؤرشف المسار الحالي ويستبدله. هل تريد المتابعة؟"
            );
            if (!ok) return;
        }
        try {
            const result = await commitPath.mutateAsync({
                draft_id: draft.id,
                replace_active: true,
            });
            if (result?.data) {
                toast.success(result.message || "تم بدء المسار.");
                setDraft(null);
                setSelectedStepIndex(null);
            }
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err?.message || "فشل حفظ المسار.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("حذف هذا المسار؟")) return;
        try {
            await deletePath.mutateAsync(id);
            toast.success("تم حذف المسار.");
            if (expandedId === id) setExpandedId(null);
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err?.message || "فشل الحذف.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-8">
            <motion.div {...getFadeUp(0, 0.4)}>
                <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold tracking-tight">
                    <Route className="h-8 w-8 text-primary" />
                    مسارات التعلم بالذكاء الاصطناعي
                </h1>
                <p className="text-sm text-text/60">
                    أنشئ مسودة من هدفك، عدّل الخطوات مع الذكاء الاصطناعي، ثم اضغط «ابدأ المسار» لحفظه كمسار نشط
                    واحد.
                </p>
                {hasActivePath && activePath && (
                    <p className="mt-3 rounded-[4px] border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-text/80">
                        مسارك النشط: <strong>{activePath.title}</strong> — التقدّم{" "}
                        {activePath.percent_complete ?? 0}%
                    </p>
                )}
            </motion.div>

            {/* Create draft */}
            <motion.div
                {...getFadeUp(0.08, 0.4)}
                className="rounded-[4px] border border-border bg-white p-6 shadow-sm"
            >
                <label className="mb-3 block text-sm font-medium text-text">هدف التعلم</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="مثال: أريد تعلم تطوير الويب"
                        className="h-12 flex-1 rounded-[4px] border border-border px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        disabled={createDraft.isPending}
                    />
                    <button
                        type="button"
                        onClick={handleGenerateDraft}
                        disabled={createDraft.isPending}
                        className="flex h-12 items-center justify-center gap-2 rounded-[4px] bg-primary px-6 font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60"
                    >
                        {createDraft.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                إنشاء مسودة
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Draft builder */}
            <AnimatePresence>
                {draft && draft.courses?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-[4px] border-2 border-primary/30 bg-white p-6 shadow-md"
                    >
                        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-xl font-bold text-text">{draft.title || "مسار مسودة"}</h2>
                                <p className="text-sm text-text/60">{draft.goal}</p>
                                <p className="mt-1 font-mono text-[10px] text-text/45">
                                    مراجعة {draft.revision} — تنتهي الصلاحية قريباً
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCommit}
                                disabled={commitPath.isPending}
                                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[4px] bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60"
                            >
                                {commitPath.isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Play className="h-5 w-5" />
                                        ابدأ هذا المسار
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mb-6 grid gap-6 lg:grid-cols-2 lg:items-start">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-end justify-between gap-2">
                                    <p className="text-xs font-mono uppercase tracking-widest text-primary">
                                        الخطوات والتكلفة
                                    </p>
                                    {typeof draft.path_total_effective_price === "number" && (
                                        <p className="text-sm font-medium text-text">
                                            إجمالي تقريبي:{" "}
                                            <span className="font-mono text-primary">
                                                {formatMoney(
                                                    draft.path_total_effective_price,
                                                    draft.path_currency ?? "IQD"
                                                )}
                                            </span>
                                        </p>
                                    )}
                                </div>
                                {draft.courses
                                    .sort((a, b) => a.order - b.order)
                                    .map((course, idx) => (
                                        <DraftStepRow
                                            key={`${course.id}-${idx}`}
                                            course={course}
                                            stepIndex={idx}
                                            selected={selectedStepIndex === idx}
                                            onSelect={() => setSelectedStepIndex(idx)}
                                        />
                                    ))}
                            </div>

                            <div className="flex min-h-[320px] flex-col rounded-[4px] border border-border bg-background/50">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-text/80">
                                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                        مستشار المسار
                                    </span>
                                    <div className="flex rounded-[4px] border border-border bg-white p-0.5 text-[11px] font-medium">
                                        <button
                                            type="button"
                                            onClick={() => setChatMode("discussion")}
                                            className={`rounded-[2px] px-2 py-1 transition-colors ${
                                                chatMode === "discussion"
                                                    ? "bg-primary text-white"
                                                    : "text-text/60 hover:text-text"
                                            }`}
                                        >
                                            مناقشة
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setChatMode("action")}
                                            className={`flex items-center gap-1 rounded-[2px] px-2 py-1 transition-colors ${
                                                chatMode === "action"
                                                    ? "bg-primary text-white"
                                                    : "text-text/60 hover:text-text"
                                            }`}
                                        >
                                            <Zap className="h-3 w-3" />
                                            تنفيذ
                                        </button>
                                    </div>
                                </div>
                                <p className="px-3 pt-2 text-[11px] leading-relaxed text-text/50">
                                    {chatMode === "discussion"
                                        ? "اسأل عن الأسباب، الصعوبة، أو التكلفة — لن يُعدّل المسار حتى تختار «تنفيذ» وتؤكد التعديل."
                                        : "يُطبّق الذكاء الاصطناعي تغييراً فعلياً على ترتيب الدورات. اكتب طلبك بوضوح."}
                                    {selectedStepIndex !== null && (
                                        <span className="mr-1 block text-primary/90">
                                            التركيز: الخطوة {selectedStepIndex + 1}
                                        </span>
                                    )}
                                </p>
                                <div className="max-h-[220px] flex-1 space-y-3 overflow-y-auto px-3 py-3">
                                    {(!draft.chat_history || draft.chat_history.length === 0) && (
                                        <p className="text-center text-xs text-text/45">
                                            ابدأ بسؤال مثل: «لماذا أضفت هذه الدورة؟» أو «هل يوجد خيار أرخص؟»
                                        </p>
                                    )}
                                    {(draft.chat_history ?? []).map((turn, i) => (
                                        <ChatBubble key={i} turn={turn} />
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                                <SuggestedActionBar
                                    turns={draft.chat_history ?? []}
                                    onApply={handleSuggestedAction}
                                    busy={draftChat.isPending}
                                />
                                <div className="mt-auto border-t border-border p-3">
                                    <div className="flex gap-2">
                                        <textarea
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            rows={2}
                                            placeholder={
                                                chatMode === "discussion"
                                                    ? "سؤالك للمستشار…"
                                                    : "مثال: استبدل الخطوة 2 بدورة أسهل للمبتدئين"
                                            }
                                            className="min-h-[52px] flex-1 resize-none rounded-[4px] border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    void handleSendChat();
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => void handleSendChat()}
                                            disabled={draftChat.isPending}
                                            className="flex h-[52px] w-12 shrink-0 items-center justify-center rounded-[4px] bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                                            aria-label="إرسال"
                                        >
                                            {draftChat.isPending ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setDraft(null)}
                            className="mt-4 text-sm text-text/50 underline hover:text-text"
                        >
                            إلغاء المسودة
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Committed paths list */}
            <motion.div {...getFadeUp(0.12, 0.4)}>
                <h2 className="mb-4 text-xl font-bold text-text">مساراتك المحفوظة</h2>
                {paths.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-[4px] border border-dashed border-border bg-background/50 py-16">
                        <BookOpen className="mb-4 h-12 w-12 text-text/20" />
                        <p className="text-center text-text/60">
                            لا توجد مسارات محفوظة بعد. أنشئ مسودة ثم اضغط «ابدأ هذا المسار».
                        </p>
                    </div>
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
                                onToggle={() => setExpandedId((id) => (id === path.id ? null : path.id))}
                                onDelete={() => handleDelete(path.id)}
                            />
                        ))}
                    </motion.ul>
                )}
            </motion.div>
        </div>
    );
}

function DraftStepRow({
    course,
    stepIndex,
    selected,
    onSelect,
}: {
    course: LearningPathCourse;
    stepIndex: number;
    selected: boolean;
    onSelect: () => void;
}) {
    const currency = course.currency ?? "IQD";
    const free = course.is_free ?? (course.effective_price ?? course.price ?? 0) <= 0;
    const levelKey = (course.level ?? "beginner").toLowerCase();
    const levelLabel = LEVEL_AR[levelKey] ?? course.level ?? "";

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex w-full flex-col gap-2 rounded-[4px] border p-3 text-right transition-colors ${
                selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
        >
            <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                    {stepIndex + 1}
                </span>
                <div className="min-w-0 flex-1">
                    <span className="block font-medium text-text">{course.title}</span>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-text/55">
                        {levelLabel && <span>{levelLabel}</span>}
                        {typeof course.duration_minutes === "number" && course.duration_minutes > 0 && (
                            <span>≈ {course.duration_minutes} د</span>
                        )}
                        {typeof course.rating === "number" && course.rating > 0 && (
                            <span>★ {course.rating.toFixed(1)}</span>
                        )}
                    </div>
                </div>
                <PriceBadge free={free} amount={course.effective_price ?? course.price ?? 0} currency={currency} />
            </div>
        </button>
    );
}

function PriceBadge({ free, amount, currency }: { free: boolean; amount: number; currency: string }) {
    if (free) {
        return (
            <span className="shrink-0 rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-700">
                مجاني
            </span>
        );
    }
    return (
        <span className="shrink-0 rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-amber-900">
            {formatMoney(amount, currency)}
        </span>
    );
}

function ChatBubble({ turn }: { turn: ChatTurn }) {
    const isUser = turn.role === "user";
    return (
        <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isUser ? "bg-primary/20 text-primary" : "bg-text/10 text-text/70"
                }`}
            >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
                className={`max-w-[92%] rounded-[4px] px-3 py-2 text-sm leading-relaxed ${
                    isUser ? "bg-primary text-white" : "border border-border bg-white text-text"
                }`}
            >
                <p className="whitespace-pre-wrap">{turn.content}</p>
            </div>
        </div>
    );
}

function SuggestedActionBar({
    turns,
    onApply,
    busy,
}: {
    turns: ChatTurn[];
    onApply: (a: SuggestedAction) => void | Promise<void>;
    busy: boolean;
}) {
    const lastWithActions = [...turns].reverse().find((t) => t.role === "assistant" && t.suggested_actions?.length);
    if (!lastWithActions?.suggested_actions?.length) return null;

    return (
        <div className="mb-2 flex flex-wrap gap-2 px-3">
            {lastWithActions.suggested_actions!.map((a) => (
                <button
                    key={a.id}
                    type="button"
                    disabled={busy}
                    onClick={() => void onApply(a)}
                    className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15 disabled:opacity-50"
                >
                    {a.label}
                </button>
            ))}
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
    const statusLabel =
        path.status === "active"
            ? "نشط"
            : path.status === "completed"
              ? "مكتمل"
              : path.status === "archived"
                ? "مؤرشف"
                : "";

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
            className="overflow-hidden rounded-[4px] border border-border bg-white shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 p-5 text-right hover:bg-background/30"
            >
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-bold text-text">{path.title}</h3>
                    <p className="mt-0.5 truncate text-sm text-text/60">{path.goal}</p>
                    {statusLabel && (
                        <span className="mt-1 inline-block rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                            {statusLabel}
                            {typeof path.percent_complete === "number" ? ` — ${path.percent_complete}%` : ""}
                        </span>
                    )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                    {typeof path.path_total_effective_price === "number" && (
                        <span className="font-mono text-[11px] font-medium text-primary">
                            {formatMoney(path.path_total_effective_price, path.path_currency ?? "IQD")}
                        </span>
                    )}
                    <span className="font-mono text-xs text-text/50">{courses.length} دورات</span>
                    <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronLeft className="h-5 w-5 text-text/50" />
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
                        <div className="border-t border-border px-5 pb-5 pt-0">
                            <div className="mb-4 mt-4 flex items-center justify-between">
                                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                                    ترتيب المسار
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
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
            className="group relative flex gap-4"
        >
            {!isLast && (
                <div
                    className="absolute right-5 top-14 z-0 w-0.5 bg-border transition-colors group-hover:bg-primary/30"
                    style={{ height: "calc(100% + 1rem)" }}
                />
            )}

            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 font-mono font-bold text-primary">
                {stepNumber}
            </div>

            <Link
                href={`/courses/${course.slug}`}
                className="group/card flex min-w-0 flex-1 gap-4 rounded-[4px] border border-border bg-background/50 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
            >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[4px] bg-border/30">
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
                            <BookOpen className="h-6 w-6 text-primary/40" />
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="min-w-0 truncate font-bold text-text transition-colors group-hover/card:text-primary">
                            {course.title}
                        </h4>
                        {(course.effective_price !== undefined || course.price !== undefined) && (
                            <PriceBadge
                                free={course.is_free ?? (course.effective_price ?? course.price ?? 0) <= 0}
                                amount={course.effective_price ?? course.price ?? 0}
                                currency={course.currency ?? "IQD"}
                            />
                        )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-text/50">
                        {course.level && (
                            <span>
                                {LEVEL_AR[(course.level ?? "").toLowerCase()] ?? course.level}
                            </span>
                        )}
                        {typeof course.duration_minutes === "number" && course.duration_minutes > 0 && (
                            <span>≈ {course.duration_minutes} د</span>
                        )}
                        {typeof course.rating === "number" && course.rating > 0 && (
                            <span>★ {course.rating.toFixed(1)}</span>
                        )}
                    </div>
                    {course.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-text/60">{course.description}</p>
                    )}
                    {course.enrollment_progress > 0 && (
                        <div className="mt-2">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                                <motion.div
                                    className="h-full rounded-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.enrollment_progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <p className="mt-1 font-mono text-[10px] text-text/50">
                                التقدم: {course.enrollment_progress}%
                            </p>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

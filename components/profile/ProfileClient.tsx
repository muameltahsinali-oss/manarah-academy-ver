"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getFadeUp } from "@/lib/motion";
import { Mail, Calendar, Edit2, ShieldCheck, Loader2, Save, X, Phone, Camera } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useStudentDashboard, useStudentCourses } from "@/lib/hooks/useDashboard";
import { useBadges } from "@/lib/hooks/useBadges";
import { useCertificates } from "@/lib/hooks/useCertificates";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ImageUpload } from "@/components/instructor/ImageUpload";
import { ProfileAchievementsSection } from "@/components/profile/ProfileAchievementsSection";
import { ProfileCertificatesSection } from "@/components/profile/ProfileCertificatesSection";

const profileSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    bio: z.string().max(200, "الوصف يجب أن لا يتجاوز 200 حرف").optional(),
    phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type EnrolledCourse = {
    id: number;
    title: string;
    slug: string;
    status: string;
    progress?: number;
};

function ActivityItem({ text, sub, time }: { text: string; sub: string; time: string }) {
    return (
        <div className="flex gap-4 text-right">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text/90">{text}</p>
                <p className="text-xs text-text/50">{sub}</p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-text/40">{time}</p>
            </div>
        </div>
    );
}

function SnapshotBar({ name, value, isCompleted }: { name: string; value: number; isCompleted?: boolean }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`truncate text-sm font-bold ${isCompleted ? "text-primary/80" : "text-text"}`}>{name}</span>
                <span className="shrink-0 text-[10px] font-mono text-text/50">{value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
                <div
                    className={`h-full ${isCompleted ? "bg-primary/50" : "bg-primary"} transition-all`}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
            </div>
        </div>
    );
}

function ProfilePageSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-8">
            <div className="h-10 w-64 animate-pulse rounded bg-border/50" />
            <div className="h-64 animate-pulse rounded-[4px] bg-border/40" />
        </div>
    );
}

export function ProfileClient() {
    const { user, isSessionPending, isUpdatingProfile, updateProfile } = useAuth();
    const { data: dashRes, isLoading: dashLoading } = useStudentDashboard();
    const { data: coursesRes, isLoading: coursesLoading } = useStudentCourses();
    const { data: badgesRes, isLoading: badgesLoading } = useBadges();
    const { data: certificatesRes, isLoading: certificatesLoading } = useCertificates();

    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", bio: "", phone: "" },
    });

    useEffect(() => {
        if (!user) return;
        reset({
            name: user.name,
            bio: user.bio ?? "",
            phone: user.phone ?? "",
        });
        setAvatar(user.avatar ?? null);
    }, [user, reset]);

    const dash = dashRes?.data;
    const courses: EnrolledCourse[] = coursesRes?.data ?? [];

    const completedCourses = dash?.completed_courses ?? 0;
    const certificatesCount = Array.isArray(certificatesRes?.data) ? certificatesRes.data.length : 0;
    const streakDays = dash?.streak?.current ?? user?.current_streak ?? 0;
    const earnedBadges = useMemo(
        () => (badgesRes?.data ?? []).filter((b) => b.is_earned).length,
        [badgesRes?.data]
    );

    const recentActivities = dash?.recent_activities ?? [];

    const progressSamples = useMemo(() => {
        const active = courses.filter((c) => c.status === "in-progress" || (c.progress ?? 0) > 0);
        return [...active]
            .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
            .slice(0, 3);
    }, [courses]);

    const joinedLabel = useMemo(() => {
        if (!user?.created_at) return "—";
        try {
            return format(parseISO(user.created_at), "MMMM yyyy", { locale: ar });
        } catch {
            return "—";
        }
    }, [user?.created_at]);

    /** حرفان كحد أقصى داخل صورة الملف الشخصي */
    const avatarInitials = useMemo(() => {
        if (!user?.name?.trim()) return "?";
        const parts = user.name.trim().split(/\s+/).filter(Boolean);
        let s = "";
        if (parts.length >= 2) {
            s = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts.length === 1) {
            s = parts[0].slice(0, 2).toUpperCase();
        }
        return s.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2) || "?";
    }, [user?.name]);

    if (isSessionPending) {
        return <ProfilePageSkeleton />;
    }

    if (!user) return null;

    const roleLabel = {
        student: "طالب",
        instructor: "مدرب",
        admin: "مسؤول",
    }[user.role];

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateProfile({
                ...data,
                email: user.email,
                avatar: avatar ?? user.avatar ?? undefined,
            });
            toast.success("تم تحديث الملف الشخصي بنجاح");
            setIsEditing(false);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "فشل في تحديث الملف الشخصي";
            toast.error(msg);
        }
    };

    const handleCancel = () => {
        reset({
            name: user.name,
            bio: user.bio ?? "",
            phone: user.phone ?? "",
        });
        setAvatar(user.avatar ?? null);
        setIsEditing(false);
    };

    const statsLoading = dashLoading || coursesLoading || badgesLoading || certificatesLoading;

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-6 md:py-8">
            <motion.div {...getFadeUp(0, 0.4)} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">الملف الشخصي</h1>
                    <p className="text-sm text-text/60">نظرة عامة على حسابك وإنجازاتك التعليمية.</p>
                </div>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setAvatar(user.avatar ?? null);
                            setIsEditing(true);
                        }}
                        className="flex h-11 min-h-[2.75rem] items-center justify-center gap-2 self-start rounded-[4px] border border-border/80 bg-white px-4 text-sm font-bold transition-colors hover:bg-black/[0.03]"
                    >
                        <Edit2 className="h-4 w-4" />
                        تعديل البيانات
                    </button>
                )}
            </motion.div>

            <motion.div
                {...getFadeUp(0.08, 0.45)}
                className="relative overflow-hidden rounded-[4px] border border-border/80 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] md:p-10"
            >
                <div
                    className="pointer-events-none absolute inset-0 border-b border-border/40 opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:text-right">
                    <div className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary/10 text-2xl font-bold leading-none tracking-tight text-primary transition-colors hover:bg-primary/15 md:text-3xl">
                        {avatar ?? user.avatar ? (
                            <img src={(avatar ?? user.avatar) as string} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="px-1 select-none" aria-hidden>
                                {avatarInitials}
                            </span>
                        )}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <Camera className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="w-full min-w-0 flex-1">
                        {isEditing ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4 text-right">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text/50">الصورة الشخصية</label>
                                    <ImageUpload
                                        value={avatar ?? user.avatar ?? ""}
                                        onChange={(url) => setAvatar(url || null)}
                                        collection="avatars"
                                    />
                                    <p className="text-[11px] font-medium text-text/50">يُحفظ الملف عند الضغط على «حفظ التغييرات».</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-text/50">الاسم الكامل</label>
                                        <input
                                            {...register("name")}
                                            autoComplete="name"
                                            className="min-h-[48px] w-full rounded-[4px] border border-border/60 bg-gray-50 px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm"
                                        />
                                        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-text/50">رقم الهاتف</label>
                                        <input
                                            {...register("phone")}
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            className="min-h-[48px] w-full rounded-[4px] border border-border/60 bg-gray-50 px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm"
                                            placeholder="05xxxxxxx"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text/50">نبذة تعريفية</label>
                                    <textarea
                                        {...register("bio")}
                                        rows={4}
                                        className="min-h-[120px] w-full resize-none rounded-[4px] border border-border/60 bg-gray-50 px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm"
                                        placeholder="اكتب شيئاً عنك..."
                                    />
                                    {errors.bio && <p className="text-xs text-red-600">{errors.bio.message}</p>}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="inline-flex h-11 min-h-[2.75rem] items-center gap-2 rounded-[4px] bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        حفظ التغييرات
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex h-11 min-h-[2.75rem] items-center gap-2 rounded-[4px] border border-border/80 bg-white px-6 text-sm font-bold transition-colors hover:bg-black/[0.03]"
                                    >
                                        <X className="h-4 w-4" />
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <h2 className="mb-1 text-2xl font-bold md:text-3xl">{user.name}</h2>
                                        <p className="text-sm text-text/60">{user.bio?.trim() ? user.bio : "لا يوجد وصف تعريفي حالياً."}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2 self-center rounded-[4px] bg-primary/10 px-3 py-1.5 text-xs font-mono font-bold text-primary md:self-start">
                                        <ShieldCheck className="h-4 w-4" />
                                        {roleLabel}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-text/60 md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 shrink-0 text-text/40" />
                                        <span className="break-all">{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 shrink-0 text-text/40" />
                                            {user.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 shrink-0 text-text/40" />
                                        انضم في {joinedLabel}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="relative z-10 mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-border/40 bg-border/40 md:grid-cols-4">
                    {[
                        {
                            label: "دورات مكتملة",
                            value: statsLoading ? null : completedCourses,
                            accent: "text-primary",
                        },
                        {
                            label: "أوسمة محققة",
                            value: statsLoading ? null : earnedBadges,
                            accent: "text-primary",
                        },
                        {
                            label: "شهادات",
                            value: statsLoading ? null : certificatesCount,
                            accent: "text-primary",
                        },
                        {
                            label: "أيام متصلة",
                            value: statsLoading ? null : streakDays,
                            accent: "text-accent",
                        },
                    ].map((cell) => (
                        <div key={cell.label} className="bg-white p-5 text-center md:text-right">
                            <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text/45 md:text-xs">{cell.label}</div>
                            {cell.value === null ? (
                                <div className="h-9 w-16 animate-pulse rounded bg-border/45" />
                            ) : (
                                <div
                                    className={`flex items-center justify-center gap-2 md:justify-start tabular-nums text-3xl font-bold ${cell.accent}`}
                                >
                                    {cell.value}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            <ProfileAchievementsSection />
            <ProfileCertificatesSection />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                <motion.div {...getFadeUp(0.2, 0.45)} className="rounded-[4px] border border-border/80 bg-white p-6 md:p-8">
                    <h3 className="mb-6 text-lg font-bold">نشاطات أخيرة</h3>
                    {dashLoading ? (
                        <div className="space-y-4 py-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-14 animate-pulse rounded bg-border/35" />
                            ))}
                        </div>
                    ) : recentActivities.length === 0 ? (
                        <p className="py-8 text-center text-sm text-text/50">لا يوجد نشاط مسجل بعد.</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {recentActivities.map((a: { id: number; title: string; course: string; time: string }) => (
                                <ActivityItem key={a.id} text={a.title} sub={a.course} time={a.time} />
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div {...getFadeUp(0.25, 0.45)} className="rounded-[4px] border border-border/80 bg-white p-6 md:p-8">
                    <h3 className="mb-6 text-lg font-bold">نبذة التقدم</h3>
                    {coursesLoading ? (
                        <div className="space-y-4 py-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-16 animate-pulse rounded bg-border/35" />
                            ))}
                        </div>
                    ) : progressSamples.length === 0 ? (
                        <p className="py-8 text-center text-sm text-text/50">لم تبدأ أي دورة بعد أو لا توجد دورات قيد الدراسة.</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {progressSamples.map((c) => (
                                <SnapshotBar
                                    key={c.id}
                                    name={c.title}
                                    value={c.progress ?? 0}
                                    isCompleted={c.status === "completed"}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

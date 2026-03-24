"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { MapPin, Mail, Calendar, Edit2, ShieldCheck, Zap, Loader2, Save, X, Phone, Camera } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ImageUpload } from "@/components/instructor/ImageUpload";

const profileSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    bio: z.string().max(200, "الوصف يجب أن لا يتجاوز 200 حرف").optional(),
    phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileClient() {
    const { user, isLoading, isUpdatingProfile, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name,
            bio: user?.bio,
            phone: user?.phone,
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    // Keep avatar state in sync once user is loaded
    if (avatar === null && user.avatar) {
        // setState during render is not allowed; will sync on first edit open instead
    }

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const roleLabel = {
        student: "طالب",
        instructor: "مدرب",
        admin: "مسؤول",
    }[user.role];

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateProfile({
                ...data,
                email: user.email, // backend requires email in updateProfile validation
                avatar: avatar ?? user.avatar,
            });
            toast.success("تم تحديث الملف الشخصي بنجاح");
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error.message || "فشل في تحديث الملف الشخصي");
        }
    };

    const handleCancel = () => {
        reset({
            name: user.name,
            bio: user.bio,
            phone: user.phone,
        });
        setAvatar(user.avatar ?? null);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-8">
            <motion.div {...getFadeUp(0, 0.4)} className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">الملف الشخصي</h1>
                    <p className="text-sm text-text/60">نظرة عامة على هويتك وإحصائياتك في منارة اكاديمي.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setAvatar(user.avatar ?? null);
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-border/80 bg-white hover:bg-black/5 text-sm font-bold rounded-[4px] transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        تعديل البيانات
                    </button>
                )}
            </motion.div>

            {/* Profile Header Card */}
            <motion.div
                {...getFadeUp(0.1, 0.5)}
                className="bg-white border border-border/80 rounded-[4px] p-8 md:p-12 relative overflow-hidden"
            >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 border-b border-border/40 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-right">
                    {/* Avatar */}
                    <div className="group w-32 h-32 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary shrink-0 relative overflow-hidden transition-all hover:bg-primary/20">
                        {(avatar ?? user.avatar) ? (
                            <img src={(avatar ?? user.avatar) as string} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 bg-accent border-2 border-white rounded-full" title="متصل" />
                    </div>

                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text/50">
                                        الصورة الشخصية
                                    </label>
                                    <ImageUpload
                                        value={avatar ?? user.avatar ?? ""}
                                        onChange={(url) => setAvatar(url || null)}
                                        collection="avatars"
                                    />
                                    <p className="text-[11px] text-text/50 font-medium">
                                        سيتم حفظ الصورة عند الضغط على “حفظ التغييرات”.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-text/50">الاسم الكامل</label>
                                        <input
                                            {...register("name")}
                                            className="w-full px-4 py-2 bg-gray-50 border border-border/60 rounded-[4px] text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-text/50">رقم الهاتف</label>
                                        <input
                                            {...register("phone")}
                                            className="w-full px-4 py-2 bg-gray-50 border border-border/60 rounded-[4px] text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="05xxxxxxx"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text/50">نبذة تعريفية</label>
                                    <textarea
                                        {...register("bio")}
                                        rows={2}
                                        className="w-full px-4 py-2 bg-gray-50 border border-border/60 rounded-[4px] text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        placeholder="اكتب شيئاً عنك..."
                                    />
                                    {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        حفظ التغييرات
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-6 py-2 bg-white border border-border/80 text-sm font-bold rounded-[4px] hover:bg-black/5 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                                    <div className="text-right">
                                        <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
                                        <p className="text-text/60 text-sm">{user.bio || "لا يوجد وصف تعريفي حالياً."}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 bg-primary/10 text-primary rounded-[4px]">
                                        <ShieldCheck className="w-4 h-4" />
                                        {roleLabel}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-text/60 font-medium font-mono">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        الرياض، السعودية
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {user.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        انضم في {format(new Date(), 'MMMM yyyy', { locale: ar })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Horizontal Stat Bar */}
                <div className="grid grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-[4px] mt-10 relative z-10 overflow-hidden text-center md:text-right">
                    <div className="bg-white p-6">
                        <div className="text-xs font-bold text-text/50 uppercase tracking-widest mb-2 font-mono">دورات مكتملة</div>
                        <div className="text-3xl font-bold font-mono text-primary">0</div>
                    </div>
                    <div className="bg-white p-6">
                        <div className="text-xs font-bold text-text/50 uppercase tracking-widest mb-2 font-mono">شهادات</div>
                        <div className="text-3xl font-bold font-mono text-primary">0</div>
                    </div>
                    <div className="bg-white p-6">
                        <div className="text-xs font-bold text-text/50 uppercase tracking-widest mb-2 font-mono">أيام متصلة</div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <div className="text-3xl font-bold font-mono text-accent">1</div>
                            <Zap className="w-5 h-5 text-accent" />
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Activity Feed Snippet */}
                <motion.div
                    {...getFadeUp(0.2, 0.5)}
                    className="border border-border/80 bg-white rounded-[4px] p-8"
                >
                    <h3 className="text-lg font-bold mb-6">نشاطات أخيرة</h3>
                    <div className="flex flex-col gap-6 relative text-center py-8">
                        <p className="text-sm text-text/50">لا يوجد نشاط مسجل بعد.</p>
                    </div>
                </motion.div>

                {/* Progress Snapshot */}
                <motion.div
                    {...getFadeUp(0.3, 0.5)}
                    className="border border-border/80 bg-white rounded-[4px] p-8"
                >
                    <h3 className="text-lg font-bold mb-6">نبذة التقدم</h3>
                    <div className="flex flex-col gap-6 text-center py-8">
                        <p className="text-sm text-text/50">لم تبدأ أي دورات بعد.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function ActivityItem({ text, time }: { text: string, time: string }) {
    return (
        <div className="flex gap-4 relative z-10">
            <div className="w-7 h-7 rounded-full bg-background border border-border/80 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div>
                <p className="text-sm font-bold text-text/80 leading-relaxed mb-1">{text}</p>
                <div className="text-[10px] font-mono uppercase tracking-widest text-text/40">{time}</div>
            </div>
        </div>
    );
}

function SnapshotBar({ name, value, isCompleted }: { name: string, value: number, isCompleted?: boolean }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-bold ${isCompleted ? "text-primary/80" : "text-text"}`}>{name}</span>
                <span className="text-[10px] font-mono text-text/50">{value}%</span>
            </div>
            <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                <div
                    className={`h-full ${isCompleted ? "bg-primary/50" : "bg-primary"} transition-all`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

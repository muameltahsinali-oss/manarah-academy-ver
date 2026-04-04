"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getFadeUp, getFadeIn } from "@/lib/motion";
import { useEffect, useState } from "react";
import { User, Shield, Sliders, Bell, Globe, Loader2 } from "lucide-react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateSettings, useChangePassword } from "@/lib/hooks/useProfile";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { mergeUserPreferences } from "@/lib/userPreferences";

const settingsSchema = z.object({
    fullName: z.string().min(2, "الاسم مطلوب"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().optional(),
    bio: z.string().max(500, "النبذة طويلة جداً").optional(),
    avatar: z.string().optional(),
    autoDarkMode: z.boolean(),
    animations: z.boolean(),
    hideLeaderboard: z.boolean(),
    autoFocus: z.boolean(),
    systemNotifications: z.boolean(),
    weeklyDigest: z.boolean(),
    socialNotifications: z.boolean(),
    promotions: z.boolean(),
    language: z.string(),
    timezone: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;
type Tab = "account" | "security" | "preferences" | "notifications" | "language";

const passwordSchema = z
    .object({
        current_password: z.string().min(1, "أدخل كلمة المرور الحالية"),
        password: z.string().min(8, "ثمانية أحرف على الأقل"),
        password_confirmation: z.string().min(1, "أكد كلمة المرور"),
    })
    .refine((d) => d.password === d.password_confirmation, {
        path: ["password_confirmation"],
        message: "كلمات المرور غير متطابقة",
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function SettingsPageSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-8">
            <div className="h-10 w-48 animate-pulse rounded bg-border/50" />
            <div className="h-96 animate-pulse rounded-[4px] bg-border/40" />
        </div>
    );
}

export function SettingsClient() {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const { user, isSessionPending: authLoading } = useAuth();
    const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateSettings();

    const prefs = mergeUserPreferences(user?.preferences);

    const methods = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            bio: "",
            avatar: "",
            autoDarkMode: prefs.ui.autoDarkMode,
            animations: prefs.ui.animations,
            hideLeaderboard: prefs.ui.hideLeaderboard,
            autoFocus: prefs.ui.autoFocus,
            systemNotifications: prefs.notifications.systemNotifications,
            weeklyDigest: prefs.notifications.weeklyDigest,
            socialNotifications: prefs.notifications.socialNotifications,
            promotions: prefs.notifications.promotions,
            language: prefs.language,
            timezone: prefs.timezone,
        },
        mode: "onChange",
    });

    const { reset, handleSubmit, formState } = methods;

    useEffect(() => {
        if (!user) return;
        const m = mergeUserPreferences(user.preferences);
        reset({
            fullName: user.name,
            email: user.email,
            phone: user.phone ?? "",
            bio: user.bio ?? "",
            avatar: user.avatar ?? "",
            autoDarkMode: m.ui.autoDarkMode,
            animations: m.ui.animations,
            hideLeaderboard: m.ui.hideLeaderboard,
            autoFocus: m.ui.autoFocus,
            systemNotifications: m.notifications.systemNotifications,
            weeklyDigest: m.notifications.weeklyDigest,
            socialNotifications: m.notifications.socialNotifications,
            promotions: m.notifications.promotions,
            language: m.language,
            timezone: m.timezone,
        });
    }, [user, reset]);

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            await updateSettings({
                name: data.fullName,
                email: data.email,
                phone: data.phone || null,
                bio: data.bio || null,
                avatar: data.avatar || null,
                preferences: {
                    ui: {
                        autoDarkMode: data.autoDarkMode,
                        animations: data.animations,
                        hideLeaderboard: data.hideLeaderboard,
                        autoFocus: data.autoFocus,
                    },
                    notifications: {
                        systemNotifications: data.systemNotifications,
                        weeklyDigest: data.weeklyDigest,
                        socialNotifications: data.socialNotifications,
                        promotions: data.promotions,
                    },
                    language: data.language,
                    timezone: data.timezone,
                },
            });
            toast.success("تم حفظ الإعدادات بنجاح");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "فشل تحديث الإعدادات";
            toast.error(msg);
        }
    };

    if (authLoading) {
        return <SettingsPageSkeleton />;
    }

    if (!user) {
        return null;
    }

    return (
        <FormProvider {...methods}>
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-6 md:py-8">
                <motion.div {...getFadeUp(0, 0.4)} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">الإعدادات</h1>
                        <p className="text-sm text-text/60">التحكم في حسابك وتفضيلات العرض والإشعارات.</p>
                    </div>
                    {activeTab !== "security" && (
                        <button
                            type="submit"
                            form="settings-main"
                            disabled={isUpdating || !formState.isDirty}
                            className="flex h-11 min-h-[2.75rem] items-center justify-center gap-2 self-start rounded-[4px] bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                    )}
                </motion.div>

                <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start md:gap-8">
                    <motion.div
                        {...getFadeUp(0.08, 0.4)}
                        className="w-full shrink-0 rounded-[4px] border border-border/80 bg-white p-3 md:w-64"
                    >
                        <TabButton active={activeTab === "account"} onClick={() => setActiveTab("account")} icon={User}>
                            الحساب الشخصي
                        </TabButton>
                        <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={Shield}>
                            الأمان وتسجيل الدخول
                        </TabButton>
                        <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={Sliders}>
                            تفضيلات العرض
                        </TabButton>
                        <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={Bell}>
                            تنبيهات النظام
                        </TabButton>
                        <TabButton active={activeTab === "language"} onClick={() => setActiveTab("language")} icon={Globe}>
                            اللغة والمنطقة
                        </TabButton>
                    </motion.div>

                    <div className="min-h-[420px] w-full flex-1 rounded-[4px] border border-border/80 bg-white shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)]">
                        <AnimatePresence mode="wait">
                            {activeTab === "security" ? (
                                <motion.div key="security" {...getFadeIn(0, 0.28)}>
                                    <SecurityTab />
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="settings-fields"
                                    id="settings-main"
                                    noValidate
                                    onSubmit={handleSubmit(onSubmit)}
                                    {...getFadeIn(0, 0.28)}
                                    className="min-h-[420px]"
                                >
                                    <div className={activeTab !== "account" ? "hidden" : ""}>
                                        <AccountTab />
                                    </div>
                                    <div className={activeTab !== "preferences" ? "hidden" : ""}>
                                        <PreferencesTab />
                                    </div>
                                    <div className={activeTab !== "notifications" ? "hidden" : ""}>
                                        <NotificationsTab />
                                    </div>
                                    <div className={activeTab !== "language" ? "hidden" : ""}>
                                        <LanguageTab />
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}

function TabButton({
    children,
    active,
    onClick,
    icon: Icon,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex min-h-[48px] w-full items-center gap-3 rounded-[4px] px-4 py-3 text-right text-sm font-bold transition-all touch-manipulation active:scale-[0.99] ${
                active ? "bg-primary/10 text-primary" : "text-text/70 hover:bg-black/5 hover:text-text"
            }`}
        >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-text/50"}`} />
            {children}
        </button>
    );
}

function AccountTab() {
    const {
        register,
        formState: { errors },
    } = useFormContext<SettingsFormValues>();

    return (
        <div className="p-6 md:p-8">
            <h2 className="mb-6 text-lg font-bold md:text-xl">معلومات الحساب الأساسية</h2>

            <div className="flex max-w-lg flex-col gap-5">
                <FormInput name="fullName" label="الاسم الكامل" />
                <FormInput name="email" label="البريد الإلكتروني" type="email" />
                <FormInput name="phone" label="رقم الهاتف" type="tel" />
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">النبذة الشخصية</label>
                    <textarea
                        {...register("bio")}
                        rows={4}
                        className={`min-h-[120px] w-full resize-none rounded-[4px] border bg-background px-4 py-3 text-base outline-none transition-colors md:text-sm ${
                            errors.bio ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                        }`}
                    />
                    {errors.bio && <span className="mt-2 block text-xs font-medium text-red-600">{errors.bio.message}</span>}
                </div>
            </div>
        </div>
    );
}

function SecurityTab() {
    const { mutateAsync: changePassword, isPending } = useChangePassword();
    const pwdForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    });

    const onPasswordSubmit = pwdForm.handleSubmit(async (vals) => {
        try {
            await changePassword({
                current_password: vals.current_password,
                password: vals.password,
                password_confirmation: vals.password_confirmation,
            });
            toast.success("تم تحديث كلمة المرور بنجاح");
            pwdForm.reset();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "تعذر تحديث كلمة المرور";
            toast.error(msg);
        }
    });

    return (
        <div className="p-6 md:p-8">
            <h2 className="mb-6 text-lg font-bold md:text-xl">إعدادات الأمان</h2>

                <div className="max-w-lg space-y-10">
                <div className="space-y-5">
                    <h3 className="border-b border-border/40 pb-2 text-sm font-bold text-text/70">تغيير كلمة المرور</h3>
                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">كلمة المرور الحالية</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            className="min-h-[48px] w-full rounded-[4px] border border-border/80 bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary md:text-sm"
                            {...pwdForm.register("current_password")}
                        />
                        {pwdForm.formState.errors.current_password && (
                            <span className="mt-1 block text-xs text-red-600">{pwdForm.formState.errors.current_password.message}</span>
                        )}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            className="min-h-[48px] w-full rounded-[4px] border border-border/80 bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary md:text-sm"
                            {...pwdForm.register("password")}
                        />
                        {pwdForm.formState.errors.password && (
                            <span className="mt-1 block text-xs text-red-600">{pwdForm.formState.errors.password.message}</span>
                        )}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">تأكيد كلمة المرور</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            className="min-h-[48px] w-full rounded-[4px] border border-border/80 bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary md:text-sm"
                            {...pwdForm.register("password_confirmation")}
                        />
                        {pwdForm.formState.errors.password_confirmation && (
                            <span className="mt-1 block text-xs text-red-600">{pwdForm.formState.errors.password_confirmation.message}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => void onPasswordSubmit()}
                        className="inline-flex h-11 min-h-[2.75rem] items-center gap-2 rounded-[4px] bg-primary px-6 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        تحديث كلمة المرور
                    </button>
                </div>

                <div>
                    <h3 className="mb-3 border-b border-border/40 pb-2 text-sm font-bold text-text/70">المصادقة الثنائية</h3>
                    <p className="text-sm leading-relaxed text-text/55">
                        التحقق بخطوتين غير مفعّل حالياً على المنصة. سيتم إعلامك عند توفر هذه الميزة.
                    </p>
                </div>
            </div>
        </div>
    );
}

function PreferencesTab() {
    return (
        <div className="p-6 md:p-8">
            <h2 className="mb-6 text-lg font-bold md:text-xl">تفضيلات العرض</h2>
            <p className="mb-6 max-w-lg text-sm text-text/55">
                تُحفظ هذه التفضيلات مع حسابك وتُطبّق عند تسجيل الدخول من أي جهاز.
            </p>
            <div className="flex max-w-lg flex-col gap-5">
                <ToggleRow name="autoDarkMode" title="الوضع الليلي التلقائي" desc="مزامنة مع تفضيل النظام (عند دعم المتصفح)." />
                <ToggleRow name="animations" title="الرسوم المتحركة" desc="تشغيل أو إيقاف الحركات في الواجهة." />
                <ToggleRow name="hideLeaderboard" title="إخفاء لوحة الصدارة" desc="عدم عرض ترتيبك العام إن وُجد." />
                <ToggleRow name="autoFocus" title="وضع التركيز للفيديو" desc="توسيع منطقة التشغيل عند البدء (قريباً)." />
            </div>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div className="p-6 md:p-8">
            <h2 className="mb-6 text-lg font-bold md:text-xl">تفضيلات الإشعارات</h2>
            <div className="flex max-w-lg flex-col gap-5">
                <ToggleRow name="systemNotifications" title="إشعارات النظام والمنصة" desc="تحديثات وإعلانات مهمة." />
                <ToggleRow name="weeklyDigest" title="ملخص أسبوعي" desc="ملخص تقدّمك وتذكيرات التعلم." />
                <ToggleRow name="socialNotifications" title="التفاعل والمجتمع" desc="ردود وتفاعلات على نشاطك." />
                <ToggleRow name="promotions" title="العروض والترويج" desc="خصومات وعروض على المحتوى." />
            </div>
        </div>
    );
}

function LanguageTab() {
    const { register } = useFormContext<SettingsFormValues>();
    return (
        <div className="p-6 md:p-8">
            <h2 className="mb-6 text-lg font-bold md:text-xl">اللغة والمنطقة</h2>
            <div className="flex max-w-lg flex-col gap-5">
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">لغة الواجهة</label>
                    <select
                        {...register("language")}
                        className="min-h-[48px] w-full cursor-pointer appearance-none rounded-[4px] border border-border/80 bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary md:text-sm"
                    >
                        <option value="ar">العربية (RTL)</option>
                        <option value="en">English (LTR)</option>
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-text">المنطقة الزمنية</label>
                    <select
                        {...register("timezone")}
                        className="min-h-[48px] w-full cursor-pointer appearance-none rounded-[4px] border border-border/80 bg-background px-4 py-3 font-mono text-base outline-none transition-colors focus:border-primary md:text-sm"
                    >
                        <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                        <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

function FormInput({ name, label, type = "text" }: { name: keyof SettingsFormValues; label: string; type?: string }) {
    const {
        register,
        formState: { errors },
    } = useFormContext<SettingsFormValues>();
    const error = errors[name]?.message as string | undefined;

    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-text">{label}</label>
            <input
                type={type}
                inputMode={type === "email" ? "email" : type === "tel" ? "tel" : undefined}
                autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : undefined}
                {...register(name)}
                className={`min-h-[48px] w-full rounded-[4px] border bg-background px-4 py-3 text-base outline-none transition-colors md:text-sm ${
                    error ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                }`}
            />
            {error && <span className="mt-2 block text-xs font-medium text-red-600">{error}</span>}
        </div>
    );
}

function ToggleRow({ name, title, desc }: { name: keyof SettingsFormValues; title: string; desc: string }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-[4px] border border-border/60 bg-background/50 py-4 pl-2 pr-4 md:py-3">
            <div className="min-w-0 flex-1 text-right">
                <div className="text-sm font-bold">{title}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-text/55">{desc}</div>
            </div>
            <CustomToggle name={name} />
        </div>
    );
}

function CustomToggle({ name }: { name: keyof SettingsFormValues }) {
    const { control } = useFormContext<SettingsFormValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <button
                    type="button"
                    role="switch"
                    aria-checked={!!value}
                    onClick={() => onChange(!value)}
                    className={`-m-2 shrink-0 p-2 touch-manipulation relative inline-flex h-6 w-11 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                        value ? "border-primary bg-primary" : "border-border bg-background"
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? "-translate-x-6" : "-translate-x-1"
                        }`}
                    />
                </button>
            )}
        />
    );
}

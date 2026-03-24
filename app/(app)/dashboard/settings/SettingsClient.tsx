"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getFadeUp, getFadeIn } from "@/lib/motion";
import { useState } from "react";
import { User, Shield, Sliders, Bell, Globe, Loader2 } from "lucide-react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateSettings } from "@/lib/hooks/useProfile";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

const settingsSchema = z.object({
    fullName: z.string().min(3, "الاسم قصير جداً"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    twoFA: z.boolean().optional(),
    autoDarkMode: z.boolean().optional(),
    animations: z.boolean().optional(),
    hideLeaderboard: z.boolean().optional(),
    autoFocus: z.boolean().optional(),
    systemNotifications: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    socialNotifications: z.boolean().optional(),
    promotions: z.boolean().optional(),
    language: z.string().optional(),
    timezone: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "كلمات المرور غير متطابقة" });
    }
});

type SettingsFormValues = z.infer<typeof settingsSchema>;
type Tab = "account" | "security" | "preferences" | "notifications" | "language";

export function SettingsClient() {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const { user } = useAuth();
    const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateSettings();

    const methods = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            fullName: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            bio: user?.bio || "",
            avatar: user?.avatar || "",
            twoFA: false,
            autoDarkMode: true,
            animations: true,
            hideLeaderboard: false,
            autoFocus: true,
            systemNotifications: true,
            weeklyDigest: true,
            socialNotifications: true,
            promotions: false,
            language: "ar",
            timezone: "AST",
        },
        mode: "onChange"
    });

    const { reset } = methods;

    require('react').useEffect(() => {
        if (user) {
            reset({
                fullName: user.name,
                email: user.email,
                phone: user.phone || "",
                bio: user.bio || "",
                avatar: user.avatar || "",
                twoFA: false,
                autoDarkMode: true,
                animations: true,
                hideLeaderboard: false,
                autoFocus: true,
                systemNotifications: true,
                weeklyDigest: true,
                socialNotifications: true,
                promotions: false,
                language: "ar",
                timezone: "AST",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            await updateSettings({
                name: data.fullName,
                email: data.email,
                phone: data.phone,
                bio: data.bio,
                avatar: data.avatar,
                // Passwords would be handled by a separate mutation usually, 
                // but for now we focus on profile.
            });
            toast.success("تم حفظ الإعدادات بنجاح");
        } catch (error) {
            console.error(error);
            toast.error("فشل تحديث الإعدادات");
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-8">
                <motion.div {...getFadeUp(0, 0.4)} className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">الإعدادات</h1>
                        <p className="text-sm text-text/60">التحكم الكامل في حسابك وتخصيص بيئة التعلم الخاصة بك.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdating || !methods.formState.isValid}
                        className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-[4px] hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات الكلية"}
                    </button>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <motion.div
                        {...getFadeUp(0.1, 0.4)}
                        className="w-full md:w-64 flex flex-col gap-2 shrink-0 border border-border/80 bg-white rounded-[4px] p-4"
                    >
                        <TabButton active={activeTab === "account"} onClick={() => setActiveTab("account")} icon={User}>الحساب الشخصي</TabButton>
                        <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={Shield}>الأمان وتسجيل الدخول</TabButton>
                        <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={Sliders}>تفضيلات العرض</TabButton>
                        <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={Bell}>تنبيهات النظام</TabButton>
                        <TabButton active={activeTab === "language"} onClick={() => setActiveTab("language")} icon={Globe}>اللغة والمنطقة</TabButton>
                    </motion.div>

                    <div className="flex-1 w-full bg-white border border-border/80 rounded-[4px] min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} {...getFadeIn(0, 0.3)}>
                                {activeTab === "account" && <AccountTab />}
                                {activeTab === "security" && <SecurityTab />}
                                {activeTab === "preferences" && <PreferencesTab />}
                                {activeTab === "notifications" && <NotificationsTab />}
                                {activeTab === "language" && <LanguageTab />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

function TabButton({ children, active, onClick, icon: Icon }: {
    children: React.ReactNode, active: boolean, onClick: () => void, icon: any
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-[4px] text-sm font-bold transition-all text-right ${active
                ? "bg-primary/10 text-primary"
                : "text-text/70 hover:bg-black/5 hover:text-text"
                }`}
        >
            <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-text/50"}`} />
            {children}
        </button>
    );
}

/* =========================================================================
   TAB VIEWS
   ========================================================================= */

function AccountTab() {
    const { register, formState: { errors } } = useFormContext<SettingsFormValues>();

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">معلومات الحساب الأساسية</h2>

            <div className="flex flex-col gap-6 max-w-md">
                <FormInput name="fullName" label="الاسم الكامل" />
                <FormInput name="email" label="البريد الإلكتروني" type="email" />
                <FormInput name="phone" label="رقم الهاتف" type="tel" />
                <div>
                    <label className="block text-sm font-bold text-text mb-2">النبذة الشخصية</label>
                    <textarea
                        {...register("bio")}
                        className={`w-full bg-background border rounded-[4px] px-4 py-3 text-sm focus:outline-none transition-colors resize-none h-32 ${errors.bio ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                            }`}
                    />
                </div>
            </div>
        </div>
    );
}

function SecurityTab() {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">إعدادات الأمان</h2>

            <div className="flex flex-col gap-8 max-w-md">
                <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-text/60 border-b border-border/40 pb-2">تغيير كلمة المرور</h3>
                    <FormInput name="currentPassword" label="كلمة المرور الحالية" type="password" />
                    <FormInput name="newPassword" label="كلمة المرور الجديدة" type="password" />
                    <FormInput name="confirmPassword" label="تأكيد كلمة المرور" type="password" />
                </div>

                <div className="flex flex-col gap-6 mt-4">
                    <h3 className="text-sm font-bold text-text/60 border-b border-border/40 pb-2">المصادقة الثنائية (2FA)</h3>
                    <div className="flex justify-between items-center bg-background border border-border/80 p-4 rounded-[4px]">
                        <div>
                            <div className="text-sm font-bold mb-1">التحقق بخطوتين</div>
                            <div className="text-xs text-text/60">أضف طبقة حماية إضافية لحسابك باستخدام تطبيق مصادقة.</div>
                        </div>
                        <ToggleRow name="twoFA" hiddenText />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreferencesTab() {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">إعدادات الواجهة</h2>

            <div className="flex flex-col gap-6 max-w-md">
                <ToggleRow name="autoDarkMode" title="الوضع الليلي التلقائي" desc="التغيير التلقائي بناءً على إعدادات نظام التشغيل." />
                <ToggleRow name="animations" title="الرسومات المتحركة (Animations)" desc="إلغاء تفعيل الحركات لزيادة الأداء أو تقليل التشتت." />
                <ToggleRow name="hideLeaderboard" title="إخفاء لوحة الصدارة العامة" desc="عدم مشاركة بيانات تقدمك مع باقي الطلاب." />
                <ToggleRow name="autoFocus" title="وضعية التركيز التلقائية" desc="الدخول في وضع ملء الشاشة عند بدء تشغيل أي فيديو تعليمي." />
            </div>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">تفضيلات الإشعارات</h2>

            <div className="flex flex-col gap-6 max-w-md">
                <ToggleRow name="systemNotifications" title="إشعارات النظام والمنصة" desc="تحديثات الصيانة وخصائص المنصة الجديدة." />
                <ToggleRow name="weeklyDigest" title="إشعارات التعلم الأسبوعية" desc="ملخص لأدائك وساعات التعلم الأسبوعية." />
                <ToggleRow name="socialNotifications" title="التفاعل والمجتمع" desc="عندما يرد شخص على تعليقاتك في النقاشات المقررة." />
                <ToggleRow name="promotions" title="العروض الترويجية" desc="خصومات وعروض على المسارات التعليمية الجديدة." />
            </div>
        </div>
    );
}

function LanguageTab() {
    const { register } = useFormContext<SettingsFormValues>();
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-8">إعدادات العرض الإقليمية</h2>

            <div className="flex flex-col gap-6 max-w-md">
                <div>
                    <label className="block text-sm font-bold text-text mb-2">لغة الواجهة</label>
                    <select {...register("language")} className="w-full bg-background border border-border/80 rounded-[4px] px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors outline-none cursor-pointer appearance-none">
                        <option value="ar">العربية (RTL)</option>
                        <option value="en">English (LTR)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-text mb-2">المنطقة الزمنية</label>
                    <select {...register("timezone")} className="w-full bg-background border border-border/80 rounded-[4px] px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors outline-none cursor-pointer appearance-none">
                        <option value="AST">Asia/Riyadh (GMT+3)</option>
                        <option value="GST">Asia/Dubai (GMT+4)</option>
                        <option value="EET">Africa/Cairo (GMT+2)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   UI HELPERS
   ========================================================================= */

function FormInput({ name, label, type = "text" }: { name: keyof SettingsFormValues, label: string, type?: string }) {
    const { register, formState: { errors } } = useFormContext<SettingsFormValues>();
    const error = errors[name]?.message as string;

    return (
        <div>
            <label className="block text-sm font-bold text-text mb-2">{label}</label>
            <input
                type={type}
                {...register(name)}
                className={`w-full bg-background border rounded-[4px] px-4 py-3 text-sm focus:outline-none transition-colors ${error ? "border-red-500 focus:border-red-500" : "border-border/80 focus:border-primary"
                    }`}
            />
            {error && <span className="text-xs text-red-500 font-bold block mt-2">{error}</span>}
        </div>
    );
}

function ToggleRow({ name, title, desc, hiddenText = false }: { name: keyof SettingsFormValues, title?: string, desc?: string, hiddenText?: boolean }) {
    return (
        <div className={`flex justify-between items-center ${hiddenText ? "" : "py-2"}`}>
            {!hiddenText && (
                <div className="pl-4">
                    <div className="text-sm font-bold mb-1">{title}</div>
                    <div className="text-xs text-text/60 leading-relaxed">{desc}</div>
                </div>
            )}
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
                    onClick={() => onChange(!value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none border shrink-0 ${value ? "bg-primary border-primary" : "bg-background border-border"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "-translate-x-6" : "-translate-x-1"
                            }`}
                    />
                </button>
            )}
        />
    );
}

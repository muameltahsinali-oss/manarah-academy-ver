"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFadeUp, staggerContainer } from "@/lib/motion";
import { Settings, Save, Globe, Mail, DollarSign, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, put } from "@/lib/api";

export function AdminSettingsClient() {
    const [settings, setSettings] = useState({
        siteName: "منارة اكاديمي",
        contactEmail: "admin@platformx.com",
        supportEmail: "support@platformx.com",
        currency: "USD",
        currencySymbol: "$",
        logoUrl: "",
        faviconUrl: "",
        heroTitle: "تعلم المهارات التي تحتاجها في سوق العمل",
        heroSubtitle: "منصتك الأولى للتعلم والتطور المستمر.",
    });

    const { data: settingsRes, isLoading: isLoadingSettings } = useQuery({
        queryKey: ["admin", "settings"],
        queryFn: () => get<any>("/admin/settings"),
    });

    useEffect(() => {
        if (!settingsRes) return;
        const s = settingsRes?.data ?? {};
        setSettings((prev) => ({
            ...prev,
            siteName: s.site_name ?? prev.siteName,
            contactEmail: s.contact_email ?? prev.contactEmail,
            supportEmail: s.support_email ?? prev.supportEmail,
            currency: s.currency ?? prev.currency,
            currencySymbol: s.currency_symbol ?? prev.currencySymbol,
            logoUrl: s.logo_url ?? prev.logoUrl,
            faviconUrl: s.favicon_url ?? prev.faviconUrl,
            heroTitle: s.hero_title ?? prev.heroTitle,
            heroSubtitle: s.hero_subtitle ?? prev.heroSubtitle,
        }));
    }, [settingsRes]);

    const saveMutation = useMutation({
        mutationFn: (payload: any) => put<any>("/admin/settings", payload),
        onSuccess: () => {
            toast.success("تم حفظ الإعدادات بنجاح");
        },
        onError: () => {
            toast.error("حدث خطأ أثناء حفظ الإعدادات");
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate({
            site_name: settings.siteName,
            contact_email: settings.contactEmail,
            support_email: settings.supportEmail,
            currency: settings.currency,
            currency_symbol: settings.currencySymbol,
            logo_url: settings.logoUrl || null,
            favicon_url: settings.faviconUrl || null,
            hero_title: settings.heroTitle,
            hero_subtitle: settings.heroSubtitle,
        });
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-8"
        >
            <motion.div {...getFadeUp(0)} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">إعدادات المنصة</h1>
                    <p className="text-sm text-text/60">إدارة الإعدادات العامة كالاسم والتواصل والعملة الافتراضية.</p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* General Settings */}
                <motion.div {...getFadeUp(0.1)} className="bg-white border border-border/80 rounded-[4px] p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-accent" />
                        </div>
                        <h2 className="text-lg font-bold">الإعدادات العامة</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text/80">اسم المنصة</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                disabled={isLoadingSettings}
                                className="w-full bg-background border border-border/80 rounded h-11 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text/80">العملة الافتراضية</label>
                            <div className="relative">
                                <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                                <input
                                    type="text"
                                    name="currency"
                                    value={settings.currency}
                                    onChange={handleChange}
                                    disabled={isLoadingSettings}
                                    className="w-full bg-background border border-border/80 rounded h-11 pr-10 pl-4 text-sm focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-text/80">رمز العملة (مثال: $)</label>
                            <input
                                type="text"
                                name="currencySymbol"
                                value={settings.currencySymbol}
                                onChange={handleChange}
                                disabled={isLoadingSettings}
                                className="w-full bg-background border border-border/80 rounded h-11 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Content Settings */}
                <motion.div {...getFadeUp(0.2)} className="bg-white border border-border/80 rounded-[4px] p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold">محتوى الصفحة الرئيسية</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text/80">العنوان الرئيسي</label>
                            <input
                                type="text"
                                name="heroTitle"
                                value={settings.heroTitle}
                                onChange={handleChange}
                                disabled={isLoadingSettings}
                                className="w-full bg-background border border-border/80 rounded h-11 px-4 text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text/80">النص الفرعي</label>
                            <textarea
                                name="heroSubtitle"
                                value={settings.heroSubtitle}
                                onChange={handleChange}
                                rows={3}
                                disabled={isLoadingSettings}
                                className="w-full bg-background border border-border/80 rounded p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Contact Settings */}
                <motion.div {...getFadeUp(0.3)} className="bg-white border border-border/80 rounded-[4px] p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-lg font-bold">معلومات التواصل</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text/80">البريد الإلكتروني الرئيسي</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                disabled={isLoadingSettings}
                                className="w-full bg-background border border-border/80 rounded h-11 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors text-left"
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text/80">بريد الدعم الفني</label>
                            <input
                                type="email"
                                name="supportEmail"
                                value={settings.supportEmail}
                                onChange={handleChange}
                                disabled={isLoadingSettings}
                                className="w-full bg-background border border-border/80 rounded h-11 px-4 text-sm focus:outline-none focus:border-green-500 transition-colors text-left"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div {...getFadeUp(0.4)} className="flex justify-end gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={saveMutation.isPending || isLoadingSettings}
                        className="flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-[4px] font-bold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saveMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                حفظ المدخلات
                            </>
                        )}
                    </button>
                </motion.div>
            </form>
        </motion.div>
    );
}

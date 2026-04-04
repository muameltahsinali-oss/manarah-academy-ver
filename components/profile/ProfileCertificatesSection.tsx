"use client";

import Link from "next/link";
import { ArrowLeft, Award, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useCertificates, downloadCertificate } from "@/lib/hooks/useCertificates";
import { getFadeUp } from "@/lib/motion";

const LIMIT = 3;

type Cert = {
    id: number;
    certificate_code?: string;
    course?: { title?: string };
};

export function ProfileCertificatesSection() {
    const { data: certificatesRes, isLoading, isError, refetch } = useCertificates();
    const list = (certificatesRes?.data ?? []) as Cert[];
    const preview = list.slice(0, LIMIT);

    if (isLoading) {
        return (
            <section className="rounded-[4px] border border-border/80 bg-white p-6 md:p-8">
                <div className="mb-6 h-6 w-48 animate-pulse rounded bg-border/50" />
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 animate-pulse rounded-[4px] bg-border/40" />
                    ))}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-[4px] border border-destructive/20 bg-destructive/5 p-6 text-center md:p-8">
                <p className="text-sm text-destructive">تعذر تحميل الشهادات.</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-3 text-sm font-bold text-primary underline-offset-4 hover:underline"
                >
                    إعادة المحاولة
                </button>
            </section>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            id="certificates"
            className="scroll-mt-28 rounded-[4px] border border-border/80 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] md:scroll-mt-24 md:p-8"
        >
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-text md:text-xl">الشهادات</h2>
                    <p className="mt-1 text-sm text-text/60">
                        {list.length === 0 ? "لم تحصل على شهادات بعد." : `${list.length} شهادة معتمدة.`}
                    </p>
                </div>
                <Link
                    href="/dashboard/certificates"
                    className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/85"
                >
                    عرض الكل
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </Link>
            </div>

            {preview.length === 0 ? (
                <p className="py-6 text-center text-sm text-text/55">أكمل دورة للحصول على شهادتك الأولى.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {preview.map((cert, index) => (
                        <motion.li
                            key={cert.id}
                            {...getFadeUp(index * 0.05, 0.35)}
                            className="flex items-center justify-between gap-3 rounded-[4px] border border-border/80 bg-background/80 p-4 transition-colors hover:border-accent/30"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-text">{cert.course?.title || "دورة تعليمية"}</p>
                                    <p className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-text/45">
                                        {cert.certificate_code ? `PX-${cert.certificate_code}` : "—"}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => downloadCertificate(cert.id)}
                                className="flex h-10 min-h-[2.5rem] w-10 shrink-0 items-center justify-center rounded-[4px] border border-border/80 text-text/50 transition-colors hover:border-accent/40 hover:text-accent"
                                title="تحميل"
                                aria-label="تحميل الشهادة"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        </motion.li>
                    ))}
                </ul>
            )}
        </motion.section>
    );
}

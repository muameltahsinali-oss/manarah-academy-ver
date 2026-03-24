"use client";

import { useCertificates, downloadCertificate } from "@/lib/hooks/useCertificates";
import { Award, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";

export function CertificatesList() {
    const { data: certificatesRes, isLoading } = useCertificates();
    const certificates = certificatesRes?.data || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (certificates.length === 0) {
        return null; // Don't show the section if no certificates earned yet
    }

    return (
        <section className="flex flex-col gap-4 md:gap-6">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-text">الشهادات المكتسبة</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {certificates.map((cert: any, index: number) => (
                    <motion.div
                        key={cert.id}
                        {...getFadeUp(index * 0.1, 0.4)}
                        className="p-4 md:p-6 bg-white border border-border/80 rounded-[4px] flex items-center justify-between gap-3 group hover:border-accent/40 transition-colors"
                    >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-text line-clamp-1">
                                    {cert.course?.title || "دورة تعليمية"}
                                </h3>
                                <p className="text-[10px] font-mono text-text/40 uppercase tracking-widest mt-1">
                                    PX-{cert.certificate_code}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => downloadCertificate(cert.id)}
                            className="min-h-[2.75rem] min-w-[2.75rem] flex items-center justify-center border border-border/80 rounded-[4px] text-text/40 hover:text-accent hover:border-accent/40 active:scale-95 transition-all touch-manipulation shrink-0"
                            title="تحميل الشهادة"
                            aria-label="تحميل الشهادة"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

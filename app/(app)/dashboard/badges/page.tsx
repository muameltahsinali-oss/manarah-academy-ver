"use client";

import { motion } from "framer-motion";
import { getFadeUp } from "@/lib/motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BadgesSection } from "@/components/dashboard/BadgesSection";

export default function BadgesPage() {
    return (
        <div className="w-full flex-1">
            <DashboardHeader />

            <div className="flex flex-col gap-8 md:gap-12 w-full max-w-6xl mx-auto py-6">
                <motion.div {...getFadeUp(0, 0.4)}>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">أوسمتي</h1>
                    <p className="text-sm text-text/60 max-w-xl leading-relaxed">
                        مجموعة إنجازاتك — اضغط على أي وسام لعرض التفاصيل. الأوسمة المفتوحة تظهر أولاً.
                    </p>
                </motion.div>

                <BadgesSection variant="page" />
            </div>
        </div>
    );
}

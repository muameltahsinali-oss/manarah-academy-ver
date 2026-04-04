"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { HeroTabScene } from "./types";
import { isBackendImageUrl } from "@/lib/utils/image";

type TabContentProps = {
    scene: HeroTabScene;
    /** يترك مساحة أسفل المحتوى حتى لا يتداخل مع زر «المزيد» في الزاوية. */
    reserveBottomForFloatingAction?: boolean;
    /** أول ظهور للمحتوى بعد انتهاء الـ loader — حركة أوضح متزامنة مع الكشف. */
    heroEntrance?: boolean;
};

export function TabContent({
    scene,
    reserveBottomForFloatingAction,
    heroEntrance,
}: TabContentProps) {
    const reduce = useReducedMotion();
    const showProgress =
        typeof scene.progress === "number" && !Number.isNaN(scene.progress);

    const fromLoader = Boolean(heroEntrance);

    return (
        <motion.div
            role="tabpanel"
            id={`hero-tabpanel-${scene.id}`}
            aria-labelledby={`hero-tab-${scene.id}`}
            initial={
                reduce
                    ? { opacity: 0 }
                    : fromLoader
                      ? { opacity: 0, y: 20, scale: 0.99 }
                      : { opacity: 0, x: 16 }
            }
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{
                duration: reduce ? 0.12 : fromLoader ? 0.5 : 0.38,
                ease: [0.22, 1, 0.36, 1],
                delay: reduce ? 0 : fromLoader ? 0.06 : 0,
            }}
            className="relative flex min-h-[min(72vh,620px)] w-full flex-col md:min-h-[580px]"
        >
            <div className="relative flex-1 overflow-hidden rounded-b-xl md:rounded-b-2xl">
                <motion.div
                    className="absolute inset-0"
                    initial={reduce ? false : { scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Image
                        src={scene.imageSrc}
                        alt={scene.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, min(1100px, 100vw)"
                        priority
                        unoptimized={!isBackendImageUrl(scene.imageSrc)}
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15" />

                <div
                    className={`absolute inset-0 flex flex-col justify-end p-5 md:p-10 ${
                        reserveBottomForFloatingAction ? "pb-24 md:pb-28" : "pb-6 md:pb-10"
                    }`}
                >
                    {scene.badge && (
                        <span className="mb-3 inline-flex w-fit rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-white/95 backdrop-blur-sm">
                            {scene.badge}
                        </span>
                    )}
                    <h2 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-sm md:text-3xl lg:text-4xl">
                        {scene.headline}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/88 md:text-base">
                        {scene.subtitle}
                    </p>

                    {showProgress && (
                        <div className="mt-4 max-w-md">
                            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-white/90">
                                <span>التقدّم</span>
                                <span className="tabular-nums">
                                    {Math.round(Math.min(100, Math.max(0, scene.progress!)))}٪
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/20 ring-1 ring-white/25">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-l from-white to-primary/90"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${Math.min(100, Math.max(0, scene.progress!))}%`,
                                    }}
                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href={scene.cta.href}
                                className="inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-[4px] bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-black/20 transition-colors hover:bg-primary/92 sm:w-auto touch-manipulation"
                            >
                                {scene.cta.label}
                            </Link>
                        </motion.div>
                        {scene.secondaryCta && (
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href={scene.secondaryCta.href}
                                    className="inline-flex h-12 min-h-[48px] w-full items-center justify-center rounded-[4px] border-2 border-white/40 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15 sm:w-auto touch-manipulation"
                                >
                                    {scene.secondaryCta.label}
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
    AnimatePresence,
    LayoutGroup,
    motion,
    useReducedMotion,
    type Variants,
} from "framer-motion";
import { Plus } from "lucide-react";
import type { HeroTabScene } from "./types";
import { HeroLoaderBody } from "./HeroLoaderBody";
import { TabItem } from "./TabItem";
import { TabContent } from "./TabContent";
import { HERO_CONTENT_REVEAL_MS } from "./heroEntrance";

const MAX_TABS = 8;

export type HeroTabsVariant = "guest" | "student";

export type HeroTabsProps = {
    tabs: HeroTabScene[];
    extraTabScenes?: HeroTabScene[];
    isLoading?: boolean;
    className?: string;
    variant?: HeroTabsVariant;
};

export function HeroTabs({
    tabs,
    extraTabScenes = [],
    isLoading = false,
    className,
    variant = "guest",
}: HeroTabsProps) {
    const reduce = useReducedMotion();
    const [extraTabs, setExtraTabs] = useState<HeroTabScene[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const poolIndexRef = useRef(0);
    const tabStripRef = useRef<HTMLDivElement>(null);
    /** لقطة القيمة السابقة لـ `isLoading` داخل الرندر (انتقال تحميل→جاهز). */
    const prevLoadingRef = useRef(isLoading);
    // eslint-disable-next-line react-hooks/refs -- مقارنة مع القيمة قبل التحديث في نفس الدورة
    const heroEntranceProp = prevLoadingRef.current && !isLoading;
    // eslint-disable-next-line react-hooks/refs
    prevLoadingRef.current = isLoading;

    const tabList = useMemo(() => [...tabs, ...extraTabs], [tabs, extraTabs]);

    const tabSignature = useMemo(() => tabs.map((t) => t.id).join("|"), [tabs]);

    useEffect(() => {
        setExtraTabs([]);
        setSelectedId(null);
    }, [tabSignature, variant]);

    const activeId = useMemo(() => {
        if (selectedId && tabList.some((t) => t.id === selectedId)) return selectedId;
        return tabList[0]?.id ?? "";
    }, [tabList, selectedId]);

    const activeScene = useMemo(
        () => tabList.find((t) => t.id === activeId) ?? tabList[0],
        [tabList, activeId]
    );

    /** تمرير الشريط لتوسيط التبويب النشط — يعمل مع RTL؛ مزدوج rAF بعد رسم التبويب الجديد. */
    useLayoutEffect(() => {
        if (isLoading || !activeId) return;
        const strip = tabStripRef.current;
        const tab = document.getElementById(`hero-tab-${activeId}`);
        if (!strip || !tab) return;

        const alignActiveTab = () => {
            const sr = strip.getBoundingClientRect();
            const tr = tab.getBoundingClientRect();
            const tabCenter = tr.left + tr.width / 2;
            const stripCenter = sr.left + sr.width / 2;
            const delta = tabCenter - stripCenter;
            strip.scrollBy({ left: delta, behavior: "auto" });
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(alignActiveTab);
        });
    }, [activeId, isLoading, tabList.length]);

    const addTab = useCallback(() => {
        if (!extraTabScenes.length) return;
        if (tabList.length >= MAX_TABS) return;

        const pool = extraTabScenes;
        const raw = pool[poolIndexRef.current % pool.length];
        poolIndexRef.current += 1;

        const newId = `dyn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const scene: HeroTabScene = {
            ...raw,
            id: newId,
            label: raw.label,
        };

        setExtraTabs((prev) => [...prev, scene]);
        setSelectedId(newId);
    }, [extraTabScenes, tabList.length]);

    const showNewTab = extraTabScenes.length > 0 && tabList.length < MAX_TABS && !isLoading;

    const windowLabel =
        variant === "student"
            ? "معاينة رحلتك — تبويبات شخصية"
            : "اكتشف المنصّة — تبويبات تسويقية";

    const newTabBtnVariants: Variants = reduce
        ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2, delay: 0.06 } } }
        : {
              hidden: { opacity: 0, y: 6 },
              visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.22 },
              },
          };

    return (
        <div
            className={className}
            data-hero-variant={variant}
            data-user-context={variant === "student" ? "authenticated-student" : "guest"}
        >
            <LayoutGroup>
                <motion.div
                    layoutId="hero-tab-shell"
                    className="relative flex min-h-[min(78vh,680px)] w-full flex-col overflow-x-clip overflow-y-visible rounded-2xl border border-border/70 bg-white/85 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] backdrop-blur-md md:min-h-[620px]"
                    initial={false}
                >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.05]" />

                    <div className="relative flex min-h-[48px] shrink-0 items-center gap-2 border-b border-border/60 bg-gradient-to-b from-border/30 via-white/50 to-white/30 px-2 py-0.5 md:px-3">
                        <div className="flex shrink-0 items-center gap-1.5 ps-1" aria-hidden>
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/90" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/90" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/90" />
                        </div>

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="tab-shimmer"
                                    className="mx-1 flex min-h-[40px] min-w-0 flex-1 items-center"
                                    initial={{ opacity: 0.6 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    aria-hidden
                                >
                                    <div className="h-9 w-full max-w-[140px] rounded-lg bg-gradient-to-l from-border/30 via-border/20 to-border/30" />
                                </motion.div>
                            ) : (
                                <div
                                    key="tab-list"
                                    ref={tabStripRef}
                                    className="flex min-h-[44px] min-w-0 flex-1 items-stretch gap-1 overflow-x-auto overflow-y-visible overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                    role="tablist"
                                    aria-label={windowLabel}
                                >
                                    {tabList.map((t) => (
                                        <TabItem
                                            key={t.id}
                                            id={t.id}
                                            label={t.label}
                                            isActive={t.id === activeId}
                                            onSelect={setSelectedId}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative flex min-h-0 flex-1 flex-col">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <HeroLoaderBody key="hero-loader-inner" />
                            ) : (
                                <motion.div
                                    key="hero-loaded"
                                    className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-2xl"
                                    initial={reduce ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: reduce ? 0.15 : HERO_CONTENT_REVEAL_MS,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <div className="relative flex min-h-0 flex-1 flex-col">
                                        <AnimatePresence mode="wait">
                                            {activeScene && (
                                                <TabContent
                                                    key={activeScene.id}
                                                    scene={activeScene}
                                                    reserveBottomForFloatingAction={showNewTab}
                                                    heroEntrance={heroEntranceProp}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {showNewTab && (
                                        <motion.div
                                            className="pointer-events-auto absolute bottom-4 left-4 z-20"
                                            variants={newTabBtnVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <motion.button
                                                type="button"
                                                onClick={addTab}
                                                className="group flex min-h-[48px] min-w-[min(100%,280px)] max-w-[calc(100%-2rem)] items-center justify-center gap-3 rounded-xl border-2 border-primary/45 bg-white/95 px-4 py-3 text-sm font-bold text-primary shadow-[0_10px_36px_-10px_rgba(15,23,42,0.28)] backdrop-blur-md transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-primary/25 touch-manipulation sm:min-w-[240px]"
                                                whileTap={reduce ? undefined : { scale: 0.98 }}
                                                aria-label="المزيد"
                                                title="
                                                المزيد
                                                "
                                            >
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/30 transition-colors group-hover:bg-white/20 group-hover:text-white group-hover:ring-white/40">
                                                    <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                                                </span>
                                                <span className="text-start leading-snug">المزيد</span>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </LayoutGroup>
        </div>
    );
}

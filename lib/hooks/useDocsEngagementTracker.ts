"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Args = {
  lessonId: number | null;
  enabled: boolean;
  minActiveSeconds?: number; // default 30
  minScrollDepthPct?: number; // default 70
  onShouldSync?: (p: { scrollDepth: number; activeSeconds: number; lastPositionSeconds: number; percentage: number }) => void;
  onCompleted?: () => void;
};

function computeScrollDepth(): { depth: number; lastPos: number } {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop || 0;
  const clientHeight = doc.clientHeight || 1;
  const scrollHeight = doc.scrollHeight || 1;

  const maxScroll = Math.max(1, scrollHeight - clientHeight);
  const depth = Math.max(0, Math.min(100, Math.floor((scrollTop / maxScroll) * 100)));
  return { depth, lastPos: Math.floor(scrollTop) };
}

export function useDocsEngagementTracker({
  lessonId,
  enabled,
  minActiveSeconds = 30,
  minScrollDepthPct = 70,
  onShouldSync,
  onCompleted,
}: Args) {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);

  const lastSyncAtRef = useRef(0);
  const lastPosRef = useRef(0);

  useEffect(() => {
    setScrollDepth(0);
    setActiveSeconds(0);
    setCompleted(false);
    lastSyncAtRef.current = 0;
    lastPosRef.current = 0;
  }, [lessonId]);

  useEffect(() => {
    if (!enabled || !lessonId) return;

    const onScroll = () => {
      if (document.hidden) return;
      const { depth, lastPos } = computeScrollDepth();
      setScrollDepth((prev) => Math.max(prev, depth));
      lastPosRef.current = Math.max(lastPosRef.current, lastPos);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // initial sample
    onScroll();

    const tick = window.setInterval(() => {
      if (document.hidden) return;
      setActiveSeconds((s) => s + 1);
    }, 1000);

    const syncInterval = window.setInterval(() => {
      if (document.hidden) return;
      const now = Date.now();
      if (now - lastSyncAtRef.current < 9000) return;
      lastSyncAtRef.current = now;

      const depth = scrollDepth;
      const active = activeSeconds;
      const met = depth >= minScrollDepthPct && active >= minActiveSeconds;
      const percentage = met ? 100 : Math.min(99, Math.floor((Math.min(depth / minScrollDepthPct, 1) * 0.6 + Math.min(active / minActiveSeconds, 1) * 0.4) * 100));

      onShouldSync?.({
        scrollDepth: depth,
        activeSeconds: active,
        lastPositionSeconds: lastPosRef.current,
        percentage,
      });

      if (!completed && met) {
        setCompleted(true);
        onCompleted?.();
      }
    }, 2500);

    const onVisibility = () => {
      if (document.hidden) {
        const now = Date.now();
        if (now - lastSyncAtRef.current >= 2000) {
          lastSyncAtRef.current = now;
          const met = scrollDepth >= minScrollDepthPct && activeSeconds >= minActiveSeconds;
          const percentage = met ? 100 : Math.min(99, Math.floor((Math.min(scrollDepth / minScrollDepthPct, 1) * 0.6 + Math.min(activeSeconds / minActiveSeconds, 1) * 0.4) * 100));
          onShouldSync?.({
            scrollDepth,
            activeSeconds,
            lastPositionSeconds: lastPosRef.current,
            percentage,
          });
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("scroll", onScroll as any);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(tick);
      window.clearInterval(syncInterval);
    };
  }, [activeSeconds, completed, enabled, lessonId, minActiveSeconds, minScrollDepthPct, onCompleted, onShouldSync, scrollDepth]);

  return useMemo(
    () => ({
      scrollDepth,
      activeSeconds,
      completed,
      percentage:
        scrollDepth >= minScrollDepthPct && activeSeconds >= minActiveSeconds
          ? 100
          : Math.min(
              99,
              Math.floor(
                (Math.min(scrollDepth / minScrollDepthPct, 1) * 0.6 + Math.min(activeSeconds / minActiveSeconds, 1) * 0.4) * 100
              )
            ),
    }),
    [activeSeconds, completed, minActiveSeconds, minScrollDepthPct, scrollDepth]
  );
}


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TimeRange } from "@/lib/utils/ranges";
import { clamp, mergeRanges, totalRangeSeconds } from "@/lib/utils/ranges";

type Args = {
  lessonId: number | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  completionThresholdPct?: number; // default 80
  initialResumeSeconds?: number; // from backend (optional)
  onProgress?: (p: { watchedSeconds: number; totalSeconds: number; percentage: number; lastPositionSeconds: number }) => void;
  onShouldSync?: (payload: {
    watchedSeconds: number;
    totalSeconds: number;
    percentage: number;
    lastPositionSeconds: number;
  }) => void;
  onCompleted?: () => void;
};

export function useVideoEngagementTracker({
  lessonId,
  videoRef,
  enabled,
  completionThresholdPct = 80,
  initialResumeSeconds,
  onProgress,
  onShouldSync,
  onCompleted,
}: Args) {
  const [percentage, setPercentage] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const rangesRef = useRef<TimeRange[]>([]);
  const lastTickRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const pendingStartRef = useRef<number | null>(null);
  const lastSyncAtRef = useRef<number>(0);
  const lastSentWatchedRef = useRef<number>(0);
  const hasResumedRef = useRef(false);

  const compute = useCallback((duration: number) => {
    const merged = mergeRanges(rangesRef.current);
    rangesRef.current = merged;
    const watched = Math.floor(totalRangeSeconds(merged));
    const pct = duration > 0 ? Math.floor((watched / duration) * 100) : 0;
    const bounded = clamp(pct, 0, 100);
    return { watched, pct: bounded };
  }, []);

  const flushAndMaybeSync = useCallback(
    (reason: "interval" | "pause" | "hidden" | "ended") => {
      const video = videoRef.current;
      if (!video || !lessonId) return;
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration <= 0) return;

      // close current segment
      if (pendingStartRef.current != null) {
        const start = pendingStartRef.current;
        const end = clamp(video.currentTime, 0, duration);
        if (end > start) {
          rangesRef.current = mergeRanges([...rangesRef.current, [start, end]]);
        }
        pendingStartRef.current = null;
      }

      const { watched, pct } = compute(duration);
      setWatchedSeconds(watched);
      setTotalSeconds(Math.floor(duration));
      setPercentage(pct);

      const lastPos = Math.floor(clamp(video.currentTime, 0, duration));
      onProgress?.({ watchedSeconds: watched, totalSeconds: Math.floor(duration), percentage: pct, lastPositionSeconds: lastPos });

      const now = Date.now();
      const shouldSync =
        reason !== "interval" ||
        now - lastSyncAtRef.current >= 8000 ||
        watched - lastSentWatchedRef.current >= 10;

      if (shouldSync) {
        lastSyncAtRef.current = now;
        lastSentWatchedRef.current = watched;
        onShouldSync?.({
          watchedSeconds: watched,
          totalSeconds: Math.floor(duration),
          percentage: pct,
          lastPositionSeconds: lastPos,
        });
      }

      if (!isCompleted && pct >= completionThresholdPct) {
        setIsCompleted(true);
        onCompleted?.();
      }
    },
    [compute, completionThresholdPct, isCompleted, lessonId, onCompleted, onProgress, onShouldSync, videoRef]
  );

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (hasResumedRef.current) return;
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration <= 0) return;
      setTotalSeconds(Math.floor(duration));
      if (typeof initialResumeSeconds === "number" && initialResumeSeconds > 0 && initialResumeSeconds < duration - 1) {
        video.currentTime = initialResumeSeconds;
        hasResumedRef.current = true;
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [enabled, initialResumeSeconds, videoRef]);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      lastTickRef.current = performance.now();
      pendingStartRef.current = clamp(video.currentTime, 0, Number.isFinite(video.duration) ? video.duration : video.currentTime);
    };

    const handlePause = () => {
      flushAndMaybeSync("pause");
      lastTickRef.current = null;
    };

    const handleTimeUpdate = () => {
      // Only count while actually playing and tab is visible
      if (video.paused || document.hidden) return;

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration <= 0) return;

      const ct = clamp(video.currentTime, 0, duration);
      const last = lastTimeRef.current;
      lastTimeRef.current = ct;

      // If user seeks forward, close previous segment and start a new one at current time.
      // We do NOT count the skipped gap because we only store played segments.
      if (Math.abs(ct - last) > 1.25) {
        flushAndMaybeSync("interval");
        pendingStartRef.current = ct;
      }
    };

    const handleSeeking = () => {
      // close segment before seeking
      flushAndMaybeSync("interval");
      pendingStartRef.current = null;
    };

    const handleSeeked = () => {
      // start new segment at the new position if playing
      if (!video.paused && !document.hidden) {
        pendingStartRef.current = clamp(video.currentTime, 0, Number.isFinite(video.duration) ? video.duration : video.currentTime);
      }
    };

    const handleEnded = () => {
      flushAndMaybeSync("ended");
    };

    const handleVisibility = () => {
      if (document.hidden) {
        flushAndMaybeSync("hidden");
      } else {
        // if video is currently playing, restart segment
        if (!video.paused) {
          pendingStartRef.current = clamp(video.currentTime, 0, Number.isFinite(video.duration) ? video.duration : video.currentTime);
        }
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("ended", handleEnded);
    document.addEventListener("visibilitychange", handleVisibility);

    const interval = window.setInterval(() => {
      if (!video.paused && !document.hidden) {
        flushAndMaybeSync("interval");
      }
    }, 9000);

    return () => {
      window.clearInterval(interval);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, flushAndMaybeSync, videoRef]);

  // Reset when lesson changes
  useEffect(() => {
    rangesRef.current = [];
    pendingStartRef.current = null;
    lastTimeRef.current = 0;
    lastSyncAtRef.current = 0;
    lastSentWatchedRef.current = 0;
    hasResumedRef.current = false;
    setPercentage(0);
    setWatchedSeconds(0);
    setTotalSeconds(0);
    setIsCompleted(false);
  }, [lessonId]);

  return useMemo(
    () => ({
      watchedSeconds,
      totalSeconds,
      percentage,
      isCompleted,
    }),
    [isCompleted, percentage, totalSeconds, watchedSeconds]
  );
}


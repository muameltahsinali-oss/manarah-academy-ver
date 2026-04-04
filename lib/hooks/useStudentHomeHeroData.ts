"use client";

import { useMemo } from "react";
import { useRecommendedCourses } from "@/lib/hooks/useCoursePlayer";
import { useStudentCourses, useStudentDashboard } from "@/lib/hooks/useDashboard";

export type ContinueRow = {
    course: Record<string, unknown>;
    progress: number;
};

export type FallbackCourse = {
    slug: string;
    title: string;
    progress: number;
    thumbnail_url?: string | null;
    updated_at?: string;
};

export type RecommendedPreview = {
    slug: string;
    title: string;
    thumbnail?: string | null;
    reason_label?: string | null;
};

/**
 * Shared data for the landing hero (tabbed) + discovery rails — one fetch path for students.
 */
export function useStudentHomeHeroData(enabled: boolean) {
    const { data: recRes, isLoading: recLoading } = useRecommendedCourses(enabled);
    const { data: myRes, isLoading: myLoading } = useStudentCourses(enabled);
    const { data: dashRes, isLoading: dashLoading } = useStudentDashboard(enabled);

    const payload = recRes?.data as
        | {
              continue_learning?: ContinueRow[];
              for_you?: { course: Record<string, unknown>; reason_label?: string }[];
              because_you_learned?: { course: Record<string, unknown>; reason_label?: string }[];
              popular?: { course: Record<string, unknown>; reason_label?: string }[];
          }
        | undefined;

    const continueRows = payload?.continue_learning;

    const fallbackCourse = useMemo((): FallbackCourse | null => {
        const list = (myRes?.data ?? []) as Array<{
            slug: string;
            title: string;
            progress: number;
            status?: string;
            thumbnail_url?: string | null;
            updated_at?: string;
        }>;
        const active = list
            .filter((c) => c.status !== "completed" && (c.progress ?? 0) < 100)
            .sort((a, b) => {
                const ta = a.updated_at ? Date.parse(a.updated_at) : 0;
                const tb = b.updated_at ? Date.parse(b.updated_at) : 0;
                return tb - ta;
            });
        const first = active[0];
        if (!first) return null;
        return {
            slug: first.slug,
            title: first.title,
            progress: first.progress ?? 0,
            thumbnail_url: first.thumbnail_url,
            updated_at: first.updated_at,
        };
    }, [myRes?.data]);

    const forYouRows = payload?.for_you ?? [];
    const recommendedPreview =
        forYouRows[0]?.course && String((forYouRows[0].course as { slug?: string }).slug ?? "")
            ? {
                  slug: String((forYouRows[0].course as { slug?: string }).slug ?? ""),
                  title: String((forYouRows[0].course as { title?: string }).title ?? ""),
                  thumbnail:
                      ((forYouRows[0].course as { thumbnail?: string | null }).thumbnail ??
                          null) as string | null,
                  reason_label: forYouRows[0].reason_label ?? null,
              }
            : null;

    const loadingHero = recLoading || myLoading;

    return {
        payload,
        continueRows,
        fallbackCourse,
        recommendedPreview,
        forYouRows,
        recLoading,
        myLoading,
        dashLoading,
        loadingHero,
        dash: dashRes?.data as
            | {
                  streak?: { current?: number };
                  weekly_completed_lessons?: number;
                  average_progress?: number;
              }
            | undefined,
    };
}

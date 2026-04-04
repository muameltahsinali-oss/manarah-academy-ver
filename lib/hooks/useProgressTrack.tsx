"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/lib/api";
import { getClientTimezone } from "@/lib/clientTimezone";
import { rewardCourseProgress } from "@/lib/engagement/rewardCompletion";
import { toast } from "sonner";
import { BadgeUnlockToast } from "@/components/badges/BadgeUnlockToast";

export type TrackPayload = {
  lesson_id: number;
  event_type: "video" | "docs";
  watched_seconds: number;
  total_duration_seconds: number;
  last_position_seconds: number;
  scroll_depth?: number;
  active_seconds?: number;
  client_event_at_ms?: number;
};

export type TrackResponse = {
  success: boolean;
  data: {
    completed: boolean;
    percentage: number;
    resume_from_seconds: number;
    course_progress?: number | null;
    course_completed?: boolean;
    badges_earned?: Array<{
      id: number;
      name: string;
      description?: string;
      rarity?: string;
      icon_url?: string | null;
      points?: number;
    }>;
    streak?: { milestone_reached?: number | null; counted_today?: boolean };
  };
};

export function useProgressTrack(courseSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TrackPayload) =>
      post<TrackResponse>("/progress/track", {
        ...payload,
        ...(getClientTimezone() ? { timezone: getClientTimezone() } : {}),
      }),
    onSuccess: (res) => {
      if (!res?.success) return;
      if (res.data.completed) {
        rewardCourseProgress(queryClient, courseSlug, res.data.course_progress ?? undefined, {
          kind: "video",
        });
        queryClient.invalidateQueries({ queryKey: ["progress", courseSlug] });
        queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["course", courseSlug] });
        queryClient.invalidateQueries({ queryKey: ["badges"] });
        queryClient.invalidateQueries({ queryKey: ["certificates"] });
        toast.success("تم إكمال الدرس تلقائيًا ✅");

        const badgesEarned = res.data.badges_earned ?? [];
        badgesEarned.forEach((badge, i) => {
          setTimeout(() => {
            toast.custom(() => <BadgeUnlockToast badge={badge as any} />, { duration: 5000 });
          }, (i + 1) * 400);
        });
        const m = res.data.streak?.milestone_reached;
        if (res.data.streak?.counted_today && (m === 7 || m === 30)) {
          toast.success(
            m === 30
              ? "🎉 30 يوماً متتالياً — استثنائي!"
              : "🎉 أسبوع كامل من التعلم المتتالي!",
            { duration: 6000 }
          );
        }
      }
    },
  });
}


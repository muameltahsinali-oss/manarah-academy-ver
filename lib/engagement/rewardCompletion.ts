import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { crossedMilestones, milestoneToastLine } from "@/lib/engagement/progressMessaging";
import { addLearningXp, XP_LESSON_COMPLETE, XP_QUIZ_PASS } from "@/lib/engagement/xp";

export type CompletionKind = "lesson" | "quiz" | "video";

/**
 * Call **before** invalidating `['course', courseSlug]` so previous progress is still in cache.
 * Skips duplicate/no-op completions (same %). Toasts fire on a short delay so they sit after the primary success toast.
 */
export function rewardCourseProgress(
    queryClient: QueryClient,
    courseSlug: string | undefined,
    newProgress: number | null | undefined,
    options: { kind: CompletionKind; awardXp?: boolean }
): void {
    if (!courseSlug || typeof newProgress !== "number" || Number.isNaN(newProgress)) return;

    const prevEntry = queryClient.getQueryData(["course", courseSlug]) as { data?: { enrollment_progress?: number } } | undefined;
    const prev = typeof prevEntry?.data?.enrollment_progress === "number" ? prevEntry.data.enrollment_progress : 0;

    const crossed = crossedMilestones(prev, newProgress);
    const progressed = newProgress > prev;

    if (!progressed && crossed.length === 0) return;

    const awardXp = options.awardXp !== false;
    const xpAmount = options.kind === "quiz" ? XP_QUIZ_PASS : XP_LESSON_COMPLETE;

    setTimeout(() => {
        const milestoneLine = milestoneToastLine(crossed);

        let xpTotal: number | null = null;
        if (awardXp && progressed) {
            xpTotal = addLearningXp(xpAmount);
        }

        if (milestoneLine) {
            const suffix = xpTotal !== null ? ` · +${xpAmount} نقطة` : "";
            toast.success(`${milestoneLine}${suffix}`, { duration: 4200 });
            return;
        }

        if (xpTotal !== null) {
            toast.message(`+${xpAmount} نقطة نشاط`, {
                description: `المجموع ${xpTotal} نقطة`,
                duration: 2400,
            });
        }
    }, 480);
}

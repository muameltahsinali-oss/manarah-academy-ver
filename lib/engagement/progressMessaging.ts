/** Course completion milestones for encouragement (percent). */
export const PROGRESS_MILESTONES = [25, 50, 75, 100] as const;

/**
 * Returns milestone thresholds crossed when moving from `prev` to `next` (inclusive).
 */
export function crossedMilestones(prev: number, next: number): number[] {
    const a = Math.max(0, Math.min(100, Math.round(prev)));
    const b = Math.max(0, Math.min(100, Math.round(next)));
    return PROGRESS_MILESTONES.filter((m) => a < m && b >= m);
}

const MILESTONE_COPY: Record<number, string> = {
    25: "تقدّم رائع — تجاوزت ربع الدورة",
    50: "وصلت لمنتصف الطريق — أحسنت 💪",
    75: "اقتربت من خط النهاية — واصل 🚀",
    100: "أكملت الدورة بالكامل — مذهل 🔥",
};

/** One short toast line for the highest milestone crossed. */
export function milestoneToastLine(crossed: number[]): string | null {
    if (crossed.length === 0) return null;
    if (crossed.includes(100)) return MILESTONE_COPY[100];
    const hi = Math.max(...crossed);
    return MILESTONE_COPY[hi] ?? "تقدّم ملحوظ في الدورة!";
}

/** Subcopy for progress bars / headers (static, not a toast). */
export function encouragementForProgress(percent: number): string {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    if (p >= 100) return "رحلة مكتملة — استعد للخطوة التالية.";
    if (p >= 75) return "لم يبقَ إلا القليل.";
    if (p >= 50) return "أنت في المنتصف — زِد الزخم.";
    if (p >= 25) return "انطلاقة قوية — ثابِر.";
    return "كل درس يقرّبك من هدفك.";
}

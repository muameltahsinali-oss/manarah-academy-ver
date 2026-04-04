const DAY_SHORT_AR = ["أحد", "إثنين", "ثلاث", "أربعاء", "خميس", "جمعة", "سبت"];

/** Buckets for the last 7 calendar days (oldest → newest) for mini charts. */
export function buildLast7DaysActivity(
    activities: Array<{ at?: string | null }>
): { label: string; count: number }[] {
    const buckets: { label: string; count: number; day: string }[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (6 - i));
        const day = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        buckets.push({
            label: DAY_SHORT_AR[d.getDay()] ?? "",
            count: 0,
            day,
        });
    }

    for (const a of activities) {
        if (!a.at) continue;
        const d = new Date(a.at);
        d.setHours(0, 0, 0, 0);
        const day = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const b = buckets.find((x) => x.day === day);
        if (b) b.count += 1;
    }

    return buckets.map(({ label, count }) => ({ label, count }));
}

export type TimeRange = [start: number, end: number];

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Merge a list of [start,end] ranges (seconds) into sorted, non-overlapping ranges.
 * Ranges with end <= start are ignored.
 */
export function mergeRanges(ranges: TimeRange[]): TimeRange[] {
  const cleaned = ranges
    .map(([s, e]) => [Math.min(s, e), Math.max(s, e)] as TimeRange)
    .filter(([s, e]) => Number.isFinite(s) && Number.isFinite(e) && e > s)
    .sort((a, b) => a[0] - b[0]);

  const out: TimeRange[] = [];
  for (const [s, e] of cleaned) {
    const last = out[out.length - 1];
    if (!last) {
      out.push([s, e]);
      continue;
    }
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      out.push([s, e]);
    }
  }
  return out;
}

export function totalRangeSeconds(ranges: TimeRange[]): number {
  return ranges.reduce((sum, [s, e]) => sum + Math.max(0, e - s), 0);
}


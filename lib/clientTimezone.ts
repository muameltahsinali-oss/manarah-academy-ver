/** IANA timezone for streak / calendar-day logic (e.g. "Asia/Riyadh"). */
export function getClientTimezone(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

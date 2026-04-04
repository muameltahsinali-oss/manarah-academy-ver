/**
 * Base URL للـ Laravel API (ينتهي بـ `/api`).
 * - إن وُجد `NEXT_PUBLIC_API_URL` في Vercel/البيئة يُستخدم كما هو.
 * - في production بدون متغير: الافتراضي هو API الإنتاج (تجنّب طلب localhost من المتصفح).
 * - في التطوير المحلي: localhost إن لم تُضبط القيمة.
 */
const PRODUCTION_DEFAULT = "https://api.manarah-academy.com/api";

export function getPublicApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_DEFAULT;
  }
  return "http://localhost:8000/api";
}

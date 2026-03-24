/**
 * Returns true if the image URL is from our Laravel backend.
 * Use with next/image unoptimized to avoid 400 when loading via _next/image proxy.
 */
export function isBackendImageUrl(src: string | null | undefined): boolean {
  if (!src || typeof src !== "string") return false;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const origin = new URL(apiUrl).origin; // e.g. http://localhost:8000
    return src.startsWith(origin + "/");
  } catch {
    return false;
  }
}

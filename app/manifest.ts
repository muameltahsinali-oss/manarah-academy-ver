import type { MetadataRoute } from "next";

/** Manifest ثابت — مناسب لـ SSR وVercel. */
export const dynamic = "force-static";

/**
 * Web App Manifest — consumed at /manifest.webmanifest
 * Theme colors match app/globals.css brand tokens.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "منارة اكاديمي — تعلّم بمنهجية",
    short_name: "منارة اكاديمي",
    description: "منصة تعليمية مهيكلة تركز على الدقة والوضوح.",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    orientation: "portrait-primary",
    background_color: "#F9FAFB",
    theme_color: "#FF6B57",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

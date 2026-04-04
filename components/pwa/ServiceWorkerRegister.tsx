"use client";

import { useEffect } from "react";

const shouldRegister =
  typeof window !== "undefined" &&
  (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_PWA_DEV === "1");

/**
 * Registers /public/sw.js — production by default; set NEXT_PUBLIC_PWA_DEV=1 to test in dev.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!shouldRegister || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "imports",
        });
        if (cancelled) return;
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              /* new version available — could dispatch event for in-app "refresh" toast */
            }
          });
        });
      } catch {
        /* registration failed — app still works without SW */
      }
    };

    if (document.readyState === "complete") {
      void register();
    } else {
      window.addEventListener("load", () => void register(), { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

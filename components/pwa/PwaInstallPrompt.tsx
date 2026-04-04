"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "manara_pwa_install_dismissed_at";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * "Add to Home Screen" for Chromium (Android/desktop). iOS Safari has no beforeinstallprompt — users install via Share → Add to Home Screen (documented in README).
 */
export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true);

    if (isStandalone) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      try {
        const dismissed = localStorage.getItem(DISMISS_KEY);
        if (!dismissed || Date.now() - Number(dismissed) > COOLDOWN_MS) {
          setVisible(true);
        }
      } catch {
        setVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
    if (choice.outcome === "accepted") {
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    }
  }, [deferred]);

  if (!visible || !deferred) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-label="تثبيت التطبيق"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:left-auto md:right-6 md:bottom-6 md:max-w-md md:p-0"
      >
        <div className="flex items-start gap-3 rounded-[4px] border border-border/80 bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] md:shadow-lg">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-primary/10 text-primary">
            <Download className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-sm font-bold text-text">ثبّت منارة اكاديمي</p>
            <p className="mt-1 text-xs leading-relaxed text-text/65">
              أضف المنصة إلى الشاشة الرئيسية لتجربة بملء الشاشة وأسرع.
            </p>
            <button
              type="button"
              onClick={() => void install()}
              className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-[4px] bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90 touch-manipulation"
            >
              تثبيت
            </button>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-[4px] p-2 text-text/50 transition-colors hover:bg-black/[0.04] hover:text-text touch-manipulation"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

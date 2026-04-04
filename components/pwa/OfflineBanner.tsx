"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

/**
 * Lightweight offline strip — does not block interaction; pairs with SW offline.html on hard navigation failures.
 */
export function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          role="status"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="sticky top-0 z-[90] overflow-hidden pt-[env(safe-area-inset-top)]"
        >
          <div className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/15 px-4 py-2 text-center text-xs font-bold text-text">
            <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-800/90" aria-hidden />
            <span>لا يوجد اتصال بالإنترنت — بعض المحتويات قد لا تُحدَّث</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

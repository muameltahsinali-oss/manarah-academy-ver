"use client";

import { useCallback, useEffect, useState } from "react";
import { getLearningXp } from "@/lib/engagement/xp";

export function useLearningXp(): number {
    const [xp, setXp] = useState(0);

    const sync = useCallback(() => setXp(getLearningXp()), []);

    useEffect(() => {
        sync();
        window.addEventListener("storage", sync);
        window.addEventListener("platformx-xp-updated", sync as EventListener);
        return () => {
            window.removeEventListener("storage", sync);
            window.removeEventListener("platformx-xp-updated", sync as EventListener);
        };
    }, [sync]);

    return xp;
}

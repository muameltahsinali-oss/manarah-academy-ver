"use client";

import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AUTH_BROADCAST = "platformx-auth";

/**
 * Keeps auth state aligned across tabs (logout/login in another tab).
 */
export function AuthBroadcastBridge() {
    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        if (typeof BroadcastChannel === "undefined") return;

        const ch = new BroadcastChannel(AUTH_BROADCAST);
        ch.onmessage = (e: MessageEvent<{ type?: string }>) => {
            if (e.data?.type === "logout") {
                Cookies.remove("auth_token");
                queryClient.clear();
                router.refresh();
            }
            if (e.data?.type === "login") {
                void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            }
        };

        return () => ch.close();
    }, [queryClient, router]);

    return null;
}

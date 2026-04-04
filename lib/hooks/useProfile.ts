import { useMutation, useQueryClient } from "@tanstack/react-query";
import { put } from "../api";
import type { User } from "./useAuth";

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Record<string, unknown>) => put<{ data: User }>("/auth/profile", data),
        onSuccess: (res) => {
            queryClient.setQueryData(["auth", "me"], { data: res.data });
            queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
        },
    });
}

export function useChangePassword() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: {
            current_password: string;
            password: string;
            password_confirmation: string;
        }) => put<{ data: User }>("/auth/password", payload),
        onSuccess: (res) => {
            queryClient.setQueryData(["auth", "me"], { data: res.data });
        },
    });
}

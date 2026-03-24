import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import type { BadgeItem } from "@/components/badges/BadgeCard";

export interface BadgesResponse {
    success: boolean;
    data: BadgeItem[];
}

export function useBadges() {
    return useQuery({
        queryKey: ["badges"],
        queryFn: () => get<BadgesResponse>("/badges"),
    });
}

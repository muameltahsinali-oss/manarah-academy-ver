import type { UserPreferences } from "@/lib/hooks/useAuth";

export const DEFAULT_USER_PREFERENCES: Required<UserPreferences> = {
    ui: {
        autoDarkMode: true,
        animations: true,
        hideLeaderboard: false,
        autoFocus: true,
    },
    notifications: {
        systemNotifications: true,
        weeklyDigest: true,
        socialNotifications: true,
        promotions: false,
    },
    language: "ar",
    timezone: "Asia/Riyadh",
};

export function mergeUserPreferences(raw: UserPreferences | null | undefined): Required<UserPreferences> {
    return {
        ui: { ...DEFAULT_USER_PREFERENCES.ui, ...raw?.ui },
        notifications: { ...DEFAULT_USER_PREFERENCES.notifications, ...raw?.notifications },
        language: raw?.language ?? DEFAULT_USER_PREFERENCES.language,
        timezone: raw?.timezone ?? DEFAULT_USER_PREFERENCES.timezone,
    };
}

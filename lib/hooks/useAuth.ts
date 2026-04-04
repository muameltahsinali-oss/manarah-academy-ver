import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect, useMemo } from 'react';
import { get, post, put } from '../api';
import { useRouter } from 'next/navigation';
import { getErrorStatus } from '@/lib/auth/sessionError';

/** Persisted under `users.preferences` (JSON). */
export interface UserPreferences {
    ui?: {
        autoDarkMode?: boolean;
        animations?: boolean;
        hideLeaderboard?: boolean;
        autoFocus?: boolean;
    };
    notifications?: {
        systemNotifications?: boolean;
        weeklyDigest?: boolean;
        socialNotifications?: boolean;
        promotions?: boolean;
    };
    language?: string;
    timezone?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    role: "student" | "instructor" | "admin";
    instructor_status?: "pending" | "approved" | null;
    bio?: string | null;
    avatar?: string | null;
    interests?: string[];
    /** ISO 8601 from API */
    created_at?: string;
    preferences?: UserPreferences | null;
    current_streak?: number;
    longest_streak?: number;
}

export type AuthSessionStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'degraded';

const AUTH_BROADCAST = 'platformx-auth';

function broadcastAuth(type: 'login' | 'logout') {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(AUTH_BROADCAST);
    ch.postMessage({ type });
    ch.close();
}

/**
 * Laravel JsonResource wraps attributes in `data`, and our ApiResponse also uses a top-level `data` key.
 * That yields nested `{ data: { data: User } }` for `/auth/me`. Unwrap until we see `id` + `email`.
 */
function isLikelyUserFields(o: Record<string, unknown>): boolean {
    const id = o.id;
    const idOk =
        typeof id === "number" ||
        (typeof id === "string" && id.trim() !== "" && Number.isFinite(Number(id)));
    const email = o.email;
    return idOk && typeof email === "string" && email.includes("@");
}

function normalizeUnwrappedUser(o: Record<string, unknown>): User {
    const id =
        typeof o.id === "number"
            ? o.id
            : Number.parseInt(String(o.id), 10);
    const role = o.role;
    const normalizedRole: User["role"] =
        role === "instructor" || role === "admin" || role === "student"
            ? role
            : "student";
    return { ...o, id, role: normalizedRole } as User;
}

/**
 * Laravel JsonResource may wrap in `data`; ApiResponse also uses `data`.
 * Some payloads use `{ user: { ... } }` or string ids — unwrap until we see user fields.
 */
function unwrapApiUserPayload(raw: unknown): User | undefined {
    let cur: unknown = raw;
    for (let depth = 0; depth < 6 && cur && typeof cur === "object"; depth++) {
        const o = cur as Record<string, unknown>;
        if (isLikelyUserFields(o)) {
            return normalizeUnwrappedUser(o);
        }
        if (o.user !== undefined && typeof o.user === "object" && o.user !== null) {
            cur = o.user;
            continue;
        }
        if (o.data !== undefined && typeof o.data === "object" && o.data !== null) {
            cur = o.data;
            continue;
        }
        break;
    }
    return undefined;
}

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const hasToken = typeof window !== 'undefined' && !!Cookies.get('auth_token');

    const isInterestsConfigured = (u: User | null | undefined): boolean => {
        return Array.isArray(u?.interests); // [] counts as configured
    };

    /**
     * بعد تسجيل الدخول/التسجيل: الصفحة الرئيسية `/` (وليس `/dashboard`).
     * استثناء: طالب جديد بلا اهتمامات مُعرَّفة → مسار التهيئة.
     */
    const pushAfterAuth = (u: User) => {
        if (u.role === "student" && !isInterestsConfigured(u)) {
            router.replace("/onboarding");
            return;
        }
        router.replace("/");
    };

    const goHomeAfterAuth = () => {
        void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        router.replace('/');
    };

    const {
        data: meRes,
        error: meError,
        isError: isMeError,
        isSuccess: isMeSuccess,
        isPending: isMePending,
        isFetching: isMeFetching,
        refetch: refetchMe,
    } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: () => get<{ data: User }>('/auth/me'),
        retry: (failureCount, err) => {
            if (getErrorStatus(err) === 401) return false;
            return failureCount < 2;
        },
        retryDelay: (i) => Math.min(1000 * 2 ** i, 4000),
        enabled: hasToken,
    });

    const user = useMemo(() => {
        if (!isMeSuccess || !meRes) return undefined;
        return unwrapApiUserPayload(meRes.data);
    }, [isMeSuccess, meRes]);

    const authSessionStatus: AuthSessionStatus = useMemo(() => {
        if (!hasToken) return 'unauthenticated';
        if (isMePending || (isMeFetching && !isMeSuccess)) {
            return 'loading';
        }
        if (isMeSuccess && user) return 'authenticated';
        if (isMeSuccess && !user) return 'unauthenticated';
        if (isMeError) {
            if (getErrorStatus(meError) === 401) return 'unauthenticated';
            return 'degraded';
        }
        return 'loading';
    }, [
        hasToken,
        isMePending,
        isMeFetching,
        isMeSuccess,
        user,
        isMeError,
        meError,
    ]);

    useEffect(() => {
        if (!isMeError || !meError) return;
        if (getErrorStatus(meError) === 401) {
            queryClient.removeQueries({ queryKey: ['auth', 'me'] });
        }
    }, [isMeError, meError, queryClient]);

    const isAuthenticated = authSessionStatus === 'authenticated';
    /** True while first fetch is in flight (token present). */
    const isLoading = authSessionStatus === 'loading';
    /** True while session cannot be trusted for guest vs authed UI (loading or recoverable failure). */
    const isSessionPending = authSessionStatus === 'loading' || authSessionStatus === 'degraded';
    const isInitialLoading = authSessionStatus === 'loading';

    const refetchSession = () => refetchMe();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: Record<string, string>) => post<{ data: { token: string, user: User } }>('/auth/login', credentials),
        onSuccess: (res) => {
            if (res.data.token) {
                Cookies.set('auth_token', res.data.token, { expires: 7 }); // 7 days Cookie
                const u = unwrapApiUserPayload(res.data.user);
                if (u) {
                    queryClient.setQueryData(['auth', 'me'], { data: u });
                    broadcastAuth('login');
                    pushAfterAuth(u);
                } else {
                    goHomeAfterAuth();
                }
            }
        },
    });

    // Register mutation 
    const registerMutation = useMutation({
        mutationFn: (data: Record<string, string>) => post<{
            data: {
                token: string | null;
                user: User;
                verification_required?: boolean;
                approval_required?: boolean;
            };
        }>('/auth/register', data),
        onSuccess: (res) => {
            // When backend returns token=null, user must verify email / wait for admin approval.
            if (res.data.token) {
                Cookies.set('auth_token', res.data.token, { expires: 7 });
                const u = unwrapApiUserPayload(res.data.user);
                if (u) {
                    queryClient.setQueryData(['auth', 'me'], { data: u });
                    broadcastAuth('login');
                    pushAfterAuth(u);
                } else {
                    goHomeAfterAuth();
                }
            } else {
                Cookies.remove('auth_token');
            }
        },
    });

    // Verify email (student)
    const verifyEmailMutation = useMutation({
        mutationFn: (payload: { email: string; code: string }) =>
            post<{ data: { token: string | null; user: User } }>('/auth/verify-email', payload),
        onSuccess: (res) => {
            if (!res.data.token) return;
            Cookies.set('auth_token', res.data.token, { expires: 7 });
            const u = unwrapApiUserPayload(res.data.user);
            if (u) {
                queryClient.setQueryData(['auth', 'me'], { data: u });
                broadcastAuth('login');
                pushAfterAuth(u);
            } else {
                goHomeAfterAuth();
            }
        },
    });

    const resendEmailVerificationCodeMutation = useMutation({
        mutationFn: (payload: { email: string }) =>
            post<{ data: { sent: boolean } }>('/auth/resend-email-code', payload),
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: (payload: { email: string }) =>
            post<{ success: boolean; message: string }>('/auth/forgot-password', payload),
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (payload: {
            email: string;
            token: string;
            password: string;
            password_confirmation: string;
        }) =>
            post<{ success: boolean; message: string }>('/auth/reset-password', payload),
    });

    // Update Profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (data: Partial<User>) => put<{ data: User }>('/auth/profile', data),
        onSuccess: (res) => {
            const u = unwrapApiUserPayload(res.data);
            if (u) {
                queryClient.setQueryData(['auth', 'me'], { data: u });
            }
            queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: () => post('/auth/logout'),
        onSettled: () => {
            Cookies.remove('auth_token');
            queryClient.clear();
            broadcastAuth('logout');
            router.replace('/');
        },
    });

    return {
        user,
        authSessionStatus,
        isLoading,
        isInitialLoading,
        isSessionPending,
        isAuthenticated,
        refetchSession,
        /** True while `/auth/me` request is in flight (initial or refetch). */
        isFetchingSession: isMeFetching,

        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,

        verifyEmail: verifyEmailMutation.mutateAsync,
        isVerifyingEmail: verifyEmailMutation.isPending,
        verifyEmailError: verifyEmailMutation.error,

        resendEmailVerificationCode: resendEmailVerificationCodeMutation.mutateAsync,
        isResendingEmailVerificationCode: resendEmailVerificationCodeMutation.isPending,
        resendEmailVerificationCodeError: resendEmailVerificationCodeMutation.error,

        forgotPassword: forgotPasswordMutation.mutateAsync,
        isForgotPassword: forgotPasswordMutation.isPending,
        forgotPasswordError: forgotPasswordMutation.error,

        resetPassword: resetPasswordMutation.mutateAsync,
        isResetPassword: resetPasswordMutation.isPending,
        resetPasswordError: resetPasswordMutation.error,

        logout: logoutMutation.mutateAsync,

        updateProfile: updateProfileMutation.mutateAsync,
        isUpdatingProfile: updateProfileMutation.isPending,
        updateProfileError: updateProfileMutation.error,
    };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { get, post, put } from '../api';
import { useRouter } from 'next/navigation';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'student' | 'instructor' | 'admin';
    bio?: string;
    avatar?: string;
    interests?: string[];
}

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    // Interests "configured" means the user already went through onboarding (even if empty via Skip).
    const isInterestsConfigured = (u: User | null | undefined): boolean => {
        return Array.isArray(u?.interests); // [] counts as configured
    };

    const pushAfterAuth = (u: User) => {
        if (!isInterestsConfigured(u)) {
            router.push('/onboarding');
            return;
        }
        router.push(u.role === 'instructor' ? '/instructor/dashboard' : '/dashboard');
    };

    // Fetch current user
    const { data: meRes, isLoading, isError, status } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: () => get<{ data: User }>('/auth/me'),
        retry: false,
        enabled: !!Cookies.get('auth_token'),
    });

    const user = meRes?.data;
    const isAuthenticated = !!user;
    const isInitialLoading = status === 'pending' && !!Cookies.get('auth_token');

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: Record<string, string>) => post<{ data: { token: string, user: User } }>('/auth/login', credentials),
        onSuccess: (res) => {
            if (res.data.token) {
                Cookies.set('auth_token', res.data.token, { expires: 7 }); // 7 days Cookie
                queryClient.setQueryData(['auth', 'me'], { data: res.data.user });
                pushAfterAuth(res.data.user);
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
                queryClient.setQueryData(['auth', 'me'], { data: res.data.user });
                pushAfterAuth(res.data.user);
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
            queryClient.setQueryData(['auth', 'me'], { data: res.data.user });
            pushAfterAuth(res.data.user);
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
            queryClient.setQueryData(['auth', 'me'], { data: res.data });
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: () => post('/auth/logout'),
        onSettled: () => {
            Cookies.remove('auth_token');
            queryClient.clear();
            router.push('/login');
        },
    });

    return {
        user,
        isLoading: isLoading || isInitialLoading,
        isInitialLoading,
        isAuthenticated,
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

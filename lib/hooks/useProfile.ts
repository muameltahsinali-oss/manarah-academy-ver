import { useMutation, useQueryClient } from '@tanstack/react-query';
import { put } from '../api';
import { User } from './useAuth';

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Record<string, any>) => put<{ data: User }>('/auth/profile', data),
        onSuccess: (res) => {
            // Update the authenticated user in the cache so the UI updates immediately
            queryClient.setQueryData(['auth', 'me'], { data: res.data });
        },
    });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, del } from '../api';

export interface LearningPathCourse {
    id: number;
    slug: string;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
    order: number;
    enrollment_progress: number;
}

export interface LearningPathItem {
    id: number;
    title: string;
    goal: string;
    created_at: string;
    updated_at: string;
    courses?: LearningPathCourse[];
}

export function useLearningPaths(enabled = true) {
    return useQuery({
        queryKey: ['learning-paths'],
        queryFn: () => get<{ success: boolean; data: LearningPathItem[] }>('/learning-paths'),
        enabled,
    });
}

export function useLearningPath(id: number | null) {
    return useQuery({
        queryKey: ['learning-path', id],
        queryFn: () => get<{ success: boolean; data: LearningPathItem }>(`/learning-paths/${id}`),
        enabled: id != null,
    });
}

export function useGenerateLearningPath() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (goal: string) =>
            post<{ success: boolean; message?: string; data?: LearningPathItem }>(
                '/learning-paths/generate',
                { goal }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
        },
    });
}

export function useDeleteLearningPath() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => del<{ success: boolean; message?: string }>(`/learning-paths/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
        },
    });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { del, get, post } from '../api';

export interface LearningPathCourse {
    id: number;
    slug: string;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
    order: number;
    enrollment_progress: number;
    price?: number;
    discount_price?: number | null;
    effective_price?: number;
    is_free?: boolean;
    currency?: string;
    level?: string;
    rating?: number | null;
    reviews_count?: number;
    duration_minutes?: number | null;
}

export interface SuggestedAction {
    id: string;
    label: string;
    instruction: string;
}

export interface ChatTurn {
    role: 'user' | 'assistant';
    content: string;
    suggested_actions?: SuggestedAction[];
}

export interface LearningPathItem {
    id: number;
    title: string;
    goal: string;
    status?: string;
    current_step_index?: number;
    percent_complete?: number;
    created_at: string;
    updated_at: string;
    courses?: LearningPathCourse[];
    path_total_effective_price?: number;
    path_currency?: string;
}

/** Temporary draft from POST /learning-paths/draft (not committed). */
export interface LearningPathDraftPayload {
    id: number;
    goal: string;
    title: string | null;
    revision: number;
    expires_at: string;
    courses: LearningPathCourse[];
    change_summary?: string;
    chat_history?: ChatTurn[];
    path_total_effective_price?: number;
    path_currency?: string;
    last_assistant?: {
        message: string;
        suggested_actions: SuggestedAction[];
    };
}

export interface ActiveLearningPathResponse {
    path: LearningPathItem | null;
    next_course: { id: number; slug: string; title: string } | null;
}

export function useLearningPaths(enabled = true) {
    return useQuery({
        queryKey: ['learning-paths'],
        queryFn: () => get<{ success: boolean; data: LearningPathItem[] }>('/learning-paths'),
        enabled,
    });
}

export function useActiveLearningPath(enabled = true) {
    return useQuery({
        queryKey: ['learning-paths', 'active'],
        queryFn: () => get<{ success: boolean; data: ActiveLearningPathResponse }>('/learning-paths/active'),
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

/** Creates a temporary draft (does not persist a committed path until commit). */
export function useCreateLearningPathDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (goal: string) =>
            post<{ success: boolean; message?: string; data: LearningPathDraftPayload }>('/learning-paths/draft', {
                goal,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths', 'active'] });
        },
    });
}

/** Legacy alias — same as draft. */
export function useGenerateLearningPath() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (goal: string) =>
            post<{ success: boolean; message?: string; data: LearningPathDraftPayload }>(
                '/learning-paths/generate',
                { goal }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths', 'active'] });
        },
    });
}

export function useModifyLearningPathDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            draft_id: number;
            instruction: string;
            target_step_index?: number;
        }) =>
            post<{ success: boolean; message?: string; data: LearningPathDraftPayload & { change_summary?: string } }>(
                `/learning-paths/draft/${payload.draft_id}/modify`,
                { instruction: payload.instruction, target_step_index: payload.target_step_index }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths', 'active'] });
        },
    });
}

/** Discussion (advisor) or action (apply edit) — see mode. */
export function useLearningPathDraftChat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            draft_id: number;
            message: string;
            mode: 'discussion' | 'action';
            target_step_index?: number;
        }) =>
            post<{ success: boolean; message?: string; data: LearningPathDraftPayload }>(
                `/learning-paths/draft/${payload.draft_id}/chat`,
                {
                    message: payload.message,
                    mode: payload.mode,
                    target_step_index: payload.target_step_index,
                }
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths', 'active'] });
        },
    });
}

export function useCommitLearningPath() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { draft_id: number; replace_active: boolean }) =>
            post<{ success: boolean; message?: string; data: LearningPathItem }>('/learning-paths/commit', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
            queryClient.invalidateQueries({ queryKey: ['learning-paths', 'active'] });
            queryClient.invalidateQueries({ queryKey: ['courses', 'recommended'] });
            queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
        },
    });
}

export function useDeleteLearningPath() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => del<{ success: boolean; message?: string }>(`/learning-paths/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
            queryClient.invalidateQueries({ queryKey: ['learning-paths', 'active'] });
        },
    });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '../api';

export function useInstructorCourses() {
    return useQuery({
        queryKey: ['instructor', 'courses'],
        queryFn: () => get<any>('/instructor/courses'),
    });
}

export function useInstructorDashboard() {
    return useQuery({
        queryKey: ['instructor', 'dashboard'],
        queryFn: () => get<any>('/instructor/dashboard'),
    });
}

export function useInstructorCourse(id: number | null) {
    return useQuery({
        queryKey: ['instructor', 'course', id],
        queryFn: () => get<any>(`/instructor/courses/${id}`),
        enabled: !!id,
    });
}

export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Record<string, any>) => post<any>('/instructor/courses', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
        },
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: Record<string, any> }) => put<any>(`/instructor/courses/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course', variables.id] });
        },
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => del<any>(`/instructor/courses/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
        },
    });
}

export function useAnalytics(courseId: number) {
    return useQuery({
        queryKey: ['instructor', 'analytics', courseId],
        queryFn: () => get<any>(`/instructor/analytics/${courseId}`),
        enabled: !!courseId,
    });
}

// Modules
export function useCreateModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { course_id: number, title: string, order?: number }) => post<any>('/instructor/modules', data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course', variables.course_id] });
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course', variables.course_id, 'ready'] });
        },
    });
}

export function useUpdateModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: { title?: string, order?: number } }) => put<any>(`/instructor/modules/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

export function useDeleteModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => del<any>(`/instructor/modules/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

// Lessons
export function useCreateLesson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { module_id: number; title: string; lesson_type: 'video' | 'documentation' | 'quiz'; type?: string; duration?: number; content_url?: string; order?: number }) =>
            post<any>('/instructor/lessons', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

export function useUpdateLesson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { title?: string; type?: string; lesson_type?: 'video' | 'documentation' | 'quiz'; duration?: number; content_url?: string; order?: number; is_preview?: boolean; docs_content?: any; quiz_config?: any } }) =>
            put<any>(`/instructor/lessons/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

export function useDeleteLesson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => del<any>(`/instructor/lessons/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

// Lesson Resources
export function useLessonResources(lessonId: number | null) {
    return useQuery({
        queryKey: ['instructor', 'lesson', lessonId, 'resources'],
        queryFn: () => get<any>(`/instructor/lessons/${lessonId}/resources`),
        enabled: !!lessonId,
    });
}

type CreateResourcePayload =
    | { lessonId: number; data: { title: string; type: 'link'; url: string } }
    | { lessonId: number; formData: FormData };

export function useCreateLessonResource() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateResourcePayload) => {
            const url = `/instructor/lessons/${payload.lessonId}/resources`;
            if ('formData' in payload) {
                return post<any>(url, payload.formData);
            }
            return post<any>(url, payload.data);
        },
        onSuccess: (_, variables) => {
            const lessonId = variables.lessonId;
            queryClient.invalidateQueries({ queryKey: ['instructor', 'lesson', lessonId, 'resources'] });
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

export function useUpdateLessonResource() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { title?: string; url?: string } }) =>
            put<any>(`/instructor/resources/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
            queryClient.invalidateQueries({ queryKey: ['instructor', 'lesson'] });
        },
    });
}

export function useReorderLessonResources(lessonId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (order: number[]) =>
            post<any>(`/instructor/lessons/${lessonId}/resources/reorder`, { order }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'lesson', lessonId, 'resources'] });
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

export function useDeleteLessonResource() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => del<any>(`/instructor/resources/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

// Course Publishing
export function useCourseReady(id: number | null) {
    return useQuery({
        queryKey: ['instructor', 'course', id, 'ready'],
        queryFn: () => get<any>(`/instructor/courses/${id}/ready`),
        enabled: !!id,
        refetchOnWindowFocus: true,
    });
}

export function usePublishCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => post<any>(`/instructor/courses/${id}/publish`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
            queryClient.invalidateQueries({ queryKey: ['instructor', 'course'] });
        },
    });
}

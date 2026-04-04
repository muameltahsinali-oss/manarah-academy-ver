import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post } from '../api';
import { getClientTimezone } from '@/lib/clientTimezone';
import { rewardCourseProgress } from '@/lib/engagement/rewardCompletion';
import { toast } from 'sonner';
import { BadgeUnlockToast } from '@/components/badges/BadgeUnlockToast';

export function useCourses() {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => get<any>('/courses'),
    });
}

export function useCoursesWithEnabled(enabled: boolean) {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => get<any>('/courses'),
        enabled,
    });
}

export function useRecommendedCourses(enabled: boolean) {
    return useQuery({
        queryKey: ['courses', 'recommended'],
        queryFn: () => get<any>('/courses/recommended'),
        enabled,
        staleTime: 60 * 1000,
    });
}

export function useCourseData(courseId: string) {
    return useQuery({
        queryKey: ['course', courseId],
        queryFn: () => get<any>(`/courses/${courseId}`),
        enabled: !!courseId,
    });
}

// NOTE: Manual lesson completion is intentionally removed.
// Completion is handled via strict engagement tracking (video) and quiz pass.
// Docs lessons are completed manually (per product decision).

export function useMarkDocsLessonComplete(courseSlug?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: number) =>
            post<any>(`/lesson/${lessonId}/complete`, {
                ...(getClientTimezone() ? { timezone: getClientTimezone() } : {}),
            }),
        onSuccess: (data: {
            data?: {
                course_completed?: boolean;
                course_progress?: number;
                badges_earned?: Array<{ id: number; name: string; description?: string; rarity?: string; icon_url?: string | null; points?: number }>;
                streak?: { milestone_reached?: number | null; counted_today?: boolean; current_streak?: number };
            };
        }) => {
            rewardCourseProgress(queryClient, courseSlug, data?.data?.course_progress, { kind: 'lesson' });
            queryClient.invalidateQueries({ queryKey: ['progress', courseSlug] });
            queryClient.invalidateQueries({ queryKey: ['my-courses'] });
            queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['course', courseSlug] });
            queryClient.invalidateQueries({ queryKey: ['badges'] });
            queryClient.invalidateQueries({ queryKey: ['certificates'] });
            toast.success('تم تأكيد إكمال الدرس ✅');
            if (data?.data?.course_completed) {
                toast.success('أكملت الدورة! يمكنك تحميل الشهادة من لوحة التحكم.', { duration: 5000 });
            }
            const badgesEarned = data?.data?.badges_earned ?? [];
            badgesEarned.forEach((badge, i) => {
                setTimeout(() => {
                    toast.custom(() => <BadgeUnlockToast badge={badge as any} />, { duration: 5000 });
                }, (i + 1) * 400);
            });
            const m = data?.data?.streak?.milestone_reached;
            if (data?.data?.streak?.counted_today && (m === 7 || m === 30)) {
                toast.success(
                    m === 30
                        ? '🎉 30 يوماً متتالياً — استثنائي!'
                        : '🎉 أسبوع كامل من التعلم المتتالي!',
                    { duration: 6000 }
                );
            }
        },
        onError: (err: Error) => {
            toast.error(err.message || 'فشل في تأكيد إكمال الدرس');
        },
    });
}

export function useProgress(courseSlug: string) {
    return useQuery({
        queryKey: ['progress', courseSlug],
        queryFn: () => get<any>(`/progress/${courseSlug}`),
        enabled: !!courseSlug,
    });
}

export function useEnroll() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: number) => post<any>(`/enroll/${courseId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-courses'] });
            queryClient.invalidateQueries({ queryKey: ['course'] });
            queryClient.invalidateQueries({ queryKey: ['courses', 'recommended'] });
        },
    });
}

export function useReviews(courseSlug: string) {
    return useQuery({
        queryKey: ['reviews', courseSlug],
        queryFn: () => get<any>(`/courses/${courseSlug}/reviews`),
        enabled: !!courseSlug,
    });
}

export function useAddReview(courseSlug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { rating: number; comment: string }) =>
            post<any>(`/courses/${courseSlug}/reviews`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', courseSlug] });
            queryClient.invalidateQueries({ queryKey: ['course', courseSlug] });
        },
    });
}

export function useLessonMedia(lessonId: number | null) {
    return useQuery({
        queryKey: ['lesson-media', lessonId],
        queryFn: () => get<any>(`/lessons/${lessonId}/media`),
        enabled: !!lessonId,
        retry: false,
    });
}

export function useSubmitQuiz(lessonId: number | null, courseSlug?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (answers: Array<{ question_id: number | string; option_id: number | string }>) =>
            post<any>(`/lessons/${lessonId}/quiz/submit`, {
                answers,
                ...(getClientTimezone() ? { timezone: getClientTimezone() } : {}),
            }),
        onSuccess: (res: any) => {
            if (res?.data?.passed) {
                rewardCourseProgress(queryClient, courseSlug, res?.data?.course_progress, { kind: 'quiz' });
            }
            queryClient.invalidateQueries({ queryKey: ['progress'] });
            if (courseSlug) {
                queryClient.invalidateQueries({ queryKey: ['progress', courseSlug] });
                queryClient.invalidateQueries({ queryKey: ['course', courseSlug] });
            }
            queryClient.invalidateQueries({ queryKey: ['my-courses'] });
            queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
            toast.success('تم إرسال الاختبار بنجاح');
            const m = res?.data?.streak?.milestone_reached;
            if (res?.data?.passed && res?.data?.streak?.counted_today && (m === 7 || m === 30)) {
                toast.success(
                    m === 30
                        ? '🎉 30 يوماً متتالياً — استثنائي!'
                        : '🎉 أسبوع كامل من التعلم المتتالي!',
                    { duration: 6000 }
                );
            }
        },
        onError: (err: Error) => {
            toast.error(err.message || 'فشل في إرسال الاختبار');
        },
    });
}

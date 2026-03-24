import { useMutation, useQuery } from '@tanstack/react-query';
import { post, get } from '../api';
import { useRouter } from 'next/navigation';

export function usePayment(paymentId: string | null) {
    return useQuery({
        queryKey: ['payment', paymentId],
        queryFn: () => get<any>(`/payments/${paymentId}`),
        enabled: !!paymentId,
    });
}

export function usePayments() {
    return useQuery({
        queryKey: ['payments'],
        queryFn: () => get<any>('/payments'),
    });
}

export function useCheckout() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (courseId: number) => {
            const response = await post<any>('/payments/initiate', { course_id: courseId });
            return response;
        },
        onSuccess: (data) => {
            if (data.redirect_url) {
                router.push(data.redirect_url);
            }
        },
    });
}

export function useSimulatePayment() {
    return useMutation({
        mutationFn: (paymentId: number) => post<any>(`/payments/${paymentId}/simulate-success`),
    });
}


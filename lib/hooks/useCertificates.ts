import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import apiClient from '../api';
import { get } from '../api';

export function useCertificates() {
    return useQuery({
        queryKey: ['certificates'],
        queryFn: () => get<any>('/certificates'),
    });
}

/** Download certificate PDF using the same API client (cookie + Bearer auth). */
export async function downloadCertificate(certificateId: number): Promise<void> {
    if (!Cookies.get('auth_token')) {
        window.location.href = '/login';
        return;
    }

    try {
        const blob = await apiClient.request({
            method: 'GET',
            url: `/certificates/${certificateId}/download`,
            responseType: 'blob',
        }) as unknown as Blob;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `certificate-${certificateId}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'تحميل الشهادة فشل';
        throw new Error(message);
    }
}

import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // For consistent cross-origin session/cookies if domains match
});

// Request interceptor to add Bearer token
apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Crucial: Let the browser set the Content-Type with the boundary automatically for FormData
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

// Response interceptor to handle global errors
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Check if the user is unauthenticated
        if (error.response?.status === 401) {
            Cookies.remove('auth_token');
            // لا نوجّه لتسجيل الدخول من الصفحات العامة (الرئيسية، الدورات، إلخ) — الضيف يتصفح بحرية
            const path = typeof window !== 'undefined' ? window.location.pathname : '';
            const isHome = path === '/' || path === '';
            const isAuthPage = path.includes('/login') || path.includes('/register');
            const isPublicPage = path === '/courses' || path.startsWith('/courses/');
            if (typeof window !== 'undefined' && !isHome && !isAuthPage && !isPublicPage) {
                window.location.href = '/login';
            }
        }

        // Normalize error shape to be consumed by Zod/RHF downstream
        let data = error.response?.data;
        const status = error.response?.status;

        const finish = (parsedData: unknown) => {
            const errorMessage =
                (parsedData && typeof parsedData === 'object' && 'message' in parsedData && (parsedData as { message: string }).message) ||
                error.message ||
                (status === 400 && 'طلب غير صالح') ||
                (status === 404 && 'المورد غير موجود') ||
                (status === 500 && 'خطأ في الخادم. يرجى المحاولة لاحقاً.') ||
                'An unexpected error occurred';
            const errors = (parsedData && typeof parsedData === 'object' && 'errors' in parsedData && (parsedData as { errors: Record<string, string[]> }).errors) || {};

            // Avoid noisy console errors for expected 404s (e.g. مورد غير موجود) in development.
            // Still surface real server/client issues like 5xx and 4xx other than 401/404.
            if (process.env.NODE_ENV === 'development' && status && status !== 401 && status !== 404) {
                console.error('[API Error]', status, errorMessage, parsedData ?? error.message);
            }

            const returnedError = new Error(errorMessage);
            (returnedError as any).errors = errors;
            (returnedError as any).status = error.response?.status;
            return Promise.reject(returnedError);
        };

        // When request used responseType: 'blob', error body is a Blob; parse it to get API message
        if (data instanceof Blob && status && status >= 400) {
            return data.text().then((text) => {
                try {
                    const parsed = text ? JSON.parse(text) : null;
                    return finish(typeof parsed === 'object' && parsed !== null ? parsed : null);
                } catch {
                    return finish(null);
                }
            });
        }

        return finish(data);
    }
);

export const get = async <T,>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, { params, ...config });
};

export const post = async <T,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config);
};

export const put = async <T,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config);
};

export const patch = async <T,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch(url, data, config);
};

export const del = async <T,>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config);
};

export default apiClient;

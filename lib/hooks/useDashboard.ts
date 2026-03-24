import { useQuery } from '@tanstack/react-query';
import { get } from '../api';

export function useStudentDashboard(enabled = true) {
    return useQuery({
        queryKey: ['student', 'dashboard'],
        queryFn: () => get<any>('/dashboard'),
        enabled,
    });
}

export function useStudentCourses(enabled = true) {
    return useQuery({
        queryKey: ['my-courses'],
        queryFn: () => get<any>('/my-courses'),
        enabled,
    });
}

export function useStudentNotifications() {
    return useQuery({
        queryKey: ['student', 'notifications'],
        queryFn: () => get<any>('/student/notifications'), // Placeholder for future API addition
    });
}

export function useInstructorDashboard() {
    return useQuery({
        queryKey: ['instructor', 'dashboard'],
        queryFn: () => get<any>('/instructor/dashboard'),
    });
}

export function useAdminDashboard() {
    return useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: () => get<any>('/admin/dashboard'),
    });
}

export function useInstructorStudents() {
    return useQuery({
        queryKey: ['instructor', 'students'],
        queryFn: () => get<any>('/instructor/students'),
    });
}

export function useAdminUsers() {
    return useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => get<any>('/admin/users'),
    });
}

export function useAdminCourses() {
    return useQuery({
        queryKey: ['admin', 'courses'],
        queryFn: () => get<any>('/admin/courses'),
    });
}

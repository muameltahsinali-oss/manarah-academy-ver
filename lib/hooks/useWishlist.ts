import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, del } from '../api';

export interface WishlistItem {
    id: number;
    user_id: number;
    course_id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    image: string | null;
    instructor?: {
        id: number;
        name: string;
        avatar?: string;
    };
}

export function useWishlist() {
    const queryClient = useQueryClient();

    const { data: wishlistRes, isLoading } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => get<{ data: any[] }>('/wishlist'),
    });

    const items = wishlistRes?.data || [];

    const addToWishlist = useMutation({
        mutationFn: (courseId: number) => post('/wishlist', { course_id: courseId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const removeFromWishlist = useMutation({
        mutationFn: (courseId: number) => del(`/wishlist/${courseId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const isInWishlist = (courseId: number) => {
        return items.some((item) => item.id === courseId);
    };

    return {
        items,
        isLoading,
        addToWishlist: addToWishlist.mutateAsync,
        removeFromWishlist: removeFromWishlist.mutateAsync,
        isAdding: addToWishlist.isPending,
        isRemoving: removeFromWishlist.isPending,
        isInWishlist,
    };
}

/**
 * دوال مساعدة لجلب slugs/دروس من الـ API (سكربتات، خرائط موقع، إلخ).
 * مع SSR على Vercel لا تُستخدم لإجبار `generateStaticParams` — المسارات ديناميكية.
 */

import { getPublicApiUrl } from "./publicApiUrl";

function apiBase(): string {
    return getPublicApiUrl();
}

type PaginatedCourses = {
    data?: unknown[];
    meta?: { current_page?: number; last_page?: number };
};

function unwrapRows(body: unknown): unknown[] {
    if (!body || typeof body !== "object") return [];
    const o = body as Record<string, unknown>;
    const inner = o.data;
    if (Array.isArray(inner)) return inner;
    if (inner && typeof inner === "object" && Array.isArray((inner as PaginatedCourses).data)) {
        return (inner as PaginatedCourses).data as unknown[];
    }
    return [];
}

export async function fetchAllPublishedCourseSlugs(): Promise<string[]> {
    const base = apiBase();
    const slugs: string[] = [];
    let page = 1;
    const maxPages = 100;

    while (page <= maxPages) {
        try {
            const res = await fetch(`${base}/courses?page=${page}`, {
                cache: "no-store",
                headers: { Accept: "application/json" },
            });
            if (!res.ok) break;
            const body = (await res.json()) as {
                data?: unknown[];
                meta?: { current_page?: number; last_page?: number };
            };
            const rows = Array.isArray(body.data) ? body.data : unwrapRows(body);
            for (const row of rows) {
                if (row && typeof row === "object" && "slug" in row && typeof (row as { slug: string }).slug === "string") {
                    slugs.push((row as { slug: string }).slug);
                }
            }
            const last = body.meta?.last_page ?? page;
            if (page >= last || rows.length === 0) break;
            page += 1;
        } catch {
            break;
        }
    }

    return [...new Set(slugs)];
}

type CourseDetail = {
    slug?: string;
    modules?: { lessons?: { id?: number }[] }[];
};

export async function fetchLessonIdsForSlug(slug: string): Promise<number[]> {
    const base = apiBase();
    try {
        const res = await fetch(`${base}/courses/${encodeURIComponent(slug)}`, {
            cache: "no-store",
            headers: { Accept: "application/json" },
        });
        if (!res.ok) return [];
        const body = await res.json();
        const data = (body && typeof body === "object" && "data" in body ? (body as { data: CourseDetail }).data : body) as CourseDetail;
        const ids: number[] = [];
        for (const m of data.modules ?? []) {
            for (const l of m.lessons ?? []) {
                if (typeof l.id === "number") ids.push(l.id);
            }
        }
        return ids;
    } catch {
        return [];
    }
}

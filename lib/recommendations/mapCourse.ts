/** Map GET /courses/recommended course payload → CourseCard props. */
export function mapApiCourseToFeaturedCard(
    c: Record<string, unknown>,
    recommendationHint?: string
) {
    const slug = String(c.slug ?? "");
    return {
        id: Number(c.id),
        slug,
        prefix: slug.toUpperCase().split("-")[0] || "CRS",
        title: String(c.title ?? ""),
        description: (c.description as string) || undefined,
        instructor: (c.instructor as { name?: string } | undefined)?.name || "مدرّب",
        duration: "4h",
        rating: String(c.rating ?? c.average_rating ?? "4.5"),
        students: String(c.students ?? c.students_count ?? "0"),
        level: String(c.level ?? ""),
        tag: String(c.category ?? "عام"),
        thumbnail: (c.thumbnail as string | null | undefined) ?? undefined,
        recommendationHint,
    };
}

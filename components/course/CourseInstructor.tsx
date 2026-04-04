"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Users, BookOpen, GraduationCap } from "lucide-react";
import { isBackendImageUrl } from "@/lib/utils/image";

export interface CourseInstructorProps {
    name: string;
    /** لقب مهني قصير (مثال: مهندس برمجيات أول) */
    headline?: string | null;
    role: string;
    bio: string;
    courses: string;
    students: string;
    rating: string;
    avatar: string;
}

function displayRoleLabel(role: string): string {
    const r = role.trim().toLowerCase();
    if (r === "instructor") return "مدرّب معتمد";
    if (r === "admin") return "مشرف المنصّة";
    return role;
}

export function CourseInstructor({
    name,
    headline,
    role,
    bio,
    courses,
    students,
    rating,
    avatar,
}: CourseInstructorProps) {
    const displayTitle = headline?.trim() || displayRoleLabel(role);

    return (
        <motion.section
            id="instructor"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="scroll-mt-24 w-full overflow-hidden rounded-[4px] border border-border bg-gradient-to-br from-white via-background to-primary/[0.04] shadow-sm shadow-secondary/5"
        >
            <div className="border-b border-border/80 bg-secondary/[0.06] px-6 py-4 md:px-8">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-secondary/90">عن المدرّب</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-text md:text-[26px]">تعرّف على مدرّب الدورة</h2>
            </div>

            <div className="flex flex-col gap-8 p-6 md:flex-row md:items-start md:gap-10 md:p-8">
                <div className="flex shrink-0 flex-col items-center md:items-start">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-primary/25 bg-text/5 shadow-md ring-4 ring-white md:h-36 md:w-36">
                        <Image
                            src={avatar}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="144px"
                            unoptimized={isBackendImageUrl(avatar)}
                        />
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-text/70">
                            <Star className="h-3.5 w-3.5 text-primary" aria-hidden />
                            {rating}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-text/70">
                            <Users className="h-3.5 w-3.5 text-accent" aria-hidden />
                            {students}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-text/70">
                            <BookOpen className="h-3.5 w-3.5 text-secondary" aria-hidden />
                            {courses} دورة
                        </span>
                    </div>
                </div>

                <div className="min-w-0 flex-1 text-center md:text-right">
                    <div className="flex flex-col items-center gap-1 md:items-start">
                        <h3 className="text-xl font-bold tracking-tight text-text md:text-2xl">{name}</h3>
                        <p className="mt-1 flex items-center justify-center gap-2 text-sm font-semibold text-primary md:justify-start">
                            <GraduationCap className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                            {displayTitle}
                        </p>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-text/75 md:text-[15px]">{bio}</p>

                    <p className="mt-6 text-xs leading-relaxed text-text/45">
                        الأرقام تعكس نشاط المدرّب على المنصّة في الدورات المعتمدة، وقد تتغير مع الوقت.
                    </p>
                </div>
            </div>
        </motion.section>
    );
}

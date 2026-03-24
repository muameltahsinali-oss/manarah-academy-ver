"use client";

import { motion } from "framer-motion";
import { Star, Users, Video } from "lucide-react";

interface CourseInstructorProps {
    name: string;
    role: string;
    bio: string;
    courses: string;
    students: string;
    rating: string;
    avatar: string;
}

export function CourseInstructor({
    name, role, bio, courses, students, rating, avatar
}: CourseInstructorProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex flex-col md:flex-row gap-8 p-8 border border-border/80 rounded-[4px] bg-background"
        >
            <div className="shrink-0 text-center md:text-right">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary/20 bg-text/5 mx-auto md:mx-0">
                    <img src={avatar} alt={name} className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
                </div>
                <div className="mt-4 flex flex-col items-center md:items-start text-xs font-mono text-text/60 gap-1.5">
                    <div className="flex gap-2">
                        <Video className="w-4 h-4" />
                        <span>{courses} دورة</span>
                    </div>
                    <div className="flex gap-2">
                        <Users className="w-4 h-4" />
                        <span>{students} طالب</span>
                    </div>
                    <div className="flex gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span>{rating} تقييم المدرّب</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 pl-4 md:pl-0 border-r-0 md:border-r border-border/60 md:pr-8">
                <h2 className="text-xl font-bold tracking-tight">{name}</h2>
                <h3 className="text-sm font-bold text-primary mb-4">{role}</h3>
                <p className="text-sm text-text/70 leading-relaxed font-medium">
                    {bio}
                </p>
            </div>
        </motion.section>
    );
}

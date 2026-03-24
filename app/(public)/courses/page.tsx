import { CoursesClient } from "@/components/courses/CoursesClient";

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 md:px-8 pt-12">
                <div className="mb-8 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">المنهج الدراسي</h1>
                        <p className="text-text/60">مسارات مهيكلة للتميز الهندسي — ابحث وفلتر بسرعة.</p>
                    </div>
                </div>
            </div>

            <CoursesClient />
        </div>
    );
}

import { MyCoursesClient } from "./MyCoursesClient";

export const metadata = {
    title: "دوراتي - منارة اكاديمي",
    description: "تصفح وتابع تقدمك في الدورات المشترك بها.",
};

export default function CoursesPage() {
    return <MyCoursesClient />;
}

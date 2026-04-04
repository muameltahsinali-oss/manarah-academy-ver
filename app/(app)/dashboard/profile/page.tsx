import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata = {
    title: "الملف الشخصي - منارة اكاديمي",
    description: "استعرض إحصائياتك وإنجازاتك الشخصية.",
};

export default function ProfilePage() {
    return <ProfileClient />;
}

import { ProfileClient } from "./ProfileClient";

export const metadata = {
    title: "الملف الشخصي - منارة اكاديمي",
    description: "استعرض إحصائياتك وإنجازاتك الشخصية.",
};

export default function ProfilePage() {
    return <ProfileClient />;
}

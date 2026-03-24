import { AdminSettingsClient } from "./AdminSettingsClient";

export const metadata = {
    title: 'إعدادات المنصة | منارة اكاديمي',
    description: 'إدارة إعدادات المنصة العامة',
};

export default function AdminSettingsPage() {
    return <AdminSettingsClient />;
}

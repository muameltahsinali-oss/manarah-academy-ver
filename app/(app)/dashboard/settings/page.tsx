import { SettingsClient } from "./SettingsClient";

export const metadata = {
    title: "الإعدادات - منارة اكاديمي",
    description: "إدارة إعدادات حسابك وتفضيلات النظام.",
};

export default function SettingsPage() {
    return <SettingsClient />;
}

import { NotificationsClient } from "./NotificationsClient";

export const metadata = {
    title: "الإشعارات - منارة اكاديمي",
    description: "أحدث التنبيهات ورسائل النظام.",
};

export default function NotificationsPage() {
    return <NotificationsClient />;
}

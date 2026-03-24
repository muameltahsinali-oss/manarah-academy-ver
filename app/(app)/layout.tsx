import { AppLayout } from "@/components/layout/AppLayout";
import { UserGuard } from "@/components/layout/UserGuard";

export default function PlatformRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserGuard>
            <AppLayout>{children}</AppLayout>
        </UserGuard>
    );
}

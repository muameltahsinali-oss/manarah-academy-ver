import { GuestGuard } from "@/components/layout/GuestGuard";

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
    return <GuestGuard>{children}</GuestGuard>;
}

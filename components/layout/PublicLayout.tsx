"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header variant="auto" />
            <main className="flex-1 w-full pb-24 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
        </>
    );
}

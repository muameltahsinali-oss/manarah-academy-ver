"use client";

import { Container } from "@/components/ui/Container";

export function HomeLoadingShell() {
    return (
        <div className="min-h-[60vh] bg-background">
            <Container className="py-16">
                <div className="mx-auto max-w-2xl space-y-4">
                    <div className="h-10 w-3/4 animate-pulse rounded-lg bg-border/40" />
                    <div className="h-4 w-full animate-pulse rounded bg-border/25" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-border/25" />
                    <div className="pt-8">
                        <div className="aspect-[21/9] animate-pulse rounded-2xl bg-border/30" />
                    </div>
                </div>
            </Container>
        </div>
    );
}

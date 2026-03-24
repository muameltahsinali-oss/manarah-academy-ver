import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const hasToken = request.cookies.has("auth_token");
    const { pathname } = request.nextUrl;

    // Protected paths
    const isProtectedPath = pathname.startsWith("/dashboard") ||
        pathname.startsWith("/instructor") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/settings");

    // Auth pages (login, register)
    const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (!hasToken && isProtectedPath) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (hasToken && isAuthPath) {
        // We don't know the role here easily without a separate cookie or jwt decode
        // For now, redirect to a generic dashboard or root
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/instructor/:path*", "/admin/:path*", "/settings/:path*"],
};

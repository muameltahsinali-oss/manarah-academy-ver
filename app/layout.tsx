import type { Metadata, Viewport } from "next";
import { Alexandria, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";

const fontSans = Alexandria({
  variable: "--font-sans-primary",
  subsets: ["arabic", "latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#FF6B57",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: "منارة اكاديمي | تعلّم بمنهجية. وتقدّم بدقّة.",
  description: "منارة اكاديمي منصة تعليمية مهيكلة تركز على الدقة والوضوح.",
  applicationName: "منارة اكاديمي",
  appleWebApp: {
    capable: true,
    title: "منارة اكاديمي",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
    apple: [{ url: "/icon-192.svg", sizes: "192x192" }],
  },
};

import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="overflow-x-clip scroll-smooth">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased min-h-screen min-h-[100dvh] flex flex-col font-sans bg-background text-text overflow-x-clip`}
      >
        <QueryProvider>
          <OfflineBanner />
          <ServiceWorkerRegister />
          <PwaInstallPrompt />
          {children}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              className: "font-sans text-sm",
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}

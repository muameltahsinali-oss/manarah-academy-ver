import type { Metadata } from "next";
import { Alexandria, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Alexandria({
  variable: "--font-sans-primary",
  subsets: ["arabic", "latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "منارة اكاديمي | تعلّم بمنهجية. وتقدّم بدقّة.",
  description: "منارة اكاديمي منصة تعليمية مهيكلة تركز على الدقة والوضوح.",
};

import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased min-h-screen flex flex-col font-sans bg-background text-text`}
      >
        <QueryProvider>
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

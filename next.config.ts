import type { NextConfig } from "next";

const apiHost =
  process.env.NEXT_PUBLIC_IMAGE_API_HOSTNAME || "api.manarah-academy.com";

const nextConfig: NextConfig = {
  /** SSR على Vercel (بدون `output: "export"`). */
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: apiHost,
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

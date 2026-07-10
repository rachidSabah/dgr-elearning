import type { NextConfig } from "next";

const isCloudflareBuild = process.env.BUILD_TARGET === "cloudflare";

const nextConfig: NextConfig = {
  // Use static export for Cloudflare, standalone for dev/other
  output: isCloudflareBuild ? "export" : "standalone",
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Image optimization - disable for static export
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  // Headers for security and caching (only applies to standalone mode)
  async headers() {
    if (isCloudflareBuild) return [];
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
    ];
  },
};

export default nextConfig;

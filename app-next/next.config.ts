import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  // Vercel-specific optimizations
  output: "standalone", // Optimize for Vercel deployment

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.openml.org",
        port: "",
        pathname: "/**", // Allow all paths for profile images
      },
      {
        protocol: "http",
        hostname: "www.openml.org",
        port: "",
        pathname: "/**", // Some avatar URLs use http (legacy)
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**", // GitHub profile avatars
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // Google user avatars
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**", // GitHub user avatars
      },
    ],
    // Vercel automatically optimizes images
    formats: ["image/avif", "image/webp"],
  },
  // Built-in 301 redirects for backward compatibility
  // Academic papers and external links often cite OpenML entities using short URLs
  async redirects() {
    return [
      // ========================================
      // SIMPLE PATH-BASED REDIRECTS (✅ Works in next.config.ts)
      // ========================================

      // Entity detail pages: /d/123 → /datasets/123 (no locale prefix for English)
      {
        source: "/d/:id",
        destination: "/datasets/:id",
        permanent: true, // 301 redirect (preserves SEO)
      },
      {
        source: "/t/:id",
        destination: "/tasks/:id",
        permanent: true,
      },
      {
        source: "/f/:id",
        destination: "/flows/:id",
        permanent: true,
      },
      {
        source: "/r/:id",
        destination: "/runs/:id",
        permanent: true,
      },
      // Benchmark short URLs: /b/383 → /benchmarks/383
      {
        source: "/b/:id",
        destination: "/benchmarks/:id",
        permanent: true,
      },
      // Collection/Study short URLs: /s/123 → /collections/123
      {
        source: "/s/:id",
        destination: "/collections/:id",
        permanent: true,
      },

      // Search page redirects: /d/search → /datasets
      {
        source: "/d/search",
        destination: "/datasets",
        permanent: true,
      },
      {
        source: "/t/search",
        destination: "/tasks",
        permanent: true,
      },
      {
        source: "/f/search",
        destination: "/flows",
        permanent: true,
      },
      {
        source: "/r/search",
        destination: "/runs",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

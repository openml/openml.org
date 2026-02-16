import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  // Vercel-specific optimizations
  output: "standalone", // Optimize for Vercel deployment

  // Enable WebAssembly support for parquet-wasm
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Configure webpack to handle WASM files
  webpack: (config, { isServer }) => {
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Add rule for WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Fix for WASM file resolution
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },

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
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
        pathname: "/**",
      },
    ],
    // Vercel automatically optimizes images
    formats: ["image/avif", "image/webp"],
  },

  // Built-in 301 redirects for backward compatibility
  // Academic papers and external links often cite OpenML entities using short URLs
  // Entity detail pages: /d/123 → /datasets/123 (no locale prefix for English)
  async redirects() {
    return [
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
  // Hybrid proxy: routes not yet migrated to Next.js fall back to Flask
  async rewrites() {
    const FLASK_BACKEND =
      process.env.FLASK_BACKEND_URL || "https://www.openml.org";

    return {
      // afterFiles: checked after Next.js pages/routes, so Next.js routes
      // always take priority; only unmatched routes fall through to Flask
      afterFiles: [
        // Flask auth pages (password reset flow)
        {
          source: "/forgotpassword",
          destination: `${FLASK_BACKEND}/forgotpassword`,
        },
        {
          source: "/resetpassword",
          destination: `${FLASK_BACKEND}/resetpassword`,
        },
        // API key retrieval (used by likes feature)
        {
          source: "/api-key",
          destination: `${FLASK_BACKEND}/api-key`,
        },
        // Likes/votes service
        {
          source: "/api_new/:path*",
          destination: `${FLASK_BACKEND}/api_new/:path*`,
        },
        // Legacy REST API (dataset metadata, features, evaluations)
        {
          source: "/api/v1/:path*",
          destination: `${FLASK_BACKEND}/api/v1/:path*`,
        },
        // General Flask proxy fallback
        {
          source: "/api/flask-proxy/:path*",
          destination: `${FLASK_BACKEND}/:path*`,
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);

import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://www.openml.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Auth & user-specific pages
          "/auth/",
          "/nl/auth/",
          "/fr/auth/",
          "/de/auth/",
          "/dashboard/",
          "/nl/dashboard/",
          "/fr/dashboard/",
          "/de/dashboard/",
          // Create/edit forms (not useful for indexing)
          "/datasets/upload",
          "/nl/datasets/upload",
          "/fr/datasets/upload",
          "/de/datasets/upload",
          "/tasks/create",
          "/nl/tasks/create",
          "/fr/tasks/create",
          "/de/tasks/create",
          "/collections/create",
          "/nl/collections/create",
          "/fr/collections/create",
          "/de/collections/create",
          "*/edit",
          // API routes
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

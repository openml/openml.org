import { MetadataRoute } from "next";
import { getElasticsearchUrl } from "@/lib/elasticsearch";

const SITE_URL =
  process.env.NEXT_PUBLIC_URL || "https://www.openml.org";

const LOCALES = ["nl", "fr", "de"] as const;

// Static pages (English canonical + locale alternates)
const STATIC_PAGES = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/datasets", changeFrequency: "daily", priority: 0.9 },
  { path: "/tasks", changeFrequency: "daily", priority: 0.9 },
  { path: "/flows", changeFrequency: "daily", priority: 0.9 },
  { path: "/runs", changeFrequency: "daily", priority: 0.8 },
  { path: "/benchmarks/tasks", changeFrequency: "weekly", priority: 0.8 },
  { path: "/benchmarks/runs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/collections/tasks", changeFrequency: "weekly", priority: 0.7 },
  { path: "/collections/runs", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/meet-us", changeFrequency: "monthly", priority: 0.5 },
  { path: "/team", changeFrequency: "monthly", priority: 0.5 },
  { path: "/documentation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/apis", changeFrequency: "monthly", priority: 0.6 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contribute", changeFrequency: "monthly", priority: 0.5 },
] as const;

// ES entity config: index, URL prefix, active filter field
const ENTITY_CONFIGS = [
  {
    index: "data",
    prefix: "/datasets",
    idField: "did",
    filter: { term: { status: "active" } },
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    index: "task",
    prefix: "/tasks",
    idField: "task_id",
    filter: { term: { status: "active" } },
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    index: "flow",
    prefix: "/flows",
    idField: "id",
    filter: null,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
] as const;

const PAGE_SIZE = 5000;

type SitemapEntry = {
  index: number;
  type: "static" | "data" | "task" | "flow";
};

export async function generateSitemaps(): Promise<{ id: number }[]> {
  // Sitemap 0 is always static pages.
  // Then one sitemap per PAGE_SIZE block per entity type.
  const ids: { id: number }[] = [{ id: 0 }];

  let offset = 1;
  for (const config of ENTITY_CONFIGS) {
    try {
      const res = await fetch(getElasticsearchUrl(`${config.index}/_count`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          config.filter ? { query: config.filter } : { query: { match_all: {} } }
        ),
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        const count: number = data.count ?? 0;
        const pages = Math.ceil(count / PAGE_SIZE);
        for (let i = 0; i < pages; i++) {
          ids.push({ id: offset + i });
        }
        offset += Math.max(pages, 1);
      }
    } catch {
      // If ES is unavailable, still include at least one sitemap block
      ids.push({ id: offset });
      offset++;
    }
  }

  return ids;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Sitemap 0: static pages with locale alternates
  if (id === 0) {
    const now = new Date();
    return STATIC_PAGES.flatMap(({ path, changeFrequency, priority }) => {
      const canonical = `${SITE_URL}${path}`;
      const localeAlternates = Object.fromEntries([
        ["x-default", canonical],
        ...LOCALES.map((locale) => [
          locale,
          `${SITE_URL}/${locale}${path}`,
        ]),
      ]);
      return [
        {
          url: canonical,
          lastModified: now,
          changeFrequency,
          priority,
          alternates: { languages: localeAlternates },
        },
      ];
    });
  }

  // Dynamic entity sitemaps — figure out which config and page this id maps to
  let offset = 1;
  for (const config of ENTITY_CONFIGS) {
    let count = 0;
    try {
      const countRes = await fetch(
        getElasticsearchUrl(`${config.index}/_count`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            config.filter ? { query: config.filter } : { query: { match_all: {} } }
          ),
          next: { revalidate: 3600 },
        }
      );
      if (countRes.ok) {
        const countData = await countRes.json();
        count = countData.count ?? 0;
      }
    } catch {
      // fallback
    }

    const pages = Math.max(Math.ceil(count / PAGE_SIZE), 1);
    if (id < offset + pages) {
      // This sitemap id belongs to this entity type
      const page = id - offset;
      return fetchEntitySitemap(config, page);
    }
    offset += pages;
  }

  return [];
}

async function fetchEntitySitemap(
  config: (typeof ENTITY_CONFIGS)[number],
  page: number
): Promise<MetadataRoute.Sitemap> {
  try {
    const query = config.filter
      ? { query: config.filter }
      : { query: { match_all: {} } };

    const res = await fetch(getElasticsearchUrl(`${config.index}/_search`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...query,
        _source: [config.idField, "date"],
        sort: [{ date: { order: "desc" } }],
        from: page * PAGE_SIZE,
        size: PAGE_SIZE,
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const hits: Array<{ _source: Record<string, unknown> }> =
      data.hits?.hits ?? [];

    return hits
      .map((hit) => {
        const entityId = hit._source[config.idField];
        if (!entityId) return null;
        const dateStr = hit._source["date"] as string | undefined;
        return {
          url: `${SITE_URL}${config.prefix}/${entityId}`,
          lastModified: dateStr ? new Date(dateStr) : new Date(),
          changeFrequency: config.changeFrequency,
          priority: config.priority,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  } catch {
    return [];
  }
}

/**
 * Unified Elasticsearch configuration and utility
 */

export const ELASTICSEARCH_SERVER =
  process.env.ELASTICSEARCH_SERVER ||
  process.env.NEXT_PUBLIC_ELASTICSEARCH_URL ||
  "https://es.openml.org/";

export const ELASTICSEARCH_INDICES = [
  "data",
  "task",
  "flow",
  "run",
  "study",
  "measure",
  "benchmark",
  "user",
];

/**
 * Get the full URL for an Elasticsearch endpoint
 */
export function getElasticsearchUrl(path: string): string {
  const base = ELASTICSEARCH_SERVER.endsWith("/")
    ? ELASTICSEARCH_SERVER
    : `${ELASTICSEARCH_SERVER}/`;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${base}${cleanPath}`;
}

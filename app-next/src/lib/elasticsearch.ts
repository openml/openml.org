/**
 * Unified Elasticsearch configuration and utility
 */

export const ELASTICSEARCH_URL =
  process.env.ELASTICSEARCH_URL ||
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
  const base = ELASTICSEARCH_URL.endsWith("/")
    ? ELASTICSEARCH_URL
    : `${ELASTICSEARCH_URL}/`;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${base}${cleanPath}`;
}

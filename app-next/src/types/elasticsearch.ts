// Generic Elasticsearch hit structure
export interface ElasticsearchHit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number | null;
  _source: T;
}

// Elasticsearch response structure
export interface ElasticsearchResponse<T> {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: "eq" | "gte";
    };
    max_score: number;
    hits: ElasticsearchHit<T>[];
  };
  aggregations?: Record<string, unknown>;
}

// Basic sort object (most common in your app)
export type ElasticsearchSort = { [field: string]: "asc" | "desc" } | string; // e.g., "name" or "_score"

// Elasticsearch query parameters
export interface ElasticsearchQueryBody {
  query: {
    bool?: {
      must?: Array<unknown>;
      must_not?: Array<unknown>;
      should?: Array<unknown>;
      filter?: Array<unknown>;
      minimum_should_match?: number | string;
    };
    match?: Record<string, string | { query: string; operator?: string }>;
    term?: Record<string, string | number | boolean>;
    terms?: Record<string, string[]>;
    range?: Record<
      string,
      { gte?: number | string; lte?: number | string; gt?: number; lt?: number }
    >;
    query_string?: {
      query: string;
      fields?: string[];
      default_operator?: "AND" | "OR";
    };
    // Fallback for complex/nested queries
    [key: string]: unknown;
  };
  size?: number;
  from?: number;
  sort?: ElasticsearchSort[];
  // Aggregations: keep flexible but safer than any
  aggs?: Record<string, unknown>;
}

// Search facet (filter) structure
export interface SearchFacet {
  field: string;
  label: string;
  type: "value" | "range";
  values?: Array<{
    value: string;
    count: number;
  }>;
}

// Search filter state
export interface SearchFilter {
  field: string;
  values: string[];
  type: "match" | "term" | "range";
}

// Pagination state
export interface PaginationState {
  current: number;
  resultsPerPage: number;
  totalResults: number;
  totalPages: number;
}

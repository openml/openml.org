/**
 * Elasticsearch response types for OpenML search
 */

/**
 * Generic Elasticsearch hit structure
 */
export interface ElasticsearchHit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: T;
}

/**
 * Elasticsearch response structure
 */
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
  aggregations?: Record<string, any>;
}

/**
 * Elasticsearch query parameters
 */
export interface ElasticsearchQuery {
  index: string;
  body: {
    query: any;
    size?: number;
    from?: number;
    sort?: any[];
    aggs?: Record<string, any>;
  };
}

/**
 * Search facet (filter) structure
 */
export interface SearchFacet {
  field: string;
  label: string;
  type: "value" | "range";
  values?: Array<{
    value: string;
    count: number;
  }>;
}

/**
 * Search filter state
 */
export interface SearchFilter {
  field: string;
  values: string[];
  type: "match" | "term" | "range";
}

/**
 * Pagination state
 */
export interface PaginationState {
  current: number;
  resultsPerPage: number;
  totalResults: number;
  totalPages: number;
}

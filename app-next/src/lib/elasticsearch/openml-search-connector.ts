/**
 * OpenML Elasticsearch Search Connector
 *
 * Custom connector for direct Elasticsearch queries without using
 * the problematic @elastic/search-ui-elasticsearch-connector package.
 *
 * Ported from /app/src/services/OpenMLSearchConnector.js with TypeScript types.
 */

type EntityType = "data" | "task" | "flow" | "run";

// Custom type definitions (these types aren't exported from @elastic/react-search-ui)
interface SearchRequest {
  searchTerm?: string;
  filters?: Record<string, Filter[]>;
  current?: number;
  resultsPerPage?: number;
  sortList?: Array<{ field: string; direction: "asc" | "desc" }>;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

interface SearchResponse {
  results: any[];
  totalResults: number;
  facets: Record<string, FacetValue[]>;
  requestId: string;
}

interface QueryConfig {
  search_fields?: Record<string, { weight?: number }>;
  facets?: Record<string, any>;
  result_fields?: Record<string, any>;
}

interface Filter {
  type?: "any" | "all";
  value?: any;
  from?: number;
  to?: number;
}

interface FacetValue {
  type: "value";
  data: Array<{ value: any; count: number }>;
}

interface ElasticsearchQuery {
  query: {
    bool: {
      must: any[];
      filter: any[];
    };
  };
  from: number;
  size: number;
  aggs?: Record<string, any>;
  sort?: Array<Record<string, { order: "asc" | "desc" }>>;
}

interface ElasticsearchHit {
  _id: string;
  _score: number;
  _source: Record<string, any>;
}

interface ElasticsearchResponse {
  hits: {
    total: { value: number } | number;
    hits: ElasticsearchHit[];
  };
  aggregations?: Record<string, any>;
}

/**
 * OpenML Search Connector className
 */
export class OpenMLSearchConnector {
  private baseUrl: string;
  private indexName: EntityType;

  constructor(indexName: EntityType) {
    this.baseUrl =
      process.env.NEXT_PUBLIC_ELASTICSEARCH_SERVER ||
      "https://www.openml.org/es/";
    this.indexName = indexName;
  }

  /**
   * Build Elasticsearch query from Search UI request state
   */
  private buildQuery(
    requestState: SearchRequest,
    queryConfig: QueryConfig,
  ): ElasticsearchQuery {
    const {
      searchTerm,
      filters,
      current = 1,
      resultsPerPage = 100,
      sortList,
      sortField,
      sortDirection,
    } = requestState;

    const query: ElasticsearchQuery["query"] = {
      bool: {
        must: [],
        filter: [],
      },
    };

    // Add search term with weighted fields
    if (searchTerm) {
      const searchFields = queryConfig.search_fields || {};
      const weightedFields = Object.entries(searchFields).map(
        ([field, config]: [string, any]) => `${field}^${config.weight || 1}`,
      );

      query.bool.must.push({
        multi_match: {
          query: searchTerm,
          fields: weightedFields,
        },
      });
    } else {
      // Match all if no search term
      query.bool.must.push({ match_all: {} });
    }

    // Add filters
    if (filters) {
      Object.entries(filters).forEach(([fieldName, filterValues]) => {
        (filterValues as Filter[]).forEach((filterValue) => {
          if (filterValue.type === "any" || filterValue.type === "all") {
            // Term filter for exact matches
            query.bool.filter.push({
              term: { [fieldName]: filterValue.value },
            });
          } else if ("from" in filterValue || "to" in filterValue) {
            // Range filter for numeric fields
            const range: any = {};
            if ("from" in filterValue && filterValue.from !== undefined) {
              range.gte = filterValue.from;
            }
            if ("to" in filterValue && filterValue.to !== undefined) {
              range.lte = filterValue.to;
            }
            query.bool.filter.push({
              range: { [fieldName]: range },
            });
          }
        });
      });
    }

    // Build aggregations for facets
    const aggs: Record<string, any> = {};
    if (queryConfig.facets) {
      Object.entries(queryConfig.facets).forEach(
        ([fieldName, facetConfig]: [string, any]) => {
          if (facetConfig.type === "value") {
            aggs[fieldName] = {
              terms: {
                field: fieldName,
                size: facetConfig.size || 10,
              },
            };
          } else if (facetConfig.type === "range") {
            // Strip 'name' field from ranges - ES doesn't accept it
            const esRanges = facetConfig.ranges.map((range: any) => {
              const { name, ...esRange } = range;
              return esRange;
            });
            aggs[fieldName] = {
              range: {
                field: fieldName,
                ranges: esRanges,
              },
            };
          }
        },
      );
    }

    const from = (current - 1) * resultsPerPage;
    const size = resultsPerPage;

    const esQuery: ElasticsearchQuery = {
      query,
      from,
      size,
      aggs: Object.keys(aggs).length > 0 ? aggs : undefined,
    };

    // Add sorting - Search UI uses sortList array format
    if (sortList && sortList.length > 0) {
      esQuery.sort = sortList.map((sortItem: any) => ({
        [sortItem.field]: { order: sortItem.direction },
      }));
    } else if (sortField && sortDirection) {
      // Fallback for direct sortField/sortDirection
      esQuery.sort = [
        { [sortField]: { order: sortDirection as "asc" | "desc" } },
      ];
    }

    return esQuery;
  }

  /**
   * Format Elasticsearch response to Search UI format
   * Search UI expects fields in { raw: value } format
   */
  private formatResponse(
    esResponse: ElasticsearchResponse,
    requestState: SearchRequest,
  ): SearchResponse {
    const { hits, aggregations } = esResponse;

    const results = hits.hits.map((hit) => {
      const formattedResult: any = {
        id: { raw: hit._id },
        _meta: {
          id: hit._id,
          score: hit._score,
          rawHit: {
            _type: this.indexName,
          },
        },
      };

      // Wrap all source fields in { raw: value } format
      Object.entries(hit._source).forEach(([key, value]) => {
        formattedResult[key] = { raw: value };
      });

      return formattedResult;
    });

    const totalResults =
      typeof hits.total === "number" ? hits.total : hits.total.value;

    const facets: Record<string, FacetValue[]> = {};
    if (aggregations) {
      Object.entries(aggregations).forEach(
        ([fieldName, agg]: [string, any]) => {
          if (agg.buckets) {
            facets[fieldName] = [
              {
                type: "value" as const,
                data: agg.buckets.map((bucket: any) => ({
                  value: bucket.key,
                  count: bucket.doc_count,
                })),
              },
            ];
          }
        },
      );
    }

    return {
      results,
      totalResults,
      facets,
      requestId: Date.now().toString(),
    };
  }

  /**
   * Main search method called by Search UI
   */
  async onSearch(
    requestState: SearchRequest,
    queryConfig: QueryConfig,
  ): Promise<SearchResponse> {
    try {
      const esQuery = this.buildQuery(requestState, queryConfig);

      const url = `${this.baseUrl}${this.indexName}/_search`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(esQuery),
      });

      const data: ElasticsearchResponse = await response.json();

      if (!response.ok) {
        console.error("[OpenMLSearchConnector] ES Error:", data);
        throw new Error(
          `Elasticsearch error: ${response.status} ${response.statusText}`,
        );
      }

      return this.formatResponse(data, requestState);
    } catch (error) {
      console.error("[OpenMLSearchConnector] Search error:", error);
      throw error;
    }
  }

  /**
   * Autocomplete method (optional)
   */
  async onAutocomplete(
    requestState: SearchRequest,
    queryConfig: QueryConfig,
  ): Promise<{ results: any[] }> {
    // Return empty results for now - can be enhanced later
    return { results: [] };
  }

  /**
   * Result click tracking (optional)
   */
  onResultClick(): void {
    // No-op for now
  }

  /**
   * Autocomplete result click tracking (optional)
   */
  onAutocompleteResultClick(): void {
    // No-op for now
  }
}

export default OpenMLSearchConnector;

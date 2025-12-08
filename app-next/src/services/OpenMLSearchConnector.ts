import {
  QueryConfig,
  RequestState,
  ResponseState,
  AutocompleteResponseState,
  AutocompleteQueryConfig,
  APIConnector,
} from "@elastic/search-ui";

interface FilterValue {
  type: "any" | "all";
  value: string;
  from?: number;
  to?: number;
  name?: string;
}

interface FacetConfig {
  type: "value" | "range";
  size?: number;
  ranges?: { from?: number; to?: number; name: string }[];
}

class OpenMLSearchConnector implements APIConnector {
  indexName: string;

  constructor(indexName: string) {
    this.indexName = indexName;
  }

  onResultClick(): void {
    // No-op
  }

  onAutocompleteResultClick(): void {
    // No-op
  }

  /**
   * Build Elasticsearch query from Search UI request state
   */
  buildQuery(requestState: RequestState, queryConfig: QueryConfig) {
    const {
      searchTerm,
      filters,
      current,
      resultsPerPage,
      sortField,
      sortDirection,
      sortList,
    } = requestState;

    const query: any = {
      bool: {
        must: [],
        filter: [],
      },
    };

    // Add search term if provided
    if (searchTerm) {
      query.bool.must.push({
        multi_match: {
          query: searchTerm,
          fields: Object.keys(queryConfig.search_fields || {}).map(
            (field) =>
              `${field}^${queryConfig.search_fields?.[field]?.weight || 1}`,
          ),
        },
      });
    } else {
      // Match all if no search term
      query.bool.must.push({ match_all: {} });
    }

    // Add filters
    if (filters) {
      // Group filters by field for multi-select support
      const filtersByField = new Map<string, any[]>();

      filters.forEach((filter) => {
        filter.values.forEach((filterValue: any) => {
          // Handle range filters (from facets)
          if (
            typeof filterValue === "object" &&
            (filterValue.from !== undefined || filterValue.to !== undefined)
          ) {
            const range: any = {};
            if (filterValue.from !== undefined)
              range.gte = Number(filterValue.from);
            if (filterValue.to !== undefined)
              range.lte = Number(filterValue.to);
            query.bool.filter.push({
              range: { [filter.field]: range },
            });
          }
          // Handle string values that might be range names like "1000.0-9999.0"
          else if (
            typeof filterValue === "string" &&
            filterValue.includes("-")
          ) {
            // This is a range name from facet config - look it up
            const facetConfig = queryConfig.facets?.[filter.field] as any;
            if (facetConfig?.type === "range" && facetConfig.ranges) {
              const rangeConfig = facetConfig.ranges.find(
                (r: any) => r.name === filterValue,
              );
              if (rangeConfig) {
                const range: any = {};
                if (rangeConfig.from !== undefined)
                  range.gte = Number(rangeConfig.from);
                if (rangeConfig.to !== undefined)
                  range.lte = Number(rangeConfig.to);
                query.bool.filter.push({
                  range: { [filter.field]: range },
                });
              }
            }
          }
          // Handle exact term matches - collect for multi-select
          else {
            if (!filtersByField.has(filter.field)) {
              filtersByField.set(filter.field, []);
            }
            filtersByField.get(filter.field)!.push(filterValue);
          }
        });
      });

      // Add term/terms queries for collected values
      filtersByField.forEach((values, field) => {
        if (values.length > 0) {
          if (values.length === 1) {
            // Single value: use term query
            query.bool.filter.push({
              term: { [field]: values[0] },
            });
          } else {
            // Multiple values: use terms query for OR logic
            query.bool.filter.push({
              terms: { [field]: values },
            });
          }
        }
      });
    }

    // Build aggregations for facets
    const aggs: any = {};
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
            // Strip out 'name' field from ranges - ES doesn't accept it
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

    // Sanitize resultsPerPage (handle legacy formats like "n_20_n")
    let size = 10;
    if (resultsPerPage) {
      if (typeof resultsPerPage === "number") {
        size = resultsPerPage;
      } else if (typeof resultsPerPage === "string") {
        // Try to extract number from string (e.g. "n_20_n" -> 20)
        const match = (resultsPerPage as string).match(/\d+/);
        if (match) {
          size = parseInt(match[0], 10);
        }
      }
    }

    // Ensure valid pagination
    const validCurrent = current && current > 0 ? current : 1;
    const from = (validCurrent - 1) * size;

    // Elasticsearch has a max_result_window limit (default 10,000)
    // If exceeds limit, cap to last accessible page to prevent error
    const MAX_RESULT_WINDOW = 10000;
    const actualFrom =
      from + size > MAX_RESULT_WINDOW
        ? Math.max(0, MAX_RESULT_WINDOW - size)
        : from;

    const esQuery: any = {
      query,
      from: actualFrom,
      size,
      aggs,
    };

    // Add sorting - Search UI uses sortList array format
    if (sortList && sortList.length > 0) {
      esQuery.sort = sortList.map((sortItem) => ({
        [sortItem.field]: { order: sortItem.direction },
      }));
    } else if (sortField && sortDirection) {
      // Fallback for direct sortField/sortDirection
      esQuery.sort = [{ [sortField]: { order: sortDirection } }];
    }

    return esQuery;
  }

  /**
   * Format Elasticsearch response to Search UI format
   * Search UI expects fields in { raw: value } format
   */
  formatResponse(esResponse: any, requestState: RequestState): ResponseState {
    const { hits, aggregations } = esResponse;

    const results = hits.hits.map((hit: any) => {
      const formattedResult: any = {
        id: { raw: hit._id },
        _meta: {
          id: hit._id,
          score: hit._score,
          rawHit: {
            _type: this.indexName, // Add the index name as the type
          },
        },
      };

      // Wrap all source fields in { raw: value } format
      Object.entries(hit._source).forEach(([key, value]) => {
        formattedResult[key] = { raw: value };
      });

      return formattedResult;
    });

    const totalResults = hits.total.value || hits.total;

    const facets: any = {};
    if (aggregations) {
      Object.entries(aggregations).forEach(
        ([fieldName, agg]: [string, any]) => {
          if (agg.buckets) {
            facets[fieldName] = [
              {
                type: "value",
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
      totalPages: Math.ceil(totalResults / (requestState.resultsPerPage || 10)),
      pagingStart:
        ((requestState.current || 1) - 1) *
          (requestState.resultsPerPage || 10) +
        1,
      pagingEnd: Math.min(
        (requestState.current || 1) * (requestState.resultsPerPage || 10),
        totalResults,
      ),
      wasSearched: true,
      resultSearchTerm: requestState.searchTerm || "",
      rawResponse: esResponse,
    };
  }

  /**
   * Main search method called by Search UI
   */
  async onSearch(
    requestState: RequestState,
    queryConfig: QueryConfig,
  ): Promise<ResponseState> {
    // console.log("[OpenMLSearchConnector] onSearch Request:", requestState);
    try {
      const esQuery = this.buildQuery(requestState, queryConfig);

      // Use local proxy to avoid CORS
      const url = "/api/es-proxy";
      // console.log("[OpenMLSearchConnector] Fetching via proxy:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          indexName: this.indexName,
          esQuery: esQuery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `ES responded with ${response.status}: ${response.statusText}. Error: ${JSON.stringify(
            data,
          )}`,
        );
      }

      return this.formatResponse(data, requestState);
    } catch (error) {
      console.error("[OpenMLSearchConnector] Error:", error);
      throw error;
    }
  }
  /**
   * Autocomplete method (optional, called by Search UI for suggestions)
   */
  async onAutocomplete(
    requestState: RequestState,
    _queryConfig: AutocompleteQueryConfig,
  ): Promise<AutocompleteResponseState> {
    return {
      autocompletedResults: [],
      autocompletedSuggestions: {},
      autocompletedResultsRequestId: "",
      autocompletedSuggestionsRequestId: "",
    };
  }
}

export default OpenMLSearchConnector;

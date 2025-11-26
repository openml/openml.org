import {
  QueryConfig,
  RequestState,
  ResponseState,
  AutocompleteResponseState,
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
  baseUrl: string;
  indexName: string;

  constructor(indexName: string) {
    this.baseUrl = "https://www.openml.org/es/";
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
      filters.forEach((filter) => {
        filter.values.forEach((filterValue: any) => {
          if (filter.type === "any") {
            // Term filter for exact matches
            query.bool.filter.push({
              term: { [filter.field]: filterValue },
            });
          } else if (filter.type === "all") {
            // Must match all values
            query.bool.filter.push({
              term: { [filter.field]: filterValue },
            });
          } else if (filterValue.from || filterValue.to) {
            // Range filter for numeric fields
            const range: any = {};
            if (filterValue.from !== undefined) range.gte = filterValue.from;
            if (filterValue.to !== undefined) range.lte = filterValue.to;
            query.bool.filter.push({
              range: { [filter.field]: range },
            });
          }
        });
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

    const esQuery: any = {
      query,
      from,
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
    console.log("[OpenMLSearchConnector] onSearch Request:", requestState);
    try {
      const esQuery = this.buildQuery(requestState, queryConfig);
      console.log(
        "[OpenMLSearchConnector] Built ES Query:",
        JSON.stringify(esQuery, null, 2),
      );

      // Use local proxy to avoid CORS
      const url = "/api/es-proxy";
      console.log("[OpenMLSearchConnector] Fetching via proxy:", url);

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

      console.log(
        "[OpenMLSearchConnector] ES Response Hits:",
        data.hits?.total,
      );

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
    queryConfig: any, // Relaxed type to match base className expectation or ignore mismatch
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

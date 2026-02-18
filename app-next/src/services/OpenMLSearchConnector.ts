import {
  QueryConfig,
  RequestState,
  ResponseState,
  AutocompleteResponseState,
  AutocompleteQueryConfig,
  APIConnector,
  FilterValue as SearchUIFilterValue,
} from "@elastic/search-ui";

import type {
  ElasticsearchQueryBody,
  ElasticsearchResponse,
} from "@/types/elasticsearch";

interface FacetConfig {
  type: "value" | "range";
  size?: number;
  ranges?: { from?: number; to?: number; name: string }[];
}

interface ElasticsearchAggregation {
  buckets?: Array<{
    key: string;
    doc_count: number;
  }>;
}

type SourceDocument = Record<string, unknown>;

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

  // Build Elasticsearch query from Search UI request state
  private buildQuery(
    requestState: RequestState,
    queryConfig: QueryConfig,
  ): ElasticsearchQueryBody {
    const {
      searchTerm,
      filters,
      current,
      resultsPerPage,
      sortField,
      sortDirection,
      sortList,
    } = requestState;

    const query: ElasticsearchQueryBody["query"] = {
      bool: {
        must: [],
        filter: [],
      },
    };

    // Add search term if provided
    if (searchTerm) {
      const searchFields = Object.keys(queryConfig.search_fields || {});

      // Detect numeric ID search for datasets, tasks, flows, runs
      const isNumericId = /^\d+$/.test(searchTerm.trim());
      const idField =
        this.indexName === "data"
          ? "data_id"
          : this.indexName === "task"
            ? "task_id"
            : this.indexName === "flow"
              ? "flow_id"
              : this.indexName === "run"
                ? "run_id"
                : null;

      if (searchFields.length === 0) {
        query.bool?.must?.push({ match_all: {} });
      } else {
        const shouldClauses: unknown[] = [
          // Exact phrase match (highest priority)
          {
            multi_match: {
              query: searchTerm,
              fields: searchFields.map(
                (f) =>
                  `${f}^${(queryConfig.search_fields?.[f]?.weight || 1) * 3}`,
              ),
              type: "phrase",
            },
          },
          // Phrase prefix match (for partial word completion)
          {
            multi_match: {
              query: searchTerm,
              fields: searchFields.map(
                (f) =>
                  `${f}^${(queryConfig.search_fields?.[f]?.weight || 1) * 2}`,
              ),
              type: "phrase_prefix",
            },
          },
          // Exact term match
          {
            multi_match: {
              query: searchTerm,
              fields: searchFields.map(
                (f) => `${f}^${queryConfig.search_fields?.[f]?.weight || 1}`,
              ),
              type: "best_fields",
              operator: "and",
            },
          },
        ];

        // Add exact ID match if searching for a number
        if (isNumericId && idField) {
          shouldClauses.unshift({
            term: {
              [idField]: {
                value: parseInt(searchTerm.trim(), 10),
                boost: 100, // Highest boost for exact ID match
              },
            },
          });
        }

        query.bool?.must?.push({
          bool: {
            should: shouldClauses,
            minimum_should_match: 1,
          },
        });
      }
    } else {
      query.bool?.must?.push({ match_all: {} });
    }

    // Add filters
    if (filters && filters.length > 0) {
      const filtersByField = new Map<string, unknown[]>();

      filters.forEach((filter) => {
        filter.values.forEach((filterValue: SearchUIFilterValue) => {
          // Range filter (from facet sliders)
          if (
            typeof filterValue === "object" &&
            !Array.isArray(filterValue) &&
            ("from" in filterValue || "to" in filterValue)
          ) {
            const range: Record<string, number> = {};
            if (
              "from" in filterValue &&
              filterValue.from !== undefined &&
              typeof filterValue.from === "number"
            )
              range.gte = filterValue.from;
            if (
              "to" in filterValue &&
              filterValue.to !== undefined &&
              typeof filterValue.to === "number"
            )
              range.lte = filterValue.to;

            query.bool?.filter?.push({
              range: { [filter.field]: range },
            });
          }
          // Predefined range bucket selected by name (e.g., "0-1000")
          else if (
            typeof filterValue === "string" &&
            filterValue.includes("-")
          ) {
            const facetConfig = queryConfig.facets?.[filter.field] as
              | FacetConfig
              | undefined;
            if (facetConfig?.type === "range" && facetConfig.ranges) {
              const rangeConfig = facetConfig.ranges.find(
                (r) => r.name === filterValue,
              );
              if (rangeConfig) {
                const range: Record<string, number> = {};
                if (rangeConfig.from !== undefined)
                  range.gte = rangeConfig.from;
                if (rangeConfig.to !== undefined) range.lte = rangeConfig.to;
                query.bool?.filter?.push({
                  range: { [filter.field]: range },
                });
              }
            }
          }
          // Regular value filter (term/terms)
          else {
            if (!filtersByField.has(filter.field)) {
              filtersByField.set(filter.field, []);
            }
            filtersByField.get(filter.field)!.push(filterValue);
          }
        });
      });

      // Add term/terms queries
      filtersByField.forEach((values, field) => {
        if (values.length === 1) {
          query.bool?.filter?.push({ term: { [field]: values[0] } });
        } else if (values.length > 1) {
          query.bool?.filter?.push({ terms: { [field]: values } });
        }
      });
    }

    // Build aggregations for facets
    const aggs: Record<
      string,
      {
        terms?: { field: string; size: number };
        range?: {
          field: string;
          ranges: Array<{ from?: number; to?: number }>;
        };
      }
    > = {};
    if (queryConfig.facets) {
      Object.entries(queryConfig.facets).forEach(([fieldName, facetConfig]) => {
        const typedConfig = facetConfig as FacetConfig;
        if (typedConfig.type === "value") {
          aggs[fieldName] = {
            terms: {
              field: fieldName,
              size: typedConfig.size || 10,
            },
          };
        } else if (typedConfig.type === "range") {
          // Strip out 'name' field from ranges - ES doesn't accept it
          const esRanges =
            typedConfig.ranges?.map((range) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { name, ...esRange } = range;
              return esRange;
            }) || [];
          aggs[fieldName] = {
            range: {
              field: fieldName,
              ranges: esRanges,
            },
          };
        }
      });
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

    const esQuery: ElasticsearchQueryBody = {
      query,
      from: actualFrom,
      size,
      aggs,
    };

    // Add sorting - Search UI uses sortList array format
    if (sortList && sortList.length > 0) {
      esQuery.sort = sortList.map((sortItem) => ({
        [sortItem.field]: sortItem.direction as "asc" | "desc",
      }));
    } else if (sortField && sortDirection) {
      // Fallback for direct sortField/sortDirection
      esQuery.sort = [{ [sortField]: sortDirection as "asc" | "desc" }];
    }

    return esQuery;
  }

  /**
   * Format Elasticsearch response to Search UI format
   * Search UI expects fields in { raw: value } format
   */
  formatResponse(
    esResponse: ElasticsearchResponse<SourceDocument>,
    requestState: RequestState,
  ): ResponseState {
    const { hits, aggregations } = esResponse;

    const results = hits.hits.map((hit) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedResult: Record<string, any> = {
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
      // Flatten nested objects with dot-notation keys (e.g., qualities.NumberOfInstances)
      const flattenSource = (
        obj: Record<string, unknown>,
        prefix = "",
      ) => {
        Object.entries(obj).forEach(([key, value]) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            // Also store the parent object as-is for components that use nested access
            formattedResult[fullKey] = { raw: value };
            flattenSource(value as Record<string, unknown>, fullKey);
          } else {
            formattedResult[fullKey] = { raw: value };
          }
        });
      };
      flattenSource(hit._source);

      return formattedResult;
    });

    const totalResults =
      typeof hits.total === "number" ? hits.total : hits.total.value;

    const facets: Record<
      string,
      Array<{ type: string; data: Array<{ value: string; count: number }> }>
    > = {};
    if (aggregations) {
      Object.entries(aggregations).forEach(([fieldName, agg]) => {
        const typedAgg = agg as ElasticsearchAggregation;
        if (typedAgg.buckets) {
          facets[fieldName] = [
            {
              type: "value",
              data: typedAgg.buckets.map((bucket) => ({
                value: bucket.key,
                count: bucket.doc_count,
              })),
            },
          ];
        }
      });
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

      // Use new unified search API
      const url = "/api/search";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestState: RequestState,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryConfig: AutocompleteQueryConfig,
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

/**
 * Custom Elasticsearch connector for OpenML
 * Directly queries Elasticsearch without using the problematic @elastic/search-ui-elasticsearch-connector
 */
class OpenMLSearchConnector {
  constructor(indexName) {
    this.baseUrl = "https://www.openml.org/es/";
    this.indexName = indexName;
  }

  /**
   * Build Elasticsearch query from Search UI request state
   */
  buildQuery(requestState, queryConfig) {
    const {
      searchTerm,
      filters,
      current,
      resultsPerPage,
      sortField,
      sortDirection,
      sortList,
    } = requestState;

    console.log("[OpenMLSearchConnector] buildQuery - Sort info:", {
      sortField,
      sortDirection,
      sortList,
      fullRequestState: requestState,
    });

    const query = {
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
              `${field}^${queryConfig.search_fields[field].weight || 1}`,
          ),
        },
      });
    } else {
      // Match all if no search term
      query.bool.must.push({ match_all: {} });
    }

    // Add filters
    if (filters) {
      Object.entries(filters).forEach(([fieldName, filterValues]) => {
        filterValues.forEach((filterValue) => {
          if (filterValue.type === "any") {
            // Term filter for exact matches
            query.bool.filter.push({
              term: { [fieldName]: filterValue.value },
            });
          } else if (filterValue.type === "all") {
            // Must match all values
            query.bool.filter.push({
              term: { [fieldName]: filterValue.value },
            });
          } else if (filterValue.from || filterValue.to) {
            // Range filter for numeric fields
            const range = {};
            if (filterValue.from) range.gte = filterValue.from;
            if (filterValue.to) range.lte = filterValue.to;
            query.bool.filter.push({
              range: { [fieldName]: range },
            });
          }
        });
      });
    }

    // Build aggregations for facets
    const aggs = {};
    if (queryConfig.facets) {
      Object.entries(queryConfig.facets).forEach(([fieldName, facetConfig]) => {
        if (facetConfig.type === "value") {
          aggs[fieldName] = {
            terms: {
              field: fieldName,
              size: facetConfig.size || 10,
            },
          };
        } else if (facetConfig.type === "range") {
          // Strip out 'name' field from ranges - ES doesn't accept it
          const esRanges = facetConfig.ranges.map((range) => {
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
      });
    }

    const from = (current - 1) * resultsPerPage;
    const size = resultsPerPage;

    const esQuery = {
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
  formatResponse(esResponse, requestState) {
    const { hits, aggregations } = esResponse;

    const results = hits.hits.map((hit) => {
      const formattedResult = {
        id: { raw: hit._id },
        _meta: {
          id: hit._id,
          score: hit._score,
        },
      };

      // Wrap all source fields in { raw: value } format
      Object.entries(hit._source).forEach(([key, value]) => {
        formattedResult[key] = { raw: value };
      });

      return formattedResult;
    });

    const totalResults = hits.total.value || hits.total;

    const facets = {};
    if (aggregations) {
      Object.entries(aggregations).forEach(([fieldName, agg]) => {
        if (agg.buckets) {
          facets[fieldName] = [
            {
              type: "value",
              data: agg.buckets.map((bucket) => ({
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
    };
  }

  /**
   * Main search method called by Search UI
   */
  async onSearch(requestState, queryConfig) {
    console.log("[OpenMLSearchConnector] onSearch called", {
      requestState,
      queryConfig,
    });

    try {
      const esQuery = this.buildQuery(requestState, queryConfig);
      console.log(
        "[OpenMLSearchConnector] ES Query:",
        JSON.stringify(esQuery, null, 2),
      );

      const url = `${this.baseUrl}${this.indexName}/_search`;
      console.log("[OpenMLSearchConnector] Fetching:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(esQuery),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[OpenMLSearchConnector] ES Error Response:", data);
        throw new Error(
          `ES responded with ${response.status}: ${response.statusText}. Error: ${JSON.stringify(data)}`,
        );
      }
      console.log("[OpenMLSearchConnector] ES Response:", {
        totalHits: data.hits?.total,
        resultsCount: data.hits?.hits?.length,
      });

      const formattedResponse = this.formatResponse(data, requestState);
      console.log("[OpenMLSearchConnector] Formatted response:", {
        totalResults: formattedResponse.totalResults,
        resultsCount: formattedResponse.results.length,
        facetCount: Object.keys(formattedResponse.facets).length,
      });

      return formattedResponse;
    } catch (error) {
      console.error("[OpenMLSearchConnector] Error:", error);
      throw error;
    }
  }

  /**
   * Autocomplete method (optional, called by Search UI for suggestions)
   */
  async onAutocomplete(requestState, queryConfig) {
    console.log("[OpenMLSearchConnector] onAutocomplete called", {
      requestState,
    });
    // Return empty results for now
    return {
      results: [],
    };
  }

  /**
   * Result click tracking (optional)
   */
  onResultClick() {
    // No-op for now
  }

  /**
   * Autocomplete result click tracking (optional)
   */
  onAutocompleteResultClick() {
    // No-op for now
  }
}

export default OpenMLSearchConnector;

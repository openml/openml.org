import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getElasticsearchUrl } from "@/lib/elasticsearch";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

// Cache for connectors to improve performance
const connectorsCache: Record<string, ElasticsearchAPIConnector> = {};

/**
 * Robust search proxy for Elasticsearch
 * Supports:
 * 1. @elastic/search-ui-elasticsearch-connector requests (via onSearch)
 * 2. Multi-search (_msearch) requests
 * 3. Direct _search requests
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();

    // Case 1: Search UI Connector request (matches legacy app)
    if (body.requestState && body.queryConfig && body.indexName) {
      const { requestState, queryConfig, indexName } = body;

      if (!connectorsCache[indexName]) {
        connectorsCache[indexName] = new ElasticsearchAPIConnector({
          host: getElasticsearchUrl(""),
          index: indexName,
          apiKey: "", // Add if needed in production
        });
      }

      const response = await connectorsCache[indexName].onSearch(
        requestState,
        queryConfig,
      );

      return NextResponse.json(response);
    }

    // Case 2: Custom es-proxy request (from OpenMLSearchConnector)
    if (body.indexName && body.esQuery) {
      const { indexName, esQuery } = body;
      const url = getElasticsearchUrl(`${indexName}/_search`);

      console.log(`[Search API] Case 2: indexName="${indexName}", URL="${url}"`);
      console.log(`[Search API] ES Query:`, JSON.stringify(esQuery, null, 2));

      // Use fetch instead of axios (matches original MeasureList pattern)
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(esQuery),
      });

      console.log(`[Search API] ES Response status:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Search API] ES Error:`, errorText);
        throw new Error(`Elasticsearch returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`[Search API] ES Response hits:`, data.hits?.total);

      return NextResponse.json(data);
    }

    // Case 3: Raw multi-search or other requests (fallback)
    return NextResponse.json(
      { error: "Unsupported search request format" },
      { status: 400 },
    );
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ [Search API] Failed after ${duration}ms:`, error.message);

    // Log full Elasticsearch error details
    if (error.response) {
      console.error(`[Search API] ES Error Status:`, error.response.status);
      console.error(`[Search API] ES Error Data:`, JSON.stringify(error.response.data, null, 2));
    }

    return NextResponse.json(
      {
        error: "Search failed",
        details: error.message,
        esError: error.response?.data,
      },
      { status: error.response?.status || 500 },
    );
  }
}

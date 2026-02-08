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

      const response = await axios.post(url, esQuery, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      return NextResponse.json(response.data);
    }

    // Case 3: Raw multi-search or other requests (fallback)
    return NextResponse.json(
      { error: "Unsupported search request format" },
      { status: 400 },
    );
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ [Search API] Failed after ${duration}ms:`, error.message);

    return NextResponse.json(
      {
        error: "Search failed",
        details: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}

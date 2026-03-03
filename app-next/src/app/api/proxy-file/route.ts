import { NextRequest, NextResponse } from "next/server";

// Only allow fetching from openml.org domains for security
const ALLOWED_DOMAINS = [
  "openml.org",
  "www.openml.org",
  "api.openml.org",
  "data.openml.org",
];

function isAllowedUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_DOMAINS.some((domain) =>
      parsedUrl.hostname.endsWith(domain),
    );
  } catch {
    return false;
  }
}

/**
 * Proxy route for fetching external files from OpenML servers.
 * Bypasses CORS restrictions for dataset files (parquet, ARFF, predictions).
 * Supports both text and binary responses.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json(
      { error: "URL domain not allowed" },
      { status: 403 },
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "OpenML-NextApp/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: response.status },
      );
    }

    // Determine content type from the upstream response or file extension
    const upstreamContentType =
      response.headers.get("content-type") || "application/octet-stream";
    const isBinary =
      url.endsWith(".pq") ||
      url.endsWith(".parquet") ||
      upstreamContentType.includes("octet-stream") ||
      upstreamContentType.includes("parquet");

    if (isBinary) {
      // Binary response (parquet files)
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": buffer.byteLength.toString(),
          "Cache-Control": "public, max-age=86400",
        },
      });
    } else {
      // Text response (ARFF, CSV, predictions)
      const text = await response.text();
      return new NextResponse(text, {
        status: 200,
        headers: {
          "Content-Type": upstreamContentType,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch external resource" },
      { status: 500 },
    );
  }
}

/**
 * HEAD request support for checking file size before downloading
 */
export async function HEAD(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json(
      { error: "URL domain not allowed" },
      { status: 403 },
    );
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "OpenML-NextApp/1.0",
      },
    });

    return new NextResponse(null, {
      status: response.status,
      headers: {
        "Content-Length": response.headers.get("content-length") || "0",
        "Content-Type":
          response.headers.get("content-type") || "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Proxy HEAD error:", error);
    return NextResponse.json(
      { error: "Failed to check external resource" },
      { status: 500 },
    );
  }
}

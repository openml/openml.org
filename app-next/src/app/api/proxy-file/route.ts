import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for fetching external files (e.g., OpenML predictions files)
 * This avoids CORS issues when fetching from openml.org directly
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  // Only allow fetching from openml.org for security
  const allowedDomains = ["openml.org", "www.openml.org", "api.openml.org"];
  try {
    const parsedUrl = new URL(url);
    if (!allowedDomains.some((domain) => parsedUrl.hostname.endsWith(domain))) {
      return NextResponse.json(
        { error: "URL domain not allowed" },
        { status: 403 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
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

    const text = await response.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch external resource" },
      { status: 500 },
    );
  }
}

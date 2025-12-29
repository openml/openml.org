import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: GET /api/user/api-key
 * Proxies request to Flask backend to get user's OpenML API key
 * This avoids CORS issues when calling from client-side
 *
 * NOTE: This endpoint requires the Flask backend to be running locally.
 * The production openml.org doesn't expose the /api-key endpoint.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 },
      );
    }

    // Try local Flask backend first (for development)
    const localApiUrl = "http://localhost:8000";
    const prodApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

    // Try local first, then production
    const urlsToTry = [localApiUrl, prodApiUrl];

    for (const apiUrl of urlsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        console.log(`[api-key] Trying ${apiUrl}/api-key`);

        const response = await fetch(`${apiUrl}/api-key`, {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(`[api-key] Response from ${apiUrl}: ${response.status}`);

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log(
              `[api-key] Got data:`,
              data.apikey ? "has apikey" : "no apikey",
            );
            if (data.apikey) {
              return NextResponse.json(data);
            }
          }
        } else {
          // Log the error response
          const text = await response.text();
          console.log(
            `[api-key] Error response from ${apiUrl}:`,
            text.substring(0, 200),
          );
        }
      } catch (fetchError) {
        // Continue to next URL
        console.log(`[api-key] Fetch failed for ${apiUrl}:`, fetchError);
      }
    }

    // If we get here, neither backend worked
    return NextResponse.json(
      {
        error: "API key endpoint not available",
        hint: "The Flask backend needs to be running locally for likes to work",
      },
      { status: 503 },
    );
  } catch (error) {
    console.error("Error proxying API key request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

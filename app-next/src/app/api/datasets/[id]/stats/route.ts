import { NextRequest, NextResponse } from "next/server";

const FLASK_BACKEND_URL =
  process.env.FLASK_BACKEND_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: datasetId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const maxPreviewRows = searchParams.get("max_preview_rows") || "100";
  const forceRefresh = searchParams.get("force_refresh") || "false";

  try {
    const flaskUrl = `${FLASK_BACKEND_URL}/api/v1/datasets/${datasetId}/stats?max_preview_rows=${maxPreviewRows}&force_refresh=${forceRefresh}`;

    console.log(`[Stats API] Fetching from: ${flaskUrl}`);

    const response = await fetch(flaskUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");

      // If Flask returned XML error (OpenML production server)
      if (contentType?.includes("xml")) {
        console.error(`[Stats API] Flask not available at ${FLASK_BACKEND_URL}. Is Flask running locally?`);
        return NextResponse.json(
          {
            error: `Stats API not available. Flask may not be running at ${FLASK_BACKEND_URL}. Start Flask with: cd server && python app.py`,
          },
          { status: 503 }
        );
      }

      const errorText = await response.text();
      console.error(`[Stats API] Flask error:`, errorText);
      return NextResponse.json(
        { error: `Flask error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[Stats API] Success for dataset ${datasetId}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Stats API] Failed to fetch stats from Flask:", error);

    // Network error - Flask likely not running
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: `Cannot connect to Flask at ${FLASK_BACKEND_URL}. Is Flask running? Start with: cd server && python app.py`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dataset statistics",
      },
      { status: 500 }
    );
  }
}

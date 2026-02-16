import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.OPENML_API_URL || "https://www.openml.org";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "10";

  try {
    const response = await fetch(
      `${API_URL}/api/v1/json/task/list/data_id/${id}/limit/${limit}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

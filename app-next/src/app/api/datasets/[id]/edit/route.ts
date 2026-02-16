import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const OPENML_API =
  process.env.FLASK_BACKEND_URL || "https://www.openml.org";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const apiKey = (session as { apikey?: string }).apikey;
  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key found. Please re-sign in." },
      { status: 401 },
    );
  }

  const body = await request.json();

  // Build form data for OpenML REST API
  const formData = new URLSearchParams();
  formData.append("api_key", apiKey);

  const fields = [
    "description",
    "creator",
    "collection_date",
    "citation",
    "language",
    "original_data_url",
    "paper_url",
  ];

  // Owner-only fields
  if (body.isOwner) {
    fields.push(
      "default_target_attribute",
      "ignore_attribute",
      "row_id_attribute",
    );
  }

  for (const field of fields) {
    if (body[field] !== undefined) {
      // Send empty string as-is (the API will clear the field)
      formData.append(field, body[field] || "");
    }
  }

  try {
    const response = await fetch(
      `${OPENML_API}/api/v1/json/data/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`OpenML API error editing dataset ${id}:`, text);
      return NextResponse.json(
        { error: "Failed to save changes. Please try again." },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error editing dataset ${id}:`, error);
    return NextResponse.json(
      { error: "An error occurred while saving." },
      { status: 500 },
    );
  }
}

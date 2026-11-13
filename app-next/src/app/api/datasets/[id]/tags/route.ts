import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APP_CONFIG } from "@/lib/config";

const OPENML_API =
  process.env.OPENML_API_URL ||
  APP_CONFIG.openmlApiUrl ||
  "https://www.openml.org";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = (session as { apikey?: string }).apikey;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key found." }, { status: 401 });
  }

  const { tag } = await request.json();
  if (!tag) {
    return NextResponse.json({ error: "tag is required" }, { status: 400 });
  }

  const form = new URLSearchParams({ api_key: apiKey, data_id: id, tag });
  const response = await fetch(`${OPENML_API}/api/v1/json/data/tag`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: `Failed to add tag: ${text.slice(0, 200)}` },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = (session as { apikey?: string }).apikey;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key found." }, { status: 401 });
  }

  const { tag } = await request.json();
  if (!tag) {
    return NextResponse.json({ error: "tag is required" }, { status: 400 });
  }

  const form = new URLSearchParams({ api_key: apiKey, data_id: id, tag });
  const response = await fetch(`${OPENML_API}/api/v1/json/data/untag`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: `Failed to remove tag: ${text.slice(0, 200)}` },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendDatasetEditEmail } from "@/lib/mail";
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

  // Build XML for OpenML edit_parameters (required by the API)
  const xmlFields: string[] = [];

  const textFields = [
    "description",
    "creator",
    "collection_date",
    "citation",
    "language",
    "original_data_url",
    "paper_url",
  ];

  // Owner-only fields
  const ownerFields = body.isOwner
    ? ["default_target_attribute", "ignore_attribute", "row_id_attribute"]
    : [];

  for (const field of [...textFields, ...ownerFields]) {
    if (body[field] !== undefined) {
      const value = (body[field] || "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      xmlFields.push(`  <oml:${field}>${value}</oml:${field}>`);
    }
  }

  const editParametersXml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<oml:data_set_description xmlns:oml="http://openml.org/openml">\n` +
    xmlFields.join("\n") +
    `\n</oml:data_set_description>`;

  const formData = new URLSearchParams();
  formData.append("api_key", apiKey);
  formData.append("edit_parameters", editParametersXml);

  try {
    const response = await fetch(`${OPENML_API}/api/v1/json/data/edit/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`OpenML API error editing dataset ${id}:`, text);
      const message =
        response.status === 401 || response.status === 403
          ? "Your API key is not accepted by the OpenML server. If you are using a local test account, dataset editing is not supported — only real OpenML accounts can save changes."
          : response.status === 412
            ? "The OpenML server rejected this edit. You can only edit datasets you own."
            : "Failed to save changes. Please try again.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    // Send email notification upon successful edit
    if (session.user?.email) {
      // We don't always have the name in the body, so we use ID as fallback
      const datasetName = body.name || `Dataset ${id}`;
      await sendDatasetEditEmail(session.user.email, datasetName, id).catch(
        (err) => console.error("Failed to send edit email:", err),
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

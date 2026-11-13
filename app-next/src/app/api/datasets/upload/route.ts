import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendDatasetUploadEmail, sendCreationConfirmationEmail } from "@/lib/mail";

import { APP_CONFIG } from "@/lib/config";

const FLASK_BACKEND_URL =
  process.env.FLASK_BACKEND_URL || "http://localhost:5000";

const OPENML_API =
  process.env.OPENML_API_URL ||
  APP_CONFIG.openmlApiUrl ||
  "https://www.openml.org";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = (session as { apikey?: string }).apikey;
    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key found. Please re-sign in." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name")?.toString() || "";

    if (!file || !name) {
      return NextResponse.json(
        { error: "File and name are required." },
        { status: 400 },
      );
    }

    // Build metadata JSON as Flask expects
    const metadata = {
      dataset_name: name,
      description: formData.get("description")?.toString() || "",
      creator: formData.get("creator")?.toString() || "",
      contributor: formData.get("contributor")?.toString() || "",
      collection_date: formData.get("collection_date")?.toString() || "",
      licence: formData.get("licence")?.toString() || "",
      language: formData.get("language")?.toString() || "",
      def_tar_att: formData.get("default_target_attribute")?.toString() || "",
      ignore_attribute: formData.get("ignore_attribute")?.toString() || "",
      citation: formData.get("citation")?.toString() || "",
    };

    const flaskForm = new FormData();
    flaskForm.append("api_key", apiKey);
    flaskForm.append("dataset", file, file.name);
    flaskForm.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      "metadata.json",
    );

    const response = await fetch(`${FLASK_BACKEND_URL}/data-upload`, {
      method: "POST",
      body: flaskForm,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Flask upload error:", text);
      let errorMessage = "Upload failed. Please try again.";
      try {
        const errorJson = JSON.parse(text);
        if (errorJson.msg) errorMessage = errorJson.msg;
        else if (errorJson.error) errorMessage = errorJson.error;
      } catch {
        // text is not JSON — use as-is if it's short enough
        if (text && text.length < 300) errorMessage = text;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const result = await response.json();
    const datasetId: string = result.id ?? "new";

    // Apply tags if provided and we have a real dataset ID
    const tagsRaw = formData.get("tags")?.toString() || "";
    if (tagsRaw && datasetId !== "new") {
      const tagList = tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      for (const tag of tagList) {
        const tagForm = new URLSearchParams({ api_key: apiKey, data_id: datasetId, tag });
        fetch(`${OPENML_API}/api/v1/json/data/tag`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: tagForm.toString(),
        }).catch((err) => console.error(`Failed to apply tag "${tag}":`, err));
      }
    }

    if (session.user.email) {
      sendDatasetUploadEmail(
        session.user.name || session.user.email,
        name,
        datasetId,
      ).catch((err: unknown) =>
        console.error("Failed to send admin upload email:", err),
      );
      sendCreationConfirmationEmail(
        session.user.email,
        "dataset",
        name,
        datasetId,
      ).catch((err: unknown) =>
        console.error("Failed to send uploader confirmation email:", err),
      );
    }

    return NextResponse.json({ success: true, id: datasetId });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload dataset." },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendCreationConfirmationEmail } from "@/lib/mail";

const OPENML_API =
  process.env.OPENML_API_URL ||
  process.env.NEXT_PUBLIC_OPENML_API_URL ||
  "https://www.openml.org";

function buildStudyXml(fields: {
  name: string;
  description?: string;
  mainEntityType: "task" | "run";
  taskIds?: number[];
  runIds?: number[];
}): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // OpenML uses `alias` as the human-readable name; must be URL-safe
  const alias = fields.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const taskSection = fields.taskIds?.length
    ? `  <oml:tasks>\n` +
      fields.taskIds.map((id) => `    <oml:task_id>${id}</oml:task_id>\n`).join("") +
      `  </oml:tasks>\n`
    : "";

  const runSection = fields.runIds?.length
    ? `  <oml:runs>\n` +
      fields.runIds.map((id) => `    <oml:run_id>${id}</oml:run_id>\n`).join("") +
      `  </oml:runs>\n`
    : "";

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<oml:study xmlns:oml="http://openml.org/openml">\n` +
    `  <oml:alias>${esc(alias)}</oml:alias>\n` +
    `  <oml:main_entity_type>${fields.mainEntityType}</oml:main_entity_type>\n` +
    `  <oml:name>${esc(fields.name)}</oml:name>\n` +
    (fields.description
      ? `  <oml:description>${esc(fields.description)}</oml:description>\n`
      : "") +
    taskSection +
    runSection +
    `</oml:study>`
  );
}

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

    const body = await request.json();
    const { collectionname, description, taskids, runids, collectiontype } = body;

    if (!collectionname || (!taskids && !runids)) {
      return NextResponse.json(
        { error: "collectionname and at least one task or run ID are required." },
        { status: 400 },
      );
    }

    const parseIds = (raw: string | undefined) =>
      raw
        ? String(raw).split(/[\s,]+/).map((s) => parseInt(s.trim())).filter((n) => !isNaN(n))
        : [];

    const taskIdList = parseIds(taskids);
    const runIdList = parseIds(runids);

    if (taskIdList.length === 0 && runIdList.length === 0) {
      return NextResponse.json(
        { error: "No valid task or run IDs provided." },
        { status: 400 },
      );
    }

    const xml = buildStudyXml({
      name: collectionname,
      description: description || undefined,
      mainEntityType: collectiontype === "runs" ? "run" : "task",
      taskIds: taskIdList.length ? taskIdList : undefined,
      runIds: runIdList.length ? runIdList : undefined,
    });

    const openmlForm = new FormData();
    openmlForm.append("api_key", apiKey);
    openmlForm.append(
      "description",
      new Blob([xml], { type: "text/xml" }),
      "description.xml",
    );

    const response = await fetch(`${OPENML_API}/api/v1/study`, {
      method: "POST",
      body: openmlForm,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenML study create error:", text);
      let message = "Failed to create collection. Please try again.";
      if (response.status === 401 || response.status === 403) {
        message = "Your API key was rejected.";
      } else {
        const msgMatch = text.match(/<oml:message>([^<]+)<\/oml:message>/);
        const infoMatch = text.match(/<oml:additional_information>([^<]+)<\/oml:additional_information>/);
        if (msgMatch) message = msgMatch[1].trim();
        if (infoMatch) message += ` — ${infoMatch[1].trim()}`;
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const text = await response.text();
    const idMatch = text.match(/<oml:id>(\d+)<\/oml:id>/);
    const studyId: string = idMatch ? idMatch[1] : "new";

    if (session.user.email) {
      sendCreationConfirmationEmail(
        session.user.email,
        "collection",
        collectionname,
        studyId,
      ).catch((err: unknown) =>
        console.error("Failed to send collection creation email:", err),
      );
    }

    return NextResponse.json({ success: true, id: studyId });
  } catch (error) {
    console.error("Collection create error:", error);
    return NextResponse.json(
      { error: "Failed to create collection." },
      { status: 500 },
    );
  }
}

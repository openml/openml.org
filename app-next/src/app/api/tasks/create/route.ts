import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendCreationConfirmationEmail } from "@/lib/mail";

const OPENML_API =
  process.env.OPENML_API_URL ||
  process.env.NEXT_PUBLIC_OPENML_API_URL ||
  "https://www.openml.org";

const TASK_TYPE_IDS: Record<string, number> = {
  classification: 1,
  regression: 2,
  learningcurve: 3,
  clustering: 5,
  supervised: 1,
};

function buildTaskXml(fields: {
  taskTypeId: number;
  datasetId: number;
  targetName?: string;
  estimationProcedure?: string;
  evaluationMeasure?: string;
}): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // <oml:input> is a simpleType in OpenML's XSD — text only, no child elements
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<oml:task_inputs xmlns:oml="http://openml.org/openml">\n` +
    `  <oml:task_type_id>${fields.taskTypeId}</oml:task_type_id>\n` +
    `  <oml:input name="source_data">${fields.datasetId}</oml:input>\n` +
    (fields.targetName
      ? `  <oml:input name="target_feature">${esc(fields.targetName)}</oml:input>\n`
      : "") +
    (fields.estimationProcedure
      ? `  <oml:input name="estimation_procedure">${esc(fields.estimationProcedure)}</oml:input>\n`
      : "") +
    (fields.evaluationMeasure
      ? `  <oml:input name="evaluation_measures">${esc(fields.evaluationMeasure)}</oml:input>\n`
      : "") +
    `</oml:task_inputs>`
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
    const { task_type, dataset_id, target_name, estimation_procedure, evaluation_measure } = body;

    const isClustering = task_type === "clustering";
    if (!task_type || !dataset_id || (!target_name && !isClustering)) {
      return NextResponse.json(
        { error: "task_type and dataset_id are required. target_name is required for non-clustering tasks." },
        { status: 400 },
      );
    }

    const taskTypeId = TASK_TYPE_IDS[task_type] ?? 1;
    const xml = buildTaskXml({
      taskTypeId,
      datasetId: parseInt(dataset_id),
      estimationProcedure: estimation_procedure || undefined,
      targetName: target_name,
      evaluationMeasure: evaluation_measure || undefined,
    });

    const openmlForm = new FormData();
    openmlForm.append("api_key", apiKey);
    openmlForm.append(
      "description",
      new Blob([xml], { type: "text/xml" }),
      "description.xml",
    );

    const response = await fetch(`${OPENML_API}/api/v1/task`, {
      method: "POST",
      body: openmlForm,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenML task create error:", text);
      let message = "Failed to create task. Please try again.";
      if (response.status === 401 || response.status === 403) {
        message = "Your API key was rejected.";
      } else {
        // Parse OpenML XML error: <oml:message> and <oml:additional_information>
        const msgMatch = text.match(/<oml:message>([^<]+)<\/oml:message>/);
        const infoMatch = text.match(/<oml:additional_information>([^<]+)<\/oml:additional_information>/);
        if (msgMatch) message = msgMatch[1].trim();
        if (infoMatch) message += ` — ${infoMatch[1].trim()}`;
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const text = await response.text();
    const idMatch = text.match(/<oml:id>(\d+)<\/oml:id>/);
    const taskId: string = idMatch ? idMatch[1] : "new";
    const taskName = `Task for dataset ${dataset_id} (${task_type})`;

    if (session.user.email) {
      sendCreationConfirmationEmail(
        session.user.email,
        "task",
        taskName,
        taskId,
      ).catch((err: unknown) =>
        console.error("Failed to send task creation email:", err),
      );
    }

    return NextResponse.json({ success: true, id: taskId });
  } catch (error) {
    console.error("Task create error:", error);
    return NextResponse.json(
      { error: "Failed to create task." },
      { status: 500 },
    );
  }
}

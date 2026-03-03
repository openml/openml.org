import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendDatasetUploadEmail } from "@/lib/mail";

// This route handles dataset uploads by forwarding to the OpenML API/Flask proxy
// and sending a notification email upon success.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real implementation this would forward the multipart form data
    // to the Flask backend or OpenML API.
    // Since the frontend is currently using a mock implementation,
    // we acknowledge the request and send the notification email.

    // Proposed implementation for forwarding:
    /*
    const formData = await request.formData();
    const response = await fetch(`${OPENML_API}/data-upload`, {
       method: 'POST',
       body: formData,
       headers: { ... }
    });
    if (!response.ok) throw ...
    const result = await response.json();
    const datasetId = result.id;
    */

    // Validating input (mock)
    const formData = await request.formData().catch(() => null);
    const datasetName = formData?.get("name")?.toString() || "Untitled Dataset";

    // Mock ID for new dataset
    const newDatasetId = "new";

    // Send Admin Notification
    if (session.user.email) {
      await sendDatasetUploadEmail(
        session.user.name || session.user.email,
        datasetName,
        newDatasetId,
      ).catch((err: unknown) =>
        console.error("Failed to send upload email:", err),
      );
    }

    return NextResponse.json({
      success: true,
      id: newDatasetId,
      message: "Dataset uploaded successfully (Mock)",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload dataset" },
      { status: 500 },
    );
  }
}

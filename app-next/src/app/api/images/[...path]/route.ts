import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/**
 * Serve images from dev_data directory
 * This handles paths like /api/images/dev_data/username/file.jpg
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: pathSegments } = await params;
    const imagePath = pathSegments.join("/");

    // Security: Only allow serving from dev_data
    if (!imagePath.startsWith("dev_data/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rootDir = process.cwd();
    const fullPath = path.join(rootDir, imagePath);

    // Security: Prevent directory traversal
    const normalizedPath = path.normalize(fullPath);
    if (!normalizedPath.startsWith(path.join(rootDir, "dev_data"))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Read and serve the file
    const file = await fs.readFile(fullPath);

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image serve error:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

/**
 * Avatar Upload API Route (Blob Temporary)
 * This is a temporary solution for Vercel production until Flask backend implements /image endpoint
 * Vercel Blob Storage with @vercel/blob calls /api/upload-avatar-vercel instead of /api/upload-avatar
 *
 * IMPORTANT: Requires BLOB_READ_WRITE_TOKEN environment variable in production
 * Development: Will fail without token - this is expected behavior
 */
export async function POST(request: Request) {
  try {
    // Check if Vercel Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn(
        "⚠️ BLOB_READ_WRITE_TOKEN not configured - upload will fail in development",
      );
      return NextResponse.json(
        {
          error:
            "Vercel Blob Storage not configured for development. This feature works in production deployment.",
          suggestion:
            "For local development, the backend /image endpoint should be used instead.",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 },
      );
    }

    // Upload to Vercel Blob Storage
    const blob = await put(`avatars/${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      message: "Avatar uploaded successfully to Vercel Blob",
      imagePath: blob.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

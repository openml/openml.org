import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

/**
 * Avatar Upload API Route (Blob Temporary)
 * This is a temporary solution for Vercel production until Flask backend implements /image endpoint
 * Vercel Blob Storage with @vercel/blob calls /api/upload-avatar-vercel instead of /api/upload-avatar
 */
export async function POST(request: Request) {
  try {
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

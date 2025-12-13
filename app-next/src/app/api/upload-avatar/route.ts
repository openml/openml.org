import { NextResponse } from "next/server";

/**
 * Avatar Upload API Route
 * Proxies avatar uploads to the Flask backend on TU Eindhoven servers
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

    // Get JWT token from localStorage (passed in request)
    const token = request.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Forward to Flask backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch(`${backendUrl}/image`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ msg: "Upload failed" }));
      return NextResponse.json(
        { error: errorData.msg || "Upload failed" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Return the image path from backend
    return NextResponse.json({
      success: true,
      message: data.msg || "Avatar uploaded successfully",
      imagePath: data.path, // The path returned by Flask backend
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

/**
 * Avatar Upload API Route
 * - Development: Proxies to Flask backend at localhost:5000
 * - Vercel Production: Returns helpful error until backend implements /image endpoint
 * Alternative: Use /api/upload-avatar-vercel for Vercel Blob Storage
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

    // Get JWT token from request
    const token = request.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Forward to Flask backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
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

        // If we're in production and backend isn't ready, provide helpful message
        if (response.status === 404 || response.status === 401) {
          return NextResponse.json(
            {
              error:
                "Image upload backend not ready yet. Contact the OpenML team or use profile image from OAuth provider.",
              suggestion:
                "For now, sign in with GitHub/Google to use your OAuth profile picture.",
            },
            { status: 503 }, // Service Unavailable
          );
        }

        return NextResponse.json(
          { error: errorData.msg || "Upload failed" },
          { status: response.status },
        );
      }

      const data = await response.json();

      return NextResponse.json({
        success: true,
        message: data.msg || "Avatar uploaded successfully",
        imagePath: data.path,
      });
    } catch (fetchError) {
      // Network error - backend not reachable
      console.error("Backend connection error:", fetchError);
      return NextResponse.json(
        {
          error:
            "Cannot connect to backend server. Image upload temporarily unavailable.",
          suggestion:
            "Sign in with GitHub/Google to use your OAuth profile picture.",
        },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

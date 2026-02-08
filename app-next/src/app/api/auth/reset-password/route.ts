import { NextRequest, NextResponse } from "next/server";

const OPENML_API_URL =
  process.env.NEXT_PUBLIC_OPENML_API_URL || "https://www.openml.org";

/**
 * Reset Password API Route
 * Proxies request to OpenML backend to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const { password, url } = await request.json();

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 },
      );
    }

    if (!url) {
      return NextResponse.json(
        { message: "Reset URL is required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${OPENML_API_URL}/resetpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, url }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Password reset successfully",
      });
    }

    return NextResponse.json(
      { message: data.message || "Failed to reset password" },
      { status: response.status },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

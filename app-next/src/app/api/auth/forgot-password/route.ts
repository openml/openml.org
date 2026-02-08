import { NextRequest, NextResponse } from "next/server";

const OPENML_API_URL =
  process.env.NEXT_PUBLIC_OPENML_API_URL || "https://www.openml.org";

/**
 * Forgot Password API Route
 * Proxies request to OpenML backend to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${OPENML_API_URL}/forgotpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Password reset link sent",
      });
    }

    return NextResponse.json(
      { message: data.message || "Failed to send reset link" },
      { status: response.status },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

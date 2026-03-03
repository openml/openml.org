import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";

interface UserIdResult {
  id: number;
}

/**
 * Handle direct account confirmation
 * Bypasses Flask backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    // Extract token from URL
    const urlObj = new URL(url);
    const token = urlObj.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 400 },
      );
    }

    // 1. Find user by activation code
    const user = await queryOne<UserIdResult>(
      "SELECT id FROM users WHERE activation_code = ?",
      [token],
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired confirmation token." },
        { status: 400 },
      );
    }

    // 2. Activate user (set active = 1)
    await execute("UPDATE users SET active = 1 WHERE id = ?", [user.id]);

    return NextResponse.json({
      message: "User confirmed successfully",
    });
  } catch (error) {
    console.error("Confirmation error:", error);
    return NextResponse.json(
      { message: "An error occurred during confirmation" },
      { status: 500 },
    );
  }
}

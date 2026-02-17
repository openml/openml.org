import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

interface UserRecord {
  id: number;
  email: string;
  active: number;
}

/**
 * Forgot Password - Send password reset email
 * Uses LEGACY Flask schema for backward compatibility
 * Bypasses Flask backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await queryOne<UserRecord>(
      "SELECT id, email, active FROM users WHERE email = ?",
      [email],
    );

    // Always return success (don't reveal if email exists)
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive a password reset link shortly.",
        },
        { status: 200 },
      );
    }

    // Check if user account is active
    if (user.active !== 1) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive a password reset link shortly.",
        },
        { status: 200 },
      );
    }

    // Delete any existing password reset tokens for this user
    await execute("DELETE FROM password_reset_token WHERE user_id = ?", [
      user.id,
    ]);

    // Generate password reset token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await execute(
      "INSERT INTO password_reset_token (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expiresAt],
    );

    // Send password reset email
    await sendPasswordResetEmail(user.email, token);

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you will receive a password reset link shortly.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}

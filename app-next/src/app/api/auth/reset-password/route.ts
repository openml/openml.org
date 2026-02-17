import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import * as argon2 from "argon2";

interface TokenRecord {
  id: number;
  user_id: number;
  token: string;
  expires_at: string | Date;
  used: boolean;
}

interface UserRecord {
  id: number;
  email: string;
  active: number;
}

/**
 * Reset Password - Verify token and update password
 * Uses LEGACY Flask schema for backward compatibility
 * Bypasses Flask backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json(
        { message: "Reset token is required" },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "New password is required" },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Find the token in the database
    const tokenRecord = await queryOne<TokenRecord>(
      "SELECT id, user_id, token, expires_at, used FROM password_reset_token WHERE token = ?",
      [token],
    );

    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Check if token has already been used
    if (tokenRecord.used) {
      return NextResponse.json(
        { message: "This reset link has already been used" },
        { status: 400 },
      );
    }

    // Check if token is expired
    const expiresAt = new Date(tokenRecord.expires_at);
    if (expiresAt < new Date()) {
      // Delete expired token
      await execute("DELETE FROM password_reset_token WHERE id = ?", [
        tokenRecord.id,
      ]);

      return NextResponse.json(
        { message: "Reset token has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Get user
    const user = await queryOne<UserRecord>(
      "SELECT id, email, active FROM users WHERE id = ?",
      [tokenRecord.user_id],
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash new password with Argon2i (matching Flask parameters)
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2i,
      timeCost: 4,
      memoryCost: 16384,
      parallelism: 2,
    });

    // Update user password
    await execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      tokenRecord.user_id,
    ]);

    // Mark token as used
    await execute(
      "UPDATE password_reset_token SET used = ?, used_at = NOW() WHERE id = ?",
      [true, tokenRecord.id],
    );

    return NextResponse.json(
      {
        message:
          "Password reset successfully! You can now sign in with your new password.",
        email: user.email,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "An error occurred while resetting your password" },
      { status: 500 },
    );
  }
}

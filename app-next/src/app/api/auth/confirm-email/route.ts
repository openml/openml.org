import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";

interface TokenRecord {
  id: number;
  user_id: number;
  token: string;
  expires_at: string | Date;
}

interface UserRecord {
  id: number;
  email: string;
  active: number; // 0 = inactive, 1 = active (confirmed)
}

/**
 * Email confirmation endpoint
 * Verifies the confirmation token and activates the user account
 * Uses LEGACY Flask schema (active field) for backward compatibility
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Confirmation token is required" },
        { status: 400 },
      );
    }

    // 1. Find the token in the database
    const tokenRecord = await queryOne<TokenRecord>(
      "SELECT id, user_id, token, expires_at FROM email_confirmation_token WHERE token = ?",
      [token],
    );

    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Invalid confirmation token" },
        { status: 400 },
      );
    }

    // 2. Check if token is expired
    const expiresAt = new Date(tokenRecord.expires_at);
    if (expiresAt < new Date()) {
      // Delete expired token
      await execute("DELETE FROM email_confirmation_token WHERE id = ?", [
        tokenRecord.id,
      ]);

      return NextResponse.json(
        {
          message: "Confirmation token has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    // 3. Check if user already confirmed
    const user = await queryOne<UserRecord>(
      "SELECT id, email, active FROM users WHERE id = ?",
      [tokenRecord.user_id],
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.active === 1) {
      // Delete token since user is already confirmed
      await execute("DELETE FROM email_confirmation_token WHERE id = ?", [
        tokenRecord.id,
      ]);

      return NextResponse.json(
        {
          message: "Email already confirmed. You can now sign in.",
          alreadyConfirmed: true,
        },
        { status: 200 },
      );
    }

    // 4. Activate the user account (set active = 1)
    await execute("UPDATE users SET active = ? WHERE id = ?", [
      1,
      tokenRecord.user_id,
    ]);

    // 5. Delete the used token
    await execute("DELETE FROM email_confirmation_token WHERE id = ?", [
      tokenRecord.id,
    ]);

    return NextResponse.json(
      {
        message:
          "Email confirmed successfully! You can now sign in with your credentials.",
        email: user.email,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email confirmation error:", error);
    return NextResponse.json(
      { message: "An error occurred during email confirmation" },
      { status: 500 },
    );
  }
}

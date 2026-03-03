import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

/**
 * Check if an email is already registered
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await queryOne("SELECT id FROM users WHERE email = ?", [email]);
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

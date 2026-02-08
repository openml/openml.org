import { NextRequest, NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { cookies } from "next/headers";

const RP_ID = process.env.RP_ID || "localhost";

export async function GET(req: NextRequest) {
  try {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: "preferred",
    });

    // Store the challenge in a secure cookie for verification
    const cookieStore = await cookies();
    cookieStore.set("authentication-challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes
      path: "/",
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error("Passkey login options error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication options" },
      { status: 500 },
    );
  }
}

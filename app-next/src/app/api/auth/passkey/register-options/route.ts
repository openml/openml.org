import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { authOptions } from "../../[...nextauth]/route";
import { queryAll } from "@/lib/db";
import { cookies } from "next/headers";

const RP_ID = process.env.RP_ID || "localhost";
const RP_NAME = "OpenML";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email || "";
    const userName = (session.user as any).username || userEmail;

    // Get existing passkeys for this user to exclude them
    const existingPasskeys = await queryAll<{ credential_id: Buffer }>(
      "SELECT credential_id FROM user_passkeys WHERE user_id = (SELECT id FROM users WHERE email = ? OR username = ?)",
      [userEmail, userName],
    );

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: new TextEncoder().encode(userId.toString()),
      userName: userEmail,
      userDisplayName: session.user.name || userEmail,
      attestationType: "none",
      excludeCredentials: existingPasskeys.map((pk) => ({
        id: pk.credential_id.toString("base64url"),
        type: "public-key",
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform",
      },
    });

    // Store the challenge in a secure cookie for verification
    // In a real app, this should be signed or stored in a session
    const cookieStore = await cookies();
    cookieStore.set("registration-challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes
      path: "/",
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error("Passkey register options error:", error);
    return NextResponse.json(
      { error: "Failed to generate registration options" },
      { status: 500 },
    );
  }
}

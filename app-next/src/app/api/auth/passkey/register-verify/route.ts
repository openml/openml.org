import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { authOptions } from "../../[...nextauth]/route";
import { execute, queryOne } from "@/lib/db";
import { cookies } from "next/headers";

const RP_ID = process.env.RP_ID || "localhost";
const ORIGIN = process.env.RP_ORIGIN || "http://localhost:3050";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { credential, deviceName } = await req.json();

    const cookieStore = await cookies();
    const expectedChallenge = cookieStore.get("registration-challenge")?.value;

    if (!expectedChallenge) {
      return NextResponse.json(
        { error: "Registration challenge not found" },
        { status: 400 },
      );
    }

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential: verifiedCredential } = verification.registrationInfo;
      const {
        id: credentialID,
        publicKey: credentialPublicKey,
        counter,
      } = verifiedCredential;

      // Find the user ID in the database based on the session info
      const user = await queryOne<{ id: number }>(
        "SELECT id FROM users WHERE id = ? OR email = ?",
        [userId, session.user.email],
      );

      if (!user) {
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 404 },
        );
      }

      // Save the passkey to the database
      await execute(
        `INSERT INTO user_passkeys (user_id, credential_id, public_key, sign_count, transports, device_name) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          Buffer.from(credentialID),
          Buffer.from(credentialPublicKey),
          counter,
          credential.response.transports?.join(",") || "",
          deviceName || "Unnamed Device",
        ],
      );

      // Clear the challenge cookie
      cookieStore.delete("registration-challenge");

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Passkey register verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify registration" },
      { status: 500 },
    );
  }
}

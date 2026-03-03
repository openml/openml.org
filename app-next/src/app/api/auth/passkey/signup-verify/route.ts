import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { execute, queryOne } from "@/lib/db";
import { cookies } from "next/headers";

const RP_ID = process.env.RP_ID || "localhost";
const ORIGIN = process.env.RP_ORIGIN || "http://localhost:3050";

/**
 * Verify Passkey Sign-up
 * 1. Verify WebAuthn response
 * 2. Save passkey
 * 3. Activate user
 */
export async function POST(req: NextRequest) {
  try {
    const { credential, deviceName } = await req.json();

    const cookieStore = await cookies();
    const expectedChallenge = cookieStore.get("registration-challenge")?.value;
    const userIdStr = cookieStore.get("pending-signup-user-id")?.value;

    if (!expectedChallenge || !userIdStr) {
      return NextResponse.json(
        { error: "Registration session expired. Please try again." },
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

      const userId = parseInt(userIdStr);

      // 1. Save the passkey
      await execute(
        `INSERT INTO user_passkeys (user_id, credential_id, public_key, sign_count, transports, device_name) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          Buffer.from(credentialID),
          Buffer.from(credentialPublicKey),
          counter,
          credential.response.transports?.join(",") || "",
          deviceName || "Primary Device",
        ],
      );

      // 2. Activate the user
      await execute(
        "UPDATE users SET active = 1, activation_code = 'passkey_activated' WHERE id = ?",
        [userId]
      );

      // 3. Fetch user info for auto-login response
      const user = await queryOne<any>(
        "SELECT id, username, email, first_name, last_name, image, session_hash FROM users WHERE id = ?",
        [userId]
      );

      // Clear cookies
      cookieStore.delete("registration-challenge");
      cookieStore.delete("pending-signup-user-id");

      return NextResponse.json({
        success: true,
        user: {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          image: user.image,
          apikey: user.session_hash,
        }
      });
    } else {
      return NextResponse.json(
        { error: "Passkey verification failed" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Passkey sign-up verify error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 },
    );
  }
}

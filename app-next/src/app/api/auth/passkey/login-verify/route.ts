import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { execute, queryOne } from "@/lib/db";
import { cookies } from "next/headers";

const RP_ID = process.env.RP_ID || "localhost";
const ORIGIN = process.env.RP_ORIGIN || "http://localhost:3050";

interface PasskeyRecord {
  id: number;
  user_id: number;
  credential_id: Buffer;
  public_key: Buffer;
  sign_count: number;
}

interface UserRecord {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  session_hash: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();

    const cookieStore = await cookies();
    const expectedChallenge = cookieStore.get(
      "authentication-challenge",
    )?.value;

    if (!expectedChallenge) {
      return NextResponse.json(
        { error: "Authentication challenge not found" },
        { status: 400 },
      );
    }

    // credential.id is a base64url string - query directly since that's how it's stored
    const credentialID = credential.id as string;

    // Find the passkey in the database (stored as base64url string bytes)
    const passkey = await queryOne<PasskeyRecord>(
      "SELECT * FROM user_passkeys WHERE credential_id = ?",
      [Buffer.from(credentialID)],
    );

    if (!passkey) {
      return NextResponse.json(
        { error: "Passkey not found in database" },
        { status: 404 },
      );
    }

    // Convert stored buffers back to the format simplewebauthn expects
    // credential_id was stored as base64url string bytes, convert back to string
    const storedCredentialId = passkey.credential_id.toString();
    // public_key is stored as raw bytes, convert to Uint8Array
    const storedPublicKey = new Uint8Array(passkey.public_key);

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: storedCredentialId,
        publicKey: storedPublicKey,
        counter: passkey.sign_count,
      },
    });

    if (verification.verified && verification.authenticationInfo) {
      const { newCounter } = verification.authenticationInfo;

      // Update the sign count and last used at
      await execute(
        "UPDATE user_passkeys SET sign_count = ?, last_used_at = CURRENT_TIMESTAMP WHERE id = ?",
        [newCounter, passkey.id],
      );

      // Find the user associated with this passkey
      const user = await queryOne<UserRecord>(
        "SELECT id, username, email, first_name, last_name, image, session_hash FROM users WHERE id = ?",
        [passkey.user_id],
      );

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Clear the challenge cookie
      cookieStore.delete("authentication-challenge");

      // Return user info for NextAuth
      // Note: In a real app, you might want to issue a temporary JWT or use a secure way to signal success to authorize()
      return NextResponse.json({
        success: true,
        accessToken: "passkey-session", // Placeholder, NextAuth handles the session
        user: {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          image: user.image,
          apikey: user.session_hash,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Passkey login verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify authentication" },
      { status: 500 },
    );
  }
}

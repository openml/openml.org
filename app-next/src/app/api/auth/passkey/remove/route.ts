import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../[...nextauth]/route";
import { execute, queryOne } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { passkeyId } = await req.json();

    if (!passkeyId) {
      return NextResponse.json(
        { error: "Passkey ID required" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Verify the passkey belongs to the user before deleting
    const passkey = await queryOne<any>(
      `SELECT id FROM user_passkeys 
       WHERE id = ? AND user_id = (SELECT id FROM users WHERE id = ? OR email = ?)`,
      [passkeyId, userId, session.user.email],
    );

    if (!passkey) {
      return NextResponse.json(
        { error: "Passkey not found or unauthorized" },
        { status: 404 },
      );
    }

    await execute("DELETE FROM user_passkeys WHERE id = ?", [passkeyId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Passkey removal error:", error);
    return NextResponse.json(
      { error: "Failed to remove passkey" },
      { status: 500 },
    );
  }
}

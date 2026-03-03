import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../[...nextauth]/route";
import { queryAll } from "@/lib/db";

interface PasskeyRecord {
  id: number;
  deviceName: string | null;
  createdAt: number;
  lastUsedAt: number | null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const passkeys = await queryAll<PasskeyRecord>(
      `SELECT id, device_name as deviceName, created_at as createdAt, last_used_at as lastUsedAt 
       FROM user_passkeys 
       WHERE user_id = (SELECT id FROM users WHERE id = ? OR email = ?)`,
      [userId, session.user.email],
    );

    return NextResponse.json({ passkeys });
  } catch (error) {
    console.error("Passkey list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch passkeys" },
      { status: 500 },
    );
  }
}

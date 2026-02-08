import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { execute } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

/**
 * Handle direct avatar uploads to the filesystem and database
 * Bypasses Flask backend
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const username =
      (session.user as any).username || session.user.email?.split("@")[0];

    if (!username) {
      return NextResponse.json(
        { error: "Could not determine username" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Prepare directory structure (replicate Flask behavior)
    // Flask uses root/dev_data/[username]/[filename]
    const rootDir = process.cwd();
    const userDir = path.join(rootDir, "dev_data", username.toString());

    await fs.mkdir(userDir, { recursive: true });

    // 2. Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
    const filePath = path.join(userDir, fileName);

    await fs.writeFile(filePath, buffer);

    // 3. Update database with API route path
    // Format: "/api/images/dev_data/[username]/[filename]"
    const dbPath = `/api/images/dev_data/${username}/${fileName}`;

    await execute("UPDATE users SET image = ? WHERE id = ?", [dbPath, userId]);

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
      imagePath: dbPath,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 },
    );
  }
}

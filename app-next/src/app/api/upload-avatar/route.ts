import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { execute } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

interface ExtendedUser {
  id?: string | number;
  username?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

/**
 * Avatar Upload API Route - Direct to filesystem + database
 * Bypasses Flask backend for improved performance
 *
 * For Vercel production, use /api/upload-avatar-vercel instead (Blob storage)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as ExtendedUser;
    const userId = user.id;
    const username = user.username || user.email?.split("@")[0];

    if (!username) {
      return NextResponse.json(
        { error: "Could not determine username" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 },
      );
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

    // 3. Update database with the specific path format Flask expects
    // Format: "imgs/dev_data/[username]/[filename]"
    const dbPath = `imgs/dev_data/${username}/${fileName}`;

    await execute("UPDATE users SET image = ? WHERE id = ?", [dbPath, userId]);

    return NextResponse.json({
      success: true,
      message: "Avatar uploaded successfully",
      imagePath: dbPath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

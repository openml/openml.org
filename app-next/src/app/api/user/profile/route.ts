import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { execute, queryOne } from "@/lib/db";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  company: string;
  country: string;
  image: string;
}

/**
 * GET profile data from database
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;

    const user = await queryOne<UserProfile>(
      `SELECT first_name, last_name, email, bio, company, country, image 
       FROM users WHERE id = ?`,
      [userId],
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      bio: user.bio || "",
      affiliation: user.company || "",
      country: user.country || "",
      image: user.image || "",
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

/**
 * Handle direct profile updates to the database
 * Bypasses Flask backend
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { firstName, lastName, bio, affiliation, country, email } = body;

    // Update user in database
    // Note: We map 'affiliation' to the 'company' column in the OpenML schema
    await execute(
      `UPDATE users 
       SET first_name = ?, last_name = ?, bio = ?, company = ?, country = ?, email = ?
       WHERE id = ?`,
      [
        firstName || "",
        lastName || "",
        bio || "",
        affiliation || "",
        country || "",
        email || session.user.email,
        userId,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

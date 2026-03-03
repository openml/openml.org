import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { queryOne, execute } from "@/lib/db";
import { cookies } from "next/headers";
import * as argon2 from "argon2";
import secrets from "crypto";
import { generateUniqueUsername } from "@/lib/username";

interface InsertResult {
  insertId?: number;
  lastID?: number;
  lastInsertRowid?: number;
}

interface MaxIdResult {
  next_id: number;
}

const RP_ID = process.env.RP_ID || "localhost";
const RP_NAME = "OpenML";

/**
 * Initiate Passkey Sign-up
 * 1. Create a pending user record
 * 2. Generate registration options
 */
export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // 1. Check if user already exists
    const existingUser = await queryOne(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // 2. Generate unique username from first and last name
    const username = await generateUniqueUsername(firstName, lastName, email);

    // 3. Create pending user (active=0)
    // We set a strong random password for legacy compatibility
    const randomPassword = secrets.randomBytes(32).toString("hex");
    const hashedPassword = await argon2.hash(randomPassword, {
      type: argon2.argon2i,
      timeCost: 4,
      memoryCost: 16384,
      parallelism: 2,
    });

    const now = Math.floor(Date.now() / 1000);
    const result = await execute(
      `INSERT INTO users (
        username, password, email, first_name, last_name, 
        active, activation_code, created_on, 
        ip_address, company, phone, country, image, bio, core, 
        external_source, external_id, forgotten_password_code, forgotten_password_time,
        remember_code, activation_selector, forgotten_password_selector, remember_selector,
        last_login
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashedPassword,
        email,
        firstName,
        lastName,
        0, // Start as inactive
        "passkey_pending",
        now,
        req.headers.get("x-forwarded-for") || "127.0.0.1",
        "0000",
        "0000",
        "0000",
        "0000",
        "No Bio",
        "false",
        "0000",
        "0000",
        "0000",
        "0000",
        "0000",
        "0000",
        "0000",
        "0000",
        0,
      ],
    );

    const insertResult = result as InsertResult;
    const userId =
      insertResult.insertId ||
      insertResult.lastID ||
      insertResult.lastInsertRowid;

    if (!userId) {
      throw new Error("Failed to create user record");
    }

    // Assign to default group
    // Get next available id for users_groups (table has no AUTOINCREMENT)
    const maxIdResult = await queryOne(
      "SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users_groups",
      [],
    );
    const nextGroupId = (maxIdResult as MaxIdResult | null)?.next_id || 1;
    await execute(
      "INSERT INTO users_groups (id, user_id, group_id) VALUES (?, ?, ?)",
      [nextGroupId, userId, 2],
    );

    // 4. Generate registration options
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: new TextEncoder().encode(userId.toString()),
      userName: email,
      userDisplayName: `${firstName} ${lastName}`,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform",
      },
    });

    // 5. Store challenge and user ID in cookies
    const cookieStore = await cookies();
    cookieStore.set("registration-challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5,
      path: "/",
    });
    cookieStore.set("pending-signup-user-id", userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5,
      path: "/",
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error("Passkey sign-up options error:", error);
    return NextResponse.json(
      { error: "Failed to initiate sign-up" },
      { status: 500 },
    );
  }
}

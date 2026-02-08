import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/mail";
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

/**
 * Handle direct user registration
 * Bypasses Flask backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // 1. Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // 2. Check if user already exists
    const existingUser = await queryOne(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 },
      );
    }

    // 3. Generate unique username from first and last name
    const username = await generateUniqueUsername(firstName, lastName, email);

    // 4. Hash password with Argon2i (matching Flask parameters)
    // parameters from server/config.py: t=4, m=16384 (16MiB), p=2
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2i,
      timeCost: 4,
      memoryCost: 16384,
      parallelism: 2,
    });

    // 5. Generate activation token
    const token = secrets.randomBytes(16).toString("hex");
    const now = Math.floor(Date.now() / 1000);

    // 6. Create user record (populating legacy "0000" fields for compatibility)
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
        0, // active = 0 (Requires confirmation)
        token,
        now,
        request.headers.get("x-forwarded-for") || "127.0.0.1",
        "0000", // company
        "0000", // phone
        "0000", // country
        "0000", // image
        "No Bio", // bio
        "false", // core
        "0000", // external_source
        "0000", // external_id
        "0000", // forgotten_password_code
        "0000", // forgotten_password_time
        "0000", // remember_code
        "0000", // activation_selector
        "0000", // forgotten_password_selector
        "0000", // remember_selector
        0, // last_login
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

    // 7. Assign to default group (2 = user)
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

    // 8. Send confirmation email
    await sendConfirmationEmail(email, token);

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to confirm your account.",
        username,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 },
    );
  }
}

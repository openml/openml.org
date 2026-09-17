import { NextResponse } from "next/server";

/**
 * DEBUG ENDPOINT - Remove in production!
 * Shows server-side environment variables
 */
export async function GET() {
  // Only allow in development/testing
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const serverEnv = {
    // Database
    MYSQL_HOST: process.env.MYSQL_HOST || "(not set)",
    MYSQL_PORT: process.env.MYSQL_PORT || "(not set)",
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || "(not set)",
    MYSQL_USER: process.env.MYSQL_USER || "(not set)",
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? "***SET***" : "(not set)",

    // GitHub
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "(not set)",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? "***SET***" : "(not set)",

    // Other secrets
    JWT_SECRET: process.env.JWT_SECRET ? "***SET***" : "(not set)",

    // Public URLs (for comparison)
    NEXT_PUBLIC_OPENML_API_URL: process.env.NEXT_PUBLIC_OPENML_API_URL || "(not set)",
    NEXT_PUBLIC_ELASTICSEARCH_URL: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL || "(not set)",
  };

  return NextResponse.json({
    message: "Server-side environment variables",
    env: serverEnv,
  });
}

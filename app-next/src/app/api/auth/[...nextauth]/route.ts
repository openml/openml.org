import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { queryOne } from "@/lib/db";
import * as argon2 from "argon2";
import { generateUniqueUsername } from "@/lib/username";

interface DbUser {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  active: number;
  session_hash: string | null;
}

interface OAuthDbUser {
  id: number;
  email: string;
  username: string;
  session_hash: string | null;
  first_name?: string | null;
  last_name?: string | null;
  image?: string | null;
}

interface InsertResult {
  insertId?: number;
  lastID?: number;
}

interface MaxIdResult {
  next_id: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // GitHub OAuth Provider
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),

    // Traditional OpenML Login (username/password)
    CredentialsProvider({
      id: "credentials",
      name: "OpenML Account",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Direct database authentication - bypasses Flask
          console.log("[Auth] Direct DB login for:", credentials.email);

          // Find user by email or username
          const user = await queryOne(
            "SELECT id, username, email, password, first_name, last_name, image, active, session_hash FROM users WHERE email = ? OR username = ?",
            [credentials.email, credentials.email],
          );

          if (!user) {
            console.log("[Auth] User not found:", credentials.email);
            return null;
          }

          const dbUser = user as DbUser;

          // Check if user is active
          if (!dbUser.active) {
            console.log("[Auth] User not activated:", credentials.email);
            return null;
          }

          // Verify password with Argon2
          const isValid = await argon2.verify(
            dbUser.password,
            credentials.password,
          );

          if (!isValid) {
            console.log("[Auth] Invalid password for:", credentials.email);
            return null;
          }

          console.log("[Auth] Login successful for:", dbUser.username);

          // Return user object
          return {
            id: dbUser.id.toString(),
            email: dbUser.email,
            name:
              `${dbUser.first_name || ""} ${dbUser.last_name || ""}`.trim() ||
              dbUser.email,
            image:
              dbUser.image && dbUser.image !== "0000" ? dbUser.image : null,
            username: dbUser.username,
            session_hash: dbUser.session_hash,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
    // Passkey Provider
    CredentialsProvider({
      id: "passkey",
      name: "Passkey",
      credentials: {
        credential: { label: "Credential", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.credential) {
          return null;
        }

        try {
          const { accessToken, user } = JSON.parse(credentials.credential);

          if (accessToken && user) {
            return {
              ...user,
              accessToken,
            };
          }
          return null;
        } catch (error) {
          console.error("Passkey authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        const email = user.email;
        if (!email) return false;

        try {
          const { queryOne, execute } = await import("@/lib/db");

          // 1. Check if user exists by external ID
          let dbUser = await queryOne<OAuthDbUser>(
            "SELECT id, email, username, session_hash, first_name, last_name, image FROM users WHERE external_source = ? AND external_id = ?",
            [account.provider, account.providerAccountId],
          );

          // 2. If not found, check by email
          if (!dbUser) {
            dbUser = await queryOne<OAuthDbUser>(
              "SELECT id, email, username, session_hash, first_name, last_name, image FROM users WHERE email = ?",
              [email],
            );

            if (dbUser) {
              // Link existing user to this OAuth provider
              await execute(
                "UPDATE users SET external_source = ?, external_id = ? WHERE id = ?",
                [account.provider, account.providerAccountId, dbUser.id],
              );
            } else {
              // 3. Create new user
              // Extract first and last name from OAuth profile
              const firstName =
                ((profile as Record<string, unknown>)?.given_name as string) ||
                user.name?.split(" ")[0] ||
                "";
              const lastName =
                ((profile as Record<string, unknown>)?.family_name as string) ||
                user.name?.split(" ").slice(1).join(" ") ||
                "";

              // Generate username from first and last name
              const username = await generateUniqueUsername(
                firstName,
                lastName,
                email,
              );
              const now = Math.floor(Date.now() / 1000);

              // Generate a session hash (API key)
              const crypto = await import("crypto");
              const sessionHash = crypto
                .createHash("md5")
                .update(now.toString() + email)
                .digest("hex");

              const result = await execute(
                `INSERT INTO users (
                  username, password, email, created_on, active, 
                  first_name, last_name, company, country, bio, 
                  external_source, external_id, session_hash, ip_address,
                  phone, image, core, forgotten_password_code, forgotten_password_time,
                  remember_code, activation_selector, forgotten_password_selector, 
                  remember_selector, activation_code, last_login
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  username,
                  "oauth_no_password",
                  email,
                  now,
                  1,
                  firstName,
                  lastName,
                  "0000", // company
                  "0000", // country
                  "OpenML user joined via " + account.provider,
                  account.provider,
                  account.providerAccountId,
                  sessionHash,
                  "127.0.0.1", // ip_address
                  "0000", // phone
                  user.image || "0000", // image
                  "false", // core
                  "0000", // forgotten_password_code
                  "0000", // forgotten_password_time
                  "0000", // remember_code
                  "0000", // activation_selector
                  "0000", // forgotten_password_selector
                  "0000", // remember_selector
                  "0000", // activation_code
                  0, // last_login
                ],
              );

              const insertResult = result as InsertResult;
              const newId = insertResult.insertId || insertResult.lastID;
              if (!newId) {
                console.error("Failed to get new user ID");
                return false;
              }
              dbUser = {
                id: newId,
                email,
                username,
                session_hash: sessionHash,
              };

              // Add to default group (2 = user)
              // Get next available id for users_groups (table has no AUTOINCREMENT)
              const maxIdResult = await queryOne(
                "SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users_groups",
                [],
              );
              const nextGroupId =
                (maxIdResult as MaxIdResult | null)?.next_id || 1;
              await execute(
                "INSERT INTO users_groups (id, user_id, group_id) VALUES (?, ?, ?)",
                [nextGroupId, newId, 2],
              );
            }
          }

          // Attach database info to the user object for the JWT callback
          if (!dbUser) {
            console.error("Failed to get or create user");
            return false;
          }
          user.id = String(dbUser.id);
          user.username = dbUser.username;
          user.session_hash = dbUser.session_hash;
          // Mark as local user (OAuth users don't exist on openml.org)
          (user as any).isLocalUser = true;
          return true;
        } catch (error) {
          console.error("SignIn Callback Error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Handle session updates (e.g., profile picture upload)
      if (trigger === "update" && session?.user?.image) {
        token.picture = session.user.image;
        return token;
      }

      // Initial sign in
      if (user) {
        // Data from credentials/passkey/signIn callback
        token.userId = user.id;
        token.username = user.username;
        token.accessToken = user.accessToken;
        token.apikey = user.session_hash || user.apikey;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.picture = user.image;
        token.isLocalUser = (user as any).isLocalUser || false;
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user.id = token.userId ?? "";
        session.user.username = token.username ?? "";
        session.accessToken = token.accessToken;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        // Add API key to session for likes/votes
        if (token.apikey) {
          session.apikey = token.apikey as string;
        }
        // Add profile image to session
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        // Mark if user is local-only (not from openml.org)
        (session.user as any).isLocalUser = token.isLocalUser || false;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours (matches Flask JWT)
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

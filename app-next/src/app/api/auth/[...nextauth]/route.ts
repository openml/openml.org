import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

          // Call Flask login endpoint
          const res = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.access_token) {
            // Fetch user profile
            const profileRes = await fetch(`${apiUrl}/profile`, {
              headers: { Authorization: `Bearer ${data.access_token}` },
            });
            const profile = profileRes.ok ? await profileRes.json() : {};

            // Return user object with JWT token and profile
            return {
              id: credentials.email,
              email: credentials.email,
              name:
                `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
                credentials.email,
              image:
                profile.image && profile.image !== "0000"
                  ? profile.image
                  : null,
              accessToken: data.access_token,
              firstName: profile.first_name,
              lastName: profile.last_name,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // Handle session updates (e.g., profile picture upload)
      if (trigger === "update" && session?.user?.image) {
        token.picture = session.user.image;
        return token;
      }

      // Initial sign in
      if (account && user) {
        // Handle OAuth providers (GitHub, Google)
        if (account.provider === "github" || account.provider === "google") {
          // Store OAuth user image
          token.picture = user.image || "";

          try {
            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

            // Call Flask OAuth endpoint
            const res = await fetch(
              `${apiUrl}/auth/oauth/${account.provider}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  provider: account.provider,
                  providerId: account.providerAccountId,
                  email: (profile as any)?.email || user.email,
                  name: user.name || "",
                  image: user.image || "",
                }),
              },
            );

            if (res.ok) {
              const data = await res.json();
              token.accessToken = data.access_token;
              token.userId = data.id;
              token.username = data.username;
              // Store API key from OAuth response
              if (data.apikey) {
                token.apikey = data.apikey;
              }
            }
          } catch (error) {
            console.error("OAuth backend error:", error);
          }
        }

        // Handle credentials provider
        if (account.provider === "credentials") {
          if ((user as any).accessToken) {
            token.accessToken = (user as any).accessToken;
          }
          if ((user as any).firstName) {
            token.firstName = (user as any).firstName;
          }
          if ((user as any).lastName) {
            token.lastName = (user as any).lastName;
          }
          // Store OpenML profile image
          if (user.image) {
            token.picture = user.image;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user.id = token.userId as string;
        session.user.username = token.username as string;
        session.accessToken = token.accessToken as string;
        (session.user as any).firstName = token.firstName as string;
        (session.user as any).lastName = token.lastName as string;
        // Add API key to session for likes/votes
        if (token.apikey) {
          session.apikey = token.apikey as string;
        }
        // Add profile image to session
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
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

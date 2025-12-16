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
            // Return user object with JWT token
            return {
              id: credentials.email,
              email: credentials.email,
              accessToken: data.access_token,
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
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        // Handle OAuth providers (GitHub, Google)
        if (account.provider === "github" || account.provider === "google") {
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
            }
          } catch (error) {
            console.error("OAuth backend error:", error);
          }
        }

        // Handle credentials provider
        if (account.provider === "credentials" && (user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
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

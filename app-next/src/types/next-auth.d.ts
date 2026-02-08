import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    apikey?: string;
  }

  interface User extends DefaultUser {
    id: string;
    username?: string;
    accessToken?: string;
    session_hash?: string | null;
    firstName?: string;
    lastName?: string;
    apikey?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    userId?: string;
    username?: string;
    apikey?: string;
    firstName?: string;
    lastName?: string;
  }
}

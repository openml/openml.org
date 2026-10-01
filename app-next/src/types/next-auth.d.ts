import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    image?: string | null;
    session_hash?: string | null;
    apikey?: string;
    accessToken?: string;
    isLocalUser?: boolean;
    openmlUserId?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      firstName?: string;
      lastName?: string;
      image?: string | null;
      isLocalUser?: boolean;
      openmlUserId?: string;
    } & DefaultSession["user"];
    apikey?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    picture?: string | null;
    apikey?: string;
    accessToken?: string;
    isLocalUser?: boolean;
    openmlUserId?: string;
  }
}

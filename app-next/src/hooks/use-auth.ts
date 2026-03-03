"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Unified Auth Hook
 * Centralizes all authentication operations for the app
 */

interface ExtendedUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  username?: string;
  firstName?: string;
  lastName?: string;
  apikey?: string;
}

interface UseAuthReturn {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  apiKey: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithProvider: (provider: "github" | "google") => Promise<void>;
  logout: () => Promise<void>;
  getAuthHeader: () => Record<string, string>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = useMemo<ExtendedUser | null>(() => {
    if (!session?.user) return null;
    return {
      id: (session.user as ExtendedUser).id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      username: (session.user as ExtendedUser).username,
      firstName: (session.user as ExtendedUser).firstName,
      lastName: (session.user as ExtendedUser).lastName,
      apikey: (session as { apikey?: string }).apikey,
    };
  }, [session]);

  const isAuthenticated = status === "authenticated" && !!session;
  const isLoading = status === "loading";
  const apiKey = (session as { apikey?: string } | null)?.apikey ?? null;

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          return { success: false, error: "Invalid credentials" };
        }

        return { success: true };
      } catch {
        return { success: false, error: "Login failed. Please try again." };
      }
    },
    [],
  );

  const loginWithProvider = useCallback(
    async (provider: "github" | "google") => {
      await signIn(provider, { callbackUrl: "/dashboard" });
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
  }, [router]);

  const getAuthHeader = useCallback((): Record<string, string> => {
    if (!apiKey) return {};
    return { "X-API-Key": apiKey };
  }, [apiKey]);

  return {
    user,
    isAuthenticated,
    isLoading,
    apiKey,
    login,
    loginWithProvider,
    logout,
    getAuthHeader,
  };
}

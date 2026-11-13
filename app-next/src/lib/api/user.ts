import { APP_CONFIG } from "@/lib/config";

/**
 * Basic user info returned by the OpenML REST API (/api/v1/json/user/{id}).
 */
export interface UserInfo {
  id: string | number;
  username?: string;
  first_name?: string;
  last_name?: string;
  image?: string;
  bio?: string;
  date_registered?: string;
}

/**
 * Fetch basic user info by ID from the OpenML REST API.
 * Returns `null` on any error (never throws).
 */
export async function getUser(userId: string): Promise<UserInfo | null> {
  try {
    const apiUrl = APP_CONFIG.urlApi || "https://www.openml.org/api/v1";
    const response = await fetch(`${apiUrl}/json/user/${userId}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return (data.user as UserInfo) || null;
  } catch {
    return null;
  }
}

/**
 * OpenML API Service
 * Connects to the existing OpenML backend at www.openml.org
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

interface LoginResponse {
  access_token: string;
  msg?: string;
}

interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  first_name?: string; // Flask returns snake_case
  last_name?: string; // Flask returns snake_case
  firstName?: string; // Also support camelCase
  lastName?: string; // Also support camelCase
  image?: string;
  company?: string;
  country?: string;
  external_sources?: string;
  timezone?: number;
}

export interface OpenMLUser {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: string;
  company?: string;
  country?: string;
}

/**
 * Login to OpenML
 * Calls the Flask backend /user/login endpoint
 */
export async function loginToOpenML(
  emailOrUsername: string,
  password: string,
): Promise<{
  success: boolean;
  token?: string;
  user?: OpenMLUser;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailOrUsername,
        password: password,
      }),
    });

    const data: LoginResponse = await response.json();

    // Check for error messages from backend
    if (data.msg) {
      if (data.msg === "Wrong username or password") {
        return { success: false, error: "Invalid credentials" };
      }
      if (data.msg === "NotConfirmed") {
        return {
          success: false,
          error: "Please confirm your email address before logging in",
        };
      }
      if (data.msg === "wrong password") {
        return { success: false, error: "Invalid password" };
      }
    }

    if (!response.ok || !data.access_token) {
      return {
        success: false,
        error: "Authentication failed. Please try again.",
      };
    }

    // Get user profile with the token
    const profileResult = await getUserProfile(data.access_token);

    if (!profileResult.success || !profileResult.user) {
      return { success: false, error: "Failed to fetch user profile" };
    }

    return {
      success: true,
      token: data.access_token,
      user: profileResult.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Unable to connect to OpenML server. Please try again later.",
    };
  }
}

/**
 * Get user profile from OpenML
 * Calls the Flask backend /user/profile endpoint
 */
export async function getUserProfile(
  token: string,
): Promise<{ success: boolean; user?: OpenMLUser; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { success: false, error: "Failed to fetch profile" };
    }

    const profile: UserProfile = await response.json();

    // Transform backend profile to our format
    const user: OpenMLUser = {
      username: profile.username,
      email: profile.email,
      firstName: profile.firstName || profile.first_name, // Support both formats
      lastName: profile.lastName || profile.last_name, // Support both formats
      bio: profile.bio,
      image: profile.image,
      company: profile.company,
      country: profile.country,
    };

    return { success: true, user };
  } catch (error) {
    console.error("Profile fetch error:", error);
    return {
      success: false,
      error: "Unable to fetch profile. Please try again.",
    };
  }
}

/**
 * Validate token by attempting to fetch profile
 */
export async function validateToken(token: string): Promise<boolean> {
  const result = await getUserProfile(token);
  return result.success;
}

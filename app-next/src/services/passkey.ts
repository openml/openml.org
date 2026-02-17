/**
 * OpenML Passkey Authentication Service
 * Implements WebAuthn/FIDO2 passkey authentication using SimpleWebAuthn
 */

import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/types";

const API_BASE_URL = "/api/auth/passkey";

export interface PasskeyVerificationResponse {
  success: boolean;
  error?: string;
  verified?: boolean;
}

export interface PasskeyAuthResponse {
  success: boolean;
  error?: string;
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    apikey?: string;
  };
}

export interface Passkey {
  id: number;
  deviceName: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface PasskeyListResponse {
  success: boolean;
  passkeys?: Passkey[];
  error?: string;
}

/**
 * Register a new passkey for the current user
 */
export async function registerPasskey(
  accessToken: string, // Kept for signature compatibility but cookies are used
  deviceName?: string,
): Promise<PasskeyVerificationResponse> {
  try {
    // Step 1: Get registration options from local API
    const optionsRes = await fetch(`${API_BASE_URL}/register-options`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceName }),
    });

    if (!optionsRes.ok) {
      const error = await optionsRes.json();
      return {
        success: false,
        error: error.error || "Failed to get registration options",
      };
    }

    const options: PublicKeyCredentialCreationOptionsJSON =
      await optionsRes.json();

    // Step 2: Trigger browser passkey creation
    let credential: RegistrationResponseJSON;
    try {
      credential = await startRegistration({ optionsJSON: options });
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        return { success: false, error: "Passkey registration was cancelled" };
      }
      return {
        success: false,
        error: error.message || "Failed to create passkey",
      };
    }

    // Step 3: Send credential for verification
    const verifyRes = await fetch(`${API_BASE_URL}/register-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential, deviceName }),
    });

    if (!verifyRes.ok) {
      const error = await verifyRes.json();
      return {
        success: false,
        error: error.error || "Failed to verify passkey",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Passkey registration error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}

/**
 * Authenticate user with passkey
 */
export async function authenticateWithPasskey(): Promise<PasskeyAuthResponse> {
  try {
    // Step 1: Get authentication options
    const optionsRes = await fetch(`${API_BASE_URL}/login-options`);

    if (!optionsRes.ok) {
      return { success: false, error: "Failed to get authentication options" };
    }

    const options: PublicKeyCredentialRequestOptionsJSON =
      await optionsRes.json();

    // Step 2: Trigger browser passkey authentication
    let credential: AuthenticationResponseJSON;
    try {
      credential = await startAuthentication({ optionsJSON: options });
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        return { success: false, error: "Authentication was cancelled" };
      }
      return {
        success: false,
        error: error.message || "Authentication failed",
      };
    }

    // Step 3: Verify credential
    const verifyRes = await fetch(`${API_BASE_URL}/login-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    if (!verifyRes.ok) {
      const error = await verifyRes.json();
      return {
        success: false,
        error: error.error || "Authentication failed",
      };
    }

    const data = await verifyRes.json();
    return {
      success: true,
      accessToken: data.accessToken,
      user: data.user,
    };
  } catch (error) {
    console.error("Passkey authentication error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}

/**
 * Get list of user's registered passkeys
 */
export async function listPasskeys(): Promise<PasskeyListResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/list`);

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        error: error.error || "Failed to fetch passkeys",
      };
    }

    const data = await res.json();
    return {
      success: true,
      passkeys: data.passkeys || [],
    };
  } catch (error) {
    console.error("Error fetching passkeys:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}

/**
 * Remove a passkey from user's account
 */
export async function removePasskey(
  passkeyId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkeyId }),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        error: error.error || "Failed to remove passkey",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing passkey:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}

/**
 * Check if browser supports passkeys
 */
export function isPasskeySupported(): boolean {
  return (
    typeof window !== "undefined" &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  );
}

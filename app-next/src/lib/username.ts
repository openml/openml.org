import { queryOne } from "@/lib/db";

/**
 * Username Generation Utility
 *
 * Generates unique usernames from first and last names following established patterns:
 * 1. First initial + last name (e.g., "jdoe")
 * 2. First name + last name (e.g., "johndoe")
 * 3. Add numeric suffix for collisions (e.g., "jdoe1", "jdoe2")
 *
 * Rules:
 * - Lowercase letters only
 * - Numbers only for suffixes
 * - Database checks in a loop to ensure uniqueness
 */

/**
 * Sanitize a string for use in username (lowercase, alphanumeric only)
 */
function sanitize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Check if a username exists in the database
 */
async function usernameExists(username: string): Promise<boolean> {
  const existing = await queryOne("SELECT id FROM users WHERE username = ?", [
    username,
  ]);
  return !!existing;
}

/**
 * Generate a unique username from first and last name
 *
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param fallbackEmail - Optional email to use as fallback if names are empty
 * @returns A unique username
 */
export async function generateUniqueUsername(
  firstName: string,
  lastName: string,
  fallbackEmail?: string,
): Promise<string> {
  const first = sanitize(firstName);
  const last = sanitize(lastName);

  // If names are empty, fall back to email prefix
  if (!first && !last) {
    if (fallbackEmail) {
      const emailPrefix = sanitize(fallbackEmail.split("@")[0]);
      return findAvailableUsername(emailPrefix);
    }
    // Last resort: generate random username
    return findAvailableUsername(`user${Date.now()}`);
  }

  // Strategy 1: First initial + last name (e.g., "jdoe")
  if (first && last) {
    const initialPlusLast = `${first.charAt(0)}${last}`;
    if (!(await usernameExists(initialPlusLast))) {
      return initialPlusLast;
    }

    // Strategy 2: First name + last name (e.g., "johndoe")
    const fullName = `${first}${last}`;
    if (!(await usernameExists(fullName))) {
      return fullName;
    }

    // Strategy 3: First initial + last name + number suffix
    return findAvailableUsername(initialPlusLast);
  }

  // If only first name available
  if (first) {
    return findAvailableUsername(first);
  }

  // If only last name available
  return findAvailableUsername(last);
}

/**
 * Find an available username by appending numeric suffixes
 */
async function findAvailableUsername(baseUsername: string): Promise<string> {
  // First try without suffix
  if (!(await usernameExists(baseUsername))) {
    return baseUsername;
  }

  // Add numeric suffix until we find an available one
  let counter = 1;
  let candidate = `${baseUsername}${counter}`;

  while (await usernameExists(candidate)) {
    counter++;
    candidate = `${baseUsername}${counter}`;

    // Safety limit to prevent infinite loops
    if (counter > 9999) {
      throw new Error("Unable to generate unique username");
    }
  }

  return candidate;
}

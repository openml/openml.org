import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Abbreviate a number to a more readable format
 * e.g., 24500 -> "24.5k", 10100000 -> "10.1M"
 */
export function abbreviateNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) {
    return "";
  }

  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    const abbreviated = (num / 1000).toFixed(1);
    // Remove trailing .0
    return abbreviated.endsWith(".0")
      ? abbreviated.slice(0, -2) + "k"
      : abbreviated + "k";
  }

  const abbreviated = (num / 1000000).toFixed(1);
  // Remove trailing .0
  return abbreviated.endsWith(".0")
    ? abbreviated.slice(0, -2) + "M"
    : abbreviated + "M";
}

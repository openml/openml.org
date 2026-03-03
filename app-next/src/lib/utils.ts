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

/**
 * Truncate a long name by keeping the start and end, with (...) in between.
 * Tries to break at separator boundaries (dots, commas, spaces, parens, equals).
 *
 * Example:
 *   "sklearn.pipeline.Pipeline(imputer=sklearn.impute._base.SimpleImputer,...DecisionTreeClassifier)(2)"
 *   → "sklearn.pipeline.Pipeline(imputer=sklearn(...)DecisionTreeClassifier)(2)"
 */
export function truncateName(name: string, maxLength = 72): string {
  if (!name || name.length <= maxLength) return name;

  const separators = /[.\s,=(]/;
  const headTarget = Math.ceil(maxLength * 0.45);
  const tailTarget = Math.floor(maxLength * 0.35);

  // Find a separator-boundary near the head target (search backwards)
  let headEnd = headTarget;
  for (let i = headTarget; i > headTarget - 15 && i > 0; i--) {
    if (separators.test(name[i])) {
      headEnd = i + 1;
      break;
    }
  }

  // Find a separator-boundary near the tail target (search forwards)
  let tailStart = name.length - tailTarget;
  for (let i = tailStart; i < tailStart + 15 && i < name.length; i++) {
    if (separators.test(name[i])) {
      tailStart = i;
      break;
    }
  }

  return `${name.slice(0, headEnd)}... (...) ...${name.slice(tailStart)}`;
}

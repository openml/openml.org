import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { pathnames } from "./pathnames";

export const routing = defineRouting({
  // All supported locales
  locales: ["en", "nl", "fr", "de"],

  // Default locale (no prefix in URL)
  defaultLocale: "en",

  // Use 'as-needed' to omit locale prefix for default locale
  localePrefix: "as-needed",

  // Disable automatic locale detection (always use default locale unless explicitly in URL)
  localeDetection: false,

  // Localized pathnames
  pathnames,
});

// Type-safe navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type Locale = (typeof routing.locales)[number];

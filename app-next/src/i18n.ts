import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Supported locales
export const locales = ["en", "nl", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = "en";

// Locale prefix configuration
export const localePrefix = "as-needed" as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for the potentially async locale
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

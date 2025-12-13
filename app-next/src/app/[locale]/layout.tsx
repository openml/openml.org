import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { QueryProvider } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { Toaster } from "@/components/ui/toaster";
import { locales } from "@/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenML - Open Machine Learning Platform",
  description:
    "OpenML is an open platform for sharing datasets, algorithms, and experiments to build a global machine learning repository.",
  keywords: [
    "machine learning",
    "datasets",
    "algorithms",
    "benchmarks",
    "reproducible research",
    "AI",
    "open science",
  ],
  authors: [{ name: "OpenML Community" }],
  openGraph: {
    title: "OpenML - Open Machine Learning Platform",
    description:
      "Share datasets, algorithms, and experiments to build a global machine learning repository.",
    type: "website",
    locale: "en_US",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params in Next.js 15+
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <QueryProvider>
              <SidebarProvider>
                <Header />
                <div className="flex flex-1">
                  <Sidebar />
                  <MainContent>{children}</MainContent>
                </div>
                <ConditionalFooter />
              </SidebarProvider>
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

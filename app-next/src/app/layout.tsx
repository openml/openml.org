import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OpenMLFooter } from "@/components/layout/OpenMLFooter";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

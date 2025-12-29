"use client";

import Image from "next/image";
import { Link, usePathname } from "@/config/routing";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { SearchBar } from "@/components/header/search-bar";
import { LanguageSwitcher } from "@/components/header/language-switcher";
import { NotificationsBell } from "@/components/header/notifications-bell";
import { UserActivitySidebar } from "@/components/layout/user-activity-sidebar";
import { CreateMenu } from "@/components/header/create-menu";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { homeMenuOpen, setHomeMenuOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#eaeff5]/95 text-slate-800 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[#eaeff5]/85 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100 dark:supports-[backdrop-filter]:bg-slate-950/85">
      <div className="flex h-24 items-center justify-between gap-2 px-3 md:gap-4 md:px-0">
        {/* Sidebar-width Container - Desktop only */}
        <div className="hidden shrink-0 items-center justify-center gap-2 md:flex lg:w-64">
          {/* Burger Menu */}
          {(isHomePage || true) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHomeMenuOpen(!homeMenuOpen)}
              className={cn(
                "size-12 hover:bg-slate-700 hover:text-slate-300",
                !isHomePage && "lg:hidden",
              )}
              aria-label="Toggle menu"
            >
              <svg
                className="size-9"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </Button>
          )}

          {/* Logo */}
          {!(isHomePage && homeMenuOpen) && (
            <Link
              href="/"
              className="flex items-center transition-transform hover:scale-107"
              title="OpenML Home"
            >
              <Image
                src="/logo_openML_light-bkg.png"
                alt="OpenML"
                width={140}
                height={70}
                className="object-contain"
                priority
              />
            </Link>
          )}
        </div>

        {/* Mobile Container - Hamburger + Logo (left-aligned) */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Burger Menu */}
          {(isHomePage || true) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHomeMenuOpen(!homeMenuOpen)}
              className={cn(
                "size-12 hover:bg-slate-700 hover:text-slate-300",
                !isHomePage && "lg:hidden",
              )}
              aria-label="Toggle menu"
            >
              <svg
                className="size-9"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </Button>
          )}

          {/* Mobile Logo - Left-aligned next to hamburger */}
          {!(isHomePage && homeMenuOpen) && (
            <Link
              href="/"
              className="flex items-center transition-transform hover:scale-107"
              title="OpenML Home"
            >
              <Image
                src="/logo_openML_light-bkg.png"
                alt="OpenML"
                width={140}
                height={70}
                className="object-contain"
                priority
              />
            </Link>
          )}
        </div>

        {/* Search Bar - Desktop, starts after sidebar */}
        <div className="hidden flex-1 md:flex md:pr-6">
          <SearchBar />
        </div>

        {/* Action Icons - Right */}
        <div className="flex items-center gap-2 md:gap-4 md:pr-6">
          {/* Documentation */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden size-10 cursor-pointer text-slate-700 hover:bg-slate-300 hover:text-slate-900 lg:inline-flex"
          >
            <Link href="/documentation" title={t("documentation")}>
              <BookOpen className="size-6" />
              <span className="sr-only">{t("documentation")}</span>
            </Link>
          </Button>

          {/* Language Switcher */}
          {/* <div className="hidden lg:block"> */}
          <div className="">
            <LanguageSwitcher />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Bell - Hidden on mobile */}
          <div className="hidden md:block">
            <NotificationsBell />
          </div>

          {/* Create Menu */}
          <CreateMenu />

          {/* User Activity Sidebar (Sign In / Profile) - Always visible */}
          <div className="pl-[10px]">
            <UserActivitySidebar />
          </div>
        </div>
      </div>

      {/* Mobile Search - Below header on small screens */}
      <div className="px-3 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

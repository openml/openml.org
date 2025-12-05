import Image from "next/image";
import { BookOpen, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { SearchBar } from "@/components/header/search-bar";
import { LanguageSwitcher } from "@/components/header/language-switcher";
import { NotificationsBell } from "@/components/header/notifications-bell";
import { AccountMenu } from "@/components/header/account-menu";
import { CreateMenu } from "@/components/header/create-menu";

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-24 items-center gap-4">
          {/* Logo - Left */}
          <Image
            src="/logo_openML_light-bkg.png"
            alt="OpenML"
            width={180}
            height={60}
            className="size-18 w-auto dark:hidden"
            priority
          />
          <Image
            src="/logo_openML_dark-bkg.png"
            alt="OpenML"
            width={180}
            height={60}
            className="hidden size-18 w-auto dark:block"
            priority
          />

          {/* Search Bar - Middle (flexible) */}
          <div className="mx-6 hidden flex-1 md:flex">
            <SearchBar />
          </div>

          {/* Action Icons - Right */}
          <div className="flex items-center gap-1">
            {/* Documentation */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden h-9 w-9 lg:inline-flex"
            >
              <a
                href="https://docs.openml.org"
                target="_blank"
                rel="noopener noreferrer"
                title="Documentation"
              >
                <BookOpen className="h-5 w-5" />
                <span className="sr-only">Documentation</span>
              </a>
            </Button>

            {/* Language Switcher */}
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* Create Menu */}
            <CreateMenu />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="hidden md:block">
              <NotificationsBell />
            </div>

            {/* Account Menu */}
            <AccountMenu />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <span className="text-sm">☰</span>
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search - Below header on small screens */}
        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

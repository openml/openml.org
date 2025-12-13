"use client";

import Image from "next/image";
import { Link, usePathname } from "@/config/routing";
import { BookOpen, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { SearchBar } from "@/components/header/search-bar";
import { LanguageSwitcher } from "@/components/header/language-switcher";
import { NotificationsBell } from "@/components/header/notifications-bell";
import { UserActivitySidebar } from "@/components/layout/user-activity-sidebar";
import { CreateMenu } from "@/components/header/create-menu";
import { useSidebar } from "@/contexts/sidebar-context";

export function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const {
    homeMenuOpen,
    setHomeMenuOpen,
    setHomeMenuIconOnly,
    burgerClicked,
    setBurgerClicked,
  } = useSidebar();

  const handleMenuClick = () => {
    if (isHomePage) {
      setHomeMenuOpen(true);
      setHomeMenuIconOnly(false); // Open full menu
      setBurgerClicked(true); // Mark as clicked, will hide burger
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#eaeff5]/95 text-slate-800 shadow-sm">
      <div className="flex h-24 items-center gap-8 pr-4 md:pr-6">
        {/* Logo - Left aligned with sidebar, centered within 256px */}
        <div className="flex w-64 shrink-0 items-center justify-center">
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
        </div>

        {/* Search Bar - Middle (flexible) */}
        <div className="hidden flex-1 md:flex">
          <SearchBar />
        </div>

        {/* Action Icons - Right */}
        <div className="mr-[1%] flex items-center gap-4">
          {/* Documentation */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden size-10 cursor-pointer text-slate-700 hover:bg-slate-300 hover:text-slate-900 lg:inline-flex"
          >
            <a
              href="https://docs.openml.org"
              target="_blank"
              rel="noopener noreferrer"
              title={t("documentation")}
            >
              <BookOpen className="size-6" />
              <span className="sr-only">{t("documentation")}</span>
            </a>
          </Button>

          {/* Language Switcher */}
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Bell */}
          <NotificationsBell />

          {/* Create Menu */}
          <div className="pl-[10px]">
            <CreateMenu />
          </div>

          {/* User Activity Sidebar */}
          <UserActivitySidebar />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-700 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            <span className="text-sm">☰</span>
            <span className="sr-only">{t("menu")}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search - Below header on small screens */}
      <div className="pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

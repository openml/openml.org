"use client";

import { usePathname } from "@/config/routing"; // Use localized usePathname
import { Link } from "@/config/routing"; // Use localized Link
import NextLink from "next/link"; // For routes outside localized config
import { useTranslations } from "next-intl";
import { cn, abbreviateNumber } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ChevronDown,
  ChevronRight,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  ExternalLink,
  User as UserIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navItems, type NavItem } from "@/constants";
import Image from "next/image";
import { useSidebar } from "@/contexts/sidebar-context";

// Helper to check if a string is a valid URL
const isValidUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== "string" || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { isCollapsed, setIsCollapsed, homeMenuOpen, setHomeMenuOpen } =
    useSidebar();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { data: session, status } = useSession();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    initials: string;
  } | null>(null);
  const t = useTranslations("sidebar");

  // Load user from NextAuth session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const firstName =
        (session.user as { firstName?: string }).firstName || "";
      const lastName = (session.user as { lastName?: string }).lastName || "";
      const name =
        session.user.name ||
        `${firstName} ${lastName}`.trim() ||
        (session.user as any).username ||
        session.user.email?.split("@")[0] ||
        "User";
      const email = session.user.email || "";
      const avatar = session.user.image || "";

      // Calculate initials safely
      let initials = "OP";
      if (firstName && lastName) {
        initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
      } else if (name && name.length > 0) {
        const nameParts = name.split(" ").filter((n: string) => n.length > 0);
        if (nameParts.length >= 2) {
          initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
          initials = nameParts[0].substring(0, 2).toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length === 1) {
          initials = nameParts[0][0].toUpperCase();
        }
      }
      // Use queueMicrotask to avoid cascading render warning
      queueMicrotask(() => {
        setUser({ name, email, avatar, initials });
      });
    }
  }, [status, session]);

  // Fetch entity counts on mount
  useEffect(() => {
    fetch("/api/count")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const countsMap = data.reduce(
            (
              acc: Record<string, number>,
              item: { index: string; count: number },
            ) => {
              acc[item.index] = item.count;
              return acc;
            },
            {},
          );
          setCounts(countsMap);
        } else {
          console.warn(
            "⚠️ API returned non-array data, counts unavailable:",
            data,
          );
        }
      })
      .catch((error) => {
        console.warn(
          "⚠️ Could not fetch entity counts (sidebar will work without them):",
          error.message,
        );
      });
  }, []);

  // Render mobile/tablet unified menu (< 1024px for all pages, all sizes for homepage)
  const renderUnifiedMenu = () => (
    <>
      {/* Overlay when menu is open */}
      {homeMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-700/20"
          onClick={() => setHomeMenuOpen(false)}
        />
      )}

      {/* Unified Sidebar - Mobile/Tablet */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen flex-col bg-[#233044] transition-all duration-300 ease-in-out",
          isHomePage
            ? homeMenuOpen
              ? "w-64"
              : "w-0"
            : homeMenuOpen
              ? "w-64 lg:hidden"
              : "w-0 lg:hidden",
        )}
      >
        {/* Logo Header - Only show when menu is open */}
        {homeMenuOpen && (
          <div className="relative flex min-h-40 shrink-0 items-start justify-center bg-[#233044] py-6">
            <Link
              href="/"
              className="group flex w-64 items-center justify-center"
              onClick={() => setHomeMenuOpen(false)}
            >
              <Image
                src="/logo_openML_dark-bkg.png"
                alt="OpenML Logo"
                width={140}
                height={70}
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                style={{
                  animation: "logoFadeScale 0.4s ease-out 0.2s both",
                }}
              />
            </Link>
          </div>
        )}

        {/* Navigation - Only show when menu is open */}
        {homeMenuOpen && (
          <ScrollArea className="-mt-4 flex-1 overflow-auto pb-4">
            <div className="space-y-6 px-3 pb-8">
              {/* User Profile Section - Mobile Only */}
              <div className="border-b border-slate-600 pb-4 lg:hidden">
                {user && (
                  <div className="flex items-center gap-3 rounded-lg bg-slate-700/30 p-3">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500">
                      {isValidUrl(user.avatar) ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="gradient-bg flex size-full items-center justify-center">
                          <span className="text-base font-semibold text-white">
                            {user.initials}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {navItems.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-1.5 px-3 text-sm font-semibold tracking-tight text-gray-400 uppercase">
                    {t(section.titleKey)}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <SidebarItem
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        counts={counts}
                        t={t}
                        iconOnly={false}
                        onItemClick={() => setHomeMenuOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* User Menu Items - Mobile Only */}
              {user && (
                <div className="border-t border-slate-600 pt-4 lg:hidden">
                  <h4 className="mb-1.5 px-3 text-sm font-semibold tracking-tight text-gray-400 uppercase">
                    Account
                  </h4>
                  <div className="space-y-1">
                    <NextLink
                      href="/profile"
                      onClick={() => setHomeMenuOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-slate-700/50 hover:text-white"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>My Profile</span>
                    </NextLink>
                    <NextLink
                      href="/settings"
                      onClick={() => setHomeMenuOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-slate-700/50 hover:text-white"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </NextLink>
                    <button
                      onClick={() => {
                        setHomeMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-slate-700/50 hover:text-white"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );

  // Homepage: Always show unified menu
  if (isHomePage) {
    return renderUnifiedMenu();
  }

  // Other pages: Show unified menu on mobile (< 1024px) + desktop sidebar
  return (
    <>
      {/* Mobile/Tablet Unified Menu (< 1024px) */}
      <div className="lg:hidden">{renderUnifiedMenu()}</div>

      {/* Desktop Sidebar (>= 1024px) */}
      <div
        className={cn(
          "fixed top-0 left-0 z-100 hidden h-screen border-r-0 bg-[#233044] transition-all duration-300 ease-in-out lg:flex lg:shrink-0 lg:flex-col",
          isCollapsed ? "lg:w-12" : "lg:w-64",
        )}
      >
        {/* Logo Header */}
        <div className="relative flex min-h-40 items-center justify-center bg-[#233044] pb-6">
          {!isCollapsed && (
            <Link href="/" className="group flex items-center justify-center">
              <Image
                src="/logo_openML_dark-bkg.png"
                alt="OpenML Logo"
                width={140}
                height={70}
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                style={{
                  animation: "logoFadeScale 0.4s ease-out 0.2s both",
                }}
              />
            </Link>
          )}

          {/* Collapse Button */}
          <Button
            variant="openml"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="border-tr-2 border-br-2 hover:border[#233044] hover:text-[#233044 absolute top-24 -right-4.5 size-9 -translate-y-1/2 rounded-full border-slate-300 bg-[#233044] text-slate-300 hover:bg-slate-300 hover:text-[#1E2A38]"
          >
            {!isCollapsed ? (
              <ArrowLeftFromLine className="size-6" />
            ) : (
              <ArrowRightFromLine className="size-6" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="-mt-4 flex-1 overflow-auto">
          <div className={cn("space-y-6 pb-8", isCollapsed ? "px-1" : "px-3")}>
            {navItems.map((section) => (
              <div key={section.title}>
                {!isCollapsed && (
                  <h4 className="mb-1.5 px-3 text-sm font-semibold tracking-tight text-gray-400 uppercase">
                    {t(section.titleKey)}
                  </h4>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      counts={counts}
                      t={t}
                      iconOnly={isCollapsed}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

function SidebarItem({
  item,
  pathname,
  counts,
  t,
  iconOnly = false,
  onItemClick,
}: {
  item: NavItem;
  pathname: string;
  counts?: Record<string, number>;
  t: (key: string) => string;
  iconOnly?: boolean;
  onItemClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const count = item.index && counts ? counts[item.index] : null;
  const countText = count ? abbreviateNumber(count) : "";
  const isExternal =
    item.href.startsWith("http://") || item.href.startsWith("https://");

  if (iconOnly) {
    // Icon-only mode
    if (isExternal) {
      return (
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={cn(
            "w-full text-gray-200 hover:bg-[#1E2A38] hover:text-white",
            isActive && "bg-[#1E2A38] font-medium text-white",
          )}
          title={t(item.titleKey)}
        >
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onItemClick}
          >
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                className="h-7 w-7"
                style={{ color: item.color }}
              />
            )}
          </a>
        </Button>
      );
    }

    return (
      <Button
        asChild
        variant="ghost"
        size="icon"
        className={cn(
          "w-full text-gray-200 hover:bg-[#1E2A38] hover:text-white",
          isActive && "bg-[#1E2A38] font-medium text-white",
        )}
        title={t(item.titleKey)}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link href={item.href as any} onClick={onItemClick}>
          {item.icon && (
            <FontAwesomeIcon
              icon={item.icon}
              className="h-7 w-7"
              style={{ color: item.color }}
            />
          )}
        </Link>
      </Button>
    );
  }

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between px-3 text-gray-200 hover:bg-[#1E2A38] hover:text-white",
            isActive && "bg-[#1E2A38] font-medium text-white",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                className="h-5 w-5"
                style={{ color: item.color, width: "20px" }}
              />
            )}
            <span className="text-sm">{t(item.titleKey)}</span>
          </span>
          <span className="flex items-center gap-2">
            {countText && (
              <span className="text-xs text-gray-400">{countText}</span>
            )}
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        </Button>
        {isOpen && (
          <div className="ml-6 space-y-1 border-l border-gray-600 pl-2">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.href}
                item={child}
                pathname={pathname}
                counts={counts}
                t={t}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isExternal) {
    return (
      <Button
        asChild
        variant="ghost"
        className={cn(
          "w-full justify-start px-3 text-gray-200 hover:bg-[#1E2A38] hover:text-white",
          isActive && "bg-[#1E2A38] font-medium text-white",
        )}
      >
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between"
          onClick={onItemClick}
        >
          <span className="flex items-center">
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                className="mr-2 h-5 w-5"
                style={{ color: item.color, width: "20px" }}
              />
            )}
            <span className="text-sm">{t(item.titleKey)}</span>
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            {countText && (
              <span className="text-xs text-gray-400">{countText}</span>
            )}
            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
          </span>
        </a>
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start px-3 text-gray-200 hover:bg-[#1E2A38] hover:text-white",
        isActive && "bg-[#1E2A38] font-medium text-white",
      )}
    >
      <Link
        href={item.href as any}
        className="flex items-center justify-between"
        onClick={onItemClick}
      >
        <span className="flex items-center">
          {item.icon && (
            <FontAwesomeIcon
              icon={item.icon}
              className="mr-2 h-5 w-5"
              style={{ color: item.color, width: "20px" }}
            />
          )}
          <span className="text-sm">{t(item.titleKey)}</span>
        </span>
        {countText && (
          <span className="ml-auto text-xs text-gray-400">{countText}</span>
        )}
      </Link>
    </Button>
  );
}

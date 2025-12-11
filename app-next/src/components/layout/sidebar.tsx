"use client";

import { usePathname } from "@/config/routing"; // Use localized usePathname
import { Link } from "@/config/routing"; // Use localized Link
import { useTranslations } from "next-intl";
import { cn, abbreviateNumber } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ChevronDown,
  ChevronRight,
  ArrowRightFromLine,
  ArrowLeftFromLine,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navItems, type NavItem } from "@/constants";
import Image from "next/image";
import { useSidebar } from "@/contexts/sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const {
    isCollapsed,
    setIsCollapsed,
    homeMenuOpen,
    homeMenuIconOnly,
    setHomeMenuIconOnly,
  } = useSidebar();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const t = useTranslations("sidebar");

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

  // Homepage: Different behavior
  if (isHomePage) {
    return (
      <>
        {/* Overlay when menu is open */}
        {homeMenuOpen && !homeMenuIconOnly && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setHomeMenuIconOnly(true)}
          />
        )}

        {/* Homepage Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-screen bg-[#233044] transition-all duration-300 ease-in-out",
            homeMenuIconOnly ? "w-12" : "w-64",
          )}
        >
          {/* Logo Header */}
          <div className="relative flex min-h-40 items-start justify-center bg-[#233044] py-6">
            {!homeMenuIconOnly && (
              <Link
                href="/"
                className="group flex w-64 items-center justify-center"
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
            )}

            {homeMenuIconOnly && (
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  src="/openML_logo_mini-sidebar.png"
                  alt="OpenML Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            )}

            {/* Toggle Button - Arrow to open/close */}
            <Button
              variant="openml"
              size="icon"
              onClick={() => setHomeMenuIconOnly(!homeMenuIconOnly)}
              className="border-tr-2 border-br-2 hover:border[#233044] hover:text-[#233044 absolute top-24 -right-4.5 size-9 -translate-y-1/2 rounded-full border-slate-300 bg-[#233044] text-slate-300 hover:bg-slate-300 hover:text-[#1E2A38]"
            >
              {!homeMenuIconOnly ? (
                <ArrowLeftFromLine className="size-6" />
              ) : (
                <ArrowRightFromLine className="size-6" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="-mt-4 flex-1 pb-4">
            <div
              className={cn("space-y-6", homeMenuIconOnly ? "px-1" : "px-3")}
            >
              {navItems.map((section) => (
                <div key={section.title}>
                  {!homeMenuIconOnly && (
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
                        iconOnly={homeMenuIconOnly}
                        onItemClick={() => {
                          if (!homeMenuIconOnly) {
                            setHomeMenuIconOnly(true);
                          }
                        }}
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

  // Regular pages: Normal sidebar
  return (
    <>
      {/* Full sidebar */}
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

          {isCollapsed && (
            <div className="-mt-12 flex h-12 w-12 items-start justify-center">
              <Image
                src="/openML_logo_mini-sidebar.png"
                alt="OpenML Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
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
        <ScrollArea className="-mt-4 flex-1 pb-4">
          <div className={cn("space-y-6", isCollapsed ? "px-1" : "px-3")}>
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

  if (iconOnly) {
    // Icon-only mode
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

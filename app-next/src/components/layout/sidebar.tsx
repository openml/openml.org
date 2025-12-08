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
  const { isCollapsed, setIsCollapsed } = useSidebar();
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
          // Don't show error to user, just use empty counts
        }
      })
      .catch((error) => {
        console.warn(
          "⚠️ Could not fetch entity counts (sidebar will work without them):",
          error.message,
        );
        // Sidebar still works, just without count badges
      });
  }, []);

  return (
    <>
      {/* Full sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-100 hidden h-screen border-r-0 bg-[#233044] transition-all duration-300 ease-in-out lg:flex lg:w-64 lg:shrink-0 lg:flex-col",
          isHomePage && "!hidden",
          isCollapsed && "-translate-x-[calc(100%-22px)]",
        )}
      >
        {/* Logo Header */}
        <div className="relative flex min-h-40 items-center justify-center bg-[#233044] pb-6">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo_openML_dark-bkg.png"
              alt="OpenML Logo"
              width={200}
              height={100}
              className="object-contain"
            />
          </Link>

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
          <div className="space-y-6 px-3">
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
}: {
  item: NavItem;
  pathname: string;
  counts?: Record<string, number>;
  t: (key: string) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const count = item.index && counts ? counts[item.index] : null;
  const countText = count ? abbreviateNumber(count) : "";

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
                className="h-4 w-4"
                style={{ color: item.color, width: "16px" }}
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
      >
        <span className="flex items-center">
          {item.icon && (
            <FontAwesomeIcon
              icon={item.icon}
              className="mr-2 h-4 w-4"
              style={{ color: item.color, width: "16px" }}
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

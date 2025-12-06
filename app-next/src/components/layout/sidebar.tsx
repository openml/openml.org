"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, abbreviateNumber } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navItems, type NavItem, entityColors } from "@/constants";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Fetch entity counts on mount
  useEffect(() => {
    console.log("🔍 Sidebar: Fetching counts from /api/count");
    fetch("/api/count")
      .then((response) => {
        console.log("📡 Sidebar: Received response:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("📊 Sidebar: Received data:", data);
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
          console.log("✅ Sidebar: Counts map:", countsMap);
          setCounts(countsMap);
        } else {
          console.error("❌ Expected array but got:", data);
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching counts:", error);
      });
  }, []);

  return (
    <>
      {/* Collapsed state - only show expand button */}
      {isCollapsed && !isHomePage && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="fixed top-2 left-2 z-100 h-8 w-8 rounded-full border border-gray-600 bg-[#233044] text-gray-200 hover:bg-[#1E2A38] hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Full sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-100 hidden h-screen border-r-0 bg-[#233044] transition-all duration-300 ease-in-out lg:flex lg:w-64 lg:shrink-0 lg:flex-col",
          isHomePage && "-translate-x-full",
          isCollapsed && "-translate-x-full",
        )}
      >
        {/* Logo Header */}
        <div className="relative flex min-h-40 items-center justify-center bg-[#233044] px-6 py-8">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo_openML_dark-bkg.png"
              alt="OpenML Logo"
              width={108}
              height={108}
              className="object-contain"
            />
          </Link>

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-gray-600 bg-[#1E2A38] text-gray-200 hover:bg-[#1E2A38] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-6 px-3">
            {navItems.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 px-3 text-xs font-semibold tracking-tight text-gray-400 uppercase">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      counts={counts}
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
}: {
  item: NavItem;
  pathname: string;
  counts?: Record<string, number>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const count = item.index && counts ? counts[item.index] : null;
  const countText = count ? abbreviateNumber(count) : "";

  console.log(`🔢 SidebarItem "${item.title}":`, {
    index: item.index,
    count,
    countText,
    hasCounts: !!counts,
    countsKeys: counts ? Object.keys(counts) : [],
  });

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
            <span className="text-sm">{item.title}</span>
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
      <Link href={item.href} className="flex items-center justify-between">
        <span className="flex items-center">
          {item.icon && (
            <FontAwesomeIcon
              icon={item.icon}
              className="mr-2 h-4 w-4"
              style={{ color: item.color, width: "16px" }}
            />
          )}
          <span className="text-sm">{item.title}</span>
        </span>
        {countText && (
          <span className="ml-auto text-xs text-gray-400">{countText}</span>
        )}
      </Link>
    </Button>
  );
}

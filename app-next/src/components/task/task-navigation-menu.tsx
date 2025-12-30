"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Grid3x3,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Settings,
  Database,
  Info,
  Trophy,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TaskNavigationMenuProps {
  runCount: number;
}

export function TaskNavigationMenu({ runCount }: TaskNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items for "On This Page" - kggl style
  const pageNavItems = [
    { id: "configuration", label: "Configuration", icon: Settings },
    { id: "dataset", label: "Source Dataset", icon: Database },
    { id: "information", label: "Information", icon: Info },
    { id: "analysis", label: "Leaderboard", icon: Trophy },
    {
      id: "runs",
      label: "Runs",
      icon: FlaskConical,
      count: runCount,
    },
  ];

  return (
    <>
      {/* Mobile/Tablet: Floating Menu Button */}
      <div className="fixed right-6 bottom-6 z-50 xl:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="bg-amber-600 text-white shadow-lg hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
        >
          {isOpen ? (
            <X className="mr-2 h-5 w-5" />
          ) : (
            <Menu className="mr-2 h-5 w-5" />
          )}
          {isOpen ? "Close" : "On This Page"}
        </Button>
      </div>

      {/* Mobile/Tablet: Slide-out Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 xl:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="bg-background fixed top-0 right-0 z-50 h-full w-80 overflow-y-auto p-6 shadow-xl xl:hidden">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">On This Page</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-1">
              {pageNavItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/30"
                >
                  <item.icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.count.toLocaleString()}
                    </Badge>
                  )}
                </a>
              ))}
            </nav>

            {/* Navigation Links */}
            <div className="mt-8 border-t pt-6">
              <h4 className="mb-3 text-sm font-medium">Navigation</h4>
              <nav className="space-y-1">
                <Link
                  href="/tasks"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Link>
                <Link
                  href="/tasks"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <Grid3x3 className="h-4 w-4" />
                  All Tasks
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Desktop: Sticky Sidebar */}
      <aside
        className={`hidden shrink-0 transition-all duration-300 xl:block ${
          isCollapsed ? "w-12" : "w-64"
        }`}
      >
        <div className="sticky top-32 space-y-4">
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-0 -left-3 z-10 h-6 w-6 rounded-full border bg-white p-0 shadow-sm dark:bg-gray-800"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>

          {isCollapsed ? (
            /* Collapsed: Icon-only navigation */
            <div className="space-y-2 pt-6">
              {pageNavItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-amber-600 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          ) : (
            /* Expanded: Full navigation */
            <>
              {/* Table of Contents - Task amber color */}
              <div className="rounded-sm border-l-2 border-amber-500/40 bg-amber-50/70 p-4 dark:bg-amber-950/20">
                <h3 className="mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  On This Page
                </h3>
                <nav className="space-y-1">
                  {pageNavItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-amber-600 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-auto px-1.5 py-0 text-xs"
                        >
                          {item.count.toLocaleString()}
                        </Badge>
                      )}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Navigation Links */}
              <div className="bg-background/40 rounded-sm border-l-2 p-4">
                <h3 className="text-foreground mb-3 text-sm font-semibold">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  <Link
                    href="/tasks"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                  </Link>
                  <Link
                    href="/tasks"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    All Tasks
                  </Link>
                </nav>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

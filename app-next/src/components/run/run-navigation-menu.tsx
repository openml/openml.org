"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Settings2,
  FileText,
  Tags,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  FlaskConical,
  LineChart,
  Grid3x3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RunNavigationMenuProps {
  hasMetrics: boolean;
  hasParameters: boolean;
  hasTags?: boolean;
  hasSetup: boolean;
  hasAnalyses?: boolean;
  metricsCount: number;
  parametersCount: number;
  tagsCount?: number;
}

export function RunNavigationMenu({
  hasMetrics,
  hasParameters,
  hasTags,
  hasSetup,
  hasAnalyses,
  metricsCount,
  parametersCount,
  tagsCount,
}: RunNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items for "On This Page"
  const pageNavItems = [
    ...(hasMetrics
      ? [
          {
            id: "metrics",
            label: "Evaluation Metrics",
            icon: BarChart3,
            count: metricsCount,
          },
        ]
      : []),
    ...(hasAnalyses
      ? [
          {
            id: "analyses",
            label: "Analyses",
            icon: LineChart,
          },
        ]
      : []),
    ...(hasParameters
      ? [
          {
            id: "parameters",
            label: "Parameters",
            icon: Settings2,
            count: parametersCount,
          },
        ]
      : []),
    ...(hasTags
      ? [
          {
            id: "tags",
            label: "Tags",
            icon: Tags,
            count: tagsCount,
          },
        ]
      : []),
    ...(hasSetup
      ? [
          {
            id: "setup",
            label: "Setup",
            icon: FileText,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile/Tablet: Floating Menu Button */}
      <div className="fixed right-6 bottom-6 z-50 xl:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="bg-red-500 text-white shadow-lg hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
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

          {/* Slide-out Panel */}
          <div className="bg-background fixed top-0 right-0 bottom-0 z-50 w-80 shadow-2xl xl:hidden">
            <div className="flex h-full flex-col overflow-y-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Table of Contents */}
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-red-500 dark:text-red-400">
                    On This Page
                  </h3>
                  <nav className="space-y-1">
                    {pageNavItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        <span className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        {item.count !== undefined && item.count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.count.toLocaleString()}
                          </Badge>
                        )}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Navigation Links */}
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                  <h3 className="text-foreground mb-3 text-sm font-semibold">
                    Quick Links
                  </h3>
                  <nav className="space-y-1">
                    <Link
                      href="/runs"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Search
                    </Link>
                    <Link
                      href="/runs"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      <Grid3x3 className="h-4 w-4" />
                      All Runs
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop: Fixed Navigation with Collapse/Expand */}
      <aside
        className={`hidden transition-all duration-300 xl:block ${
          isCollapsed ? "w-12" : "w-72"
        } shrink-0`}
      >
        {isCollapsed ? (
          // Collapsed: Show only expand button
          <div className="absolute top-8 right-0">
            <Button
              onClick={() => setIsCollapsed(false)}
              variant="outline"
              size="icon"
              className="bg-background hover:bg-accent shadow-md"
              title="Expand navigation"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          // Expanded: Show full navigation
          <div className="absolute top-8 right-0 max-h-[calc(100vh-12rem)] w-72 space-y-4 overflow-y-auto">
            {/* Collapse Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setIsCollapsed(true)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Collapse navigation"
              >
                <ChevronRight className="mr-1 h-4 w-4" />
                Hide
              </Button>
            </div>

            {/* Table of Contents */}
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-red-500 dark:text-red-400">
                On This Page
              </h3>
              <nav className="space-y-1">
                {pageNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.count !== undefined && item.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.count.toLocaleString()}
                      </Badge>
                    )}
                  </a>
                ))}
              </nav>
            </div>

            {/* Navigation Links */}
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                Navigation
              </h3>
              <nav className="space-y-1">
                <Link
                  href="/runs"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Link>
                <Link
                  href="/runs"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <FlaskConical className="h-4 w-4" />
                  All Runs
                </Link>
              </nav>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

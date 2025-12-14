"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Info,
  Database,
  ArrowLeft,
  Grid3x3,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatasetNavigationMenuProps {
  hasFeatures: boolean;
  hasQualities: boolean;
  featuresCount?: number;
}

export function DatasetNavigationMenu({
  hasFeatures,
  hasQualities,
  featuresCount = 0,
}: DatasetNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile/Tablet: Floating Menu Button */}
      <div className="fixed right-6 bottom-6 z-50 xl:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="bg-green-600 text-white shadow-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
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
                  <h3 className="mb-3 text-sm font-semibold text-green-600 dark:text-green-400">
                    On This Page
                  </h3>
                  <nav className="space-y-1">
                    <a
                      href="#description"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      <Database className="h-4 w-4" />
                      Description
                    </a>
                    <a
                      href="#information"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      <Info className="h-4 w-4" />
                      Information
                    </a>
                    {hasFeatures && (
                      <a
                        href="#features"
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        <BarChart3 className="h-4 w-4 rotate-90" />
                        Features ({featuresCount})
                      </a>
                    )}
                    {hasQualities && (
                      <a
                        href="#qualities"
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Qualities
                      </a>
                    )}
                  </nav>
                </div>

                {/* Navigation Links */}
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                  <h3 className="text-foreground mb-3 text-sm font-semibold">
                    Quick Links
                  </h3>
                  <nav className="space-y-1">
                    <Link
                      href="/datasets"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Search
                    </Link>
                    <Link
                      href="/datasets"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      <Grid3x3 className="h-4 w-4" />
                      All Datasets
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
              <h3 className="mb-3 text-sm font-semibold text-green-600 dark:text-green-400">
                On This Page
              </h3>
              <nav className="space-y-1">
                <a
                  href="#description"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <Database className="h-4 w-4" />
                  Description
                </a>
                <a
                  href="#information"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <Info className="h-4 w-4" />
                  Information
                </a>
                {hasFeatures && (
                  <a
                    href="#features"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <BarChart3 className="h-4 w-4 rotate-90" />
                    Features ({featuresCount})
                  </a>
                )}
                {hasQualities && (
                  <a
                    href="#qualities"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Qualities
                  </a>
                )}
              </nav>
            </div>

            {/* Navigation Links */}
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                Navigation
              </h3>
              <nav className="space-y-1">
                <Link
                  href="/datasets"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Link>
                <Link
                  href="/datasets"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <Grid3x3 className="h-4 w-4" />
                  All Datasets
                </Link>
              </nav>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

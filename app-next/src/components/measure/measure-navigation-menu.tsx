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
  FileText,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";

interface MeasureNavigationMenuProps {
  relatedTaskCount: number;
  measureType: string;
}

const MEASURE_TYPE_ROUTES: Record<string, { href: string; label: string }> = {
  evaluation_measure: { href: "/measures/evaluation", label: "Evaluation Measures" },
  data_quality: { href: "/measures/data", label: "Data Quality Measures" },
  estimation_procedure: { href: "/measures/procedures", label: "Estimation Procedures" },
};

export function MeasureNavigationMenu({
  relatedTaskCount,
  measureType,
}: MeasureNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const backRoute = MEASURE_TYPE_ROUTES[measureType] || {
    href: "/measures/evaluation",
    label: "All Measures",
  };

  const pageNavItems = [
    { id: "description", label: "Description", icon: FileText },
    {
      id: "related-tasks",
      label: "Related Tasks",
      icon: Flag,
      count: relatedTaskCount,
    },
  ];

  const violet = entityColors.measures;

  return (
    <>
      {/* Mobile: Floating Menu Button */}
      <div className="fixed right-6 bottom-6 z-50 xl:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="text-white shadow-lg"
          style={{ backgroundColor: violet }}
        >
          {isOpen ? (
            <X className="mr-2 h-5 w-5" />
          ) : (
            <Menu className="mr-2 h-5 w-5" />
          )}
          {isOpen ? "Close" : "On This Page"}
        </Button>
      </div>

      {/* Mobile: Slide-out Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 xl:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="bg-background fixed top-0 right-0 bottom-0 z-50 w-80 shadow-2xl xl:hidden">
            <div className="flex h-full flex-col overflow-y-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: violet }}>Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                  <h3
                    className="mb-3 text-sm font-semibold"
                    style={{ color: violet }}
                  >
                    On This Page
                  </h3>
                  <nav className="space-y-1">
                    {pageNavItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setIsOpen(false)}
                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        {item.count !== undefined && item.count > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            {item.count.toLocaleString()}
                          </Badge>
                        )}
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold" style={{ color: violet }}>
                    Quick Links
                  </h3>
                  <nav className="space-y-1">
                    <Link
                      href={backRoute.href}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {backRoute.label}
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop: Fixed Navigation */}
      <aside
        className={`hidden transition-all duration-300 xl:block ${
          isCollapsed ? "w-12" : "w-72"
        } shrink-0`}
      >
        {isCollapsed ? (
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
          <div className="absolute top-8 right-0 max-h-[calc(100vh-12rem)] w-72 space-y-4 overflow-y-auto">
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
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <h3
                className="mb-3 text-sm font-semibold"
                style={{ color: violet }}
              >
                On This Page
              </h3>
              <nav className="space-y-1">
                {pageNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.count !== undefined && item.count > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.count.toLocaleString()}
                      </Badge>
                    )}
                  </a>
                ))}
              </nav>
            </div>
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold" style={{ color: violet }}>
                Quick Links
              </h3>
              <nav className="space-y-1">
                <Link
                  href={backRoute.href}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backRoute.label}
                </Link>
                <Link
                  href="/search?type=measure"
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <Grid3x3 className="h-4 w-4" />
                  All Measures
                </Link>
              </nav>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

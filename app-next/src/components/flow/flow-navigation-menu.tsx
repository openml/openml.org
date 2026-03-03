"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  FileText,
  Settings2,
  History,
  BarChart3,
  Network,
  Cpu,
  LucideIcon,
} from "lucide-react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS, entityColors } from "@/constants";
interface FlowNavigationMenuProps {
  runCount?: number;
  parametersCount?: number;
  componentsCount?: number;
  versionsCount?: number;
  hasDependencies?: boolean;
}

type NavItem =
  | {
      id: string;
      label: string;
      icon: LucideIcon;
      type: "lucide";
      count?: number;
      href?: string;
    }
  | {
      id: string;
      label: string;
      icon: IconDefinition;
      type: "fontawesome";
      count?: number;
      href?: string;
    };

export function FlowNavigationMenu({
  runCount = 0,
  parametersCount = 0,
  componentsCount = 0,
  versionsCount = 0,
  hasDependencies = false,
}: FlowNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items for "On This Page"
  const pageNavItems: NavItem[] = [
    {
      id: "description",
      label: "Description",
      icon: FileText,
      type: "lucide" as const,
    },
    ...(runCount > 0
      ? [
          {
            id: "analysis",
            label: "Analyse",
            icon: BarChart3,
            type: "lucide" as const,
          },
        ]
      : []),
    ...(hasDependencies
      ? [
          {
            id: "dependencies",
            label: "Dependencies",
            icon: Network, // Better than Cog
            type: "lucide" as const,
          },
        ]
      : []),
    ...(parametersCount > 0
      ? [
          {
            id: "parameters",
            label: `Parameters (${parametersCount})`,
            icon: Settings2,
            type: "lucide" as const,
          },
        ]
      : []),
    ...(componentsCount > 0
      ? [
          {
            id: "components",
            label: `Components (${componentsCount})`,
            icon: Cpu, // Better than Cog
            type: "lucide" as const,
          },
        ]
      : []),
    ...(versionsCount > 1
      ? [
          {
            id: "versions",
            label: `Versions (${versionsCount})`,
            icon: History,
            type: "lucide" as const,
          },
        ]
      : []),
    {
      id: "runs",
      label: "Runs",
      icon: ENTITY_ICONS.run,
      type: "fontawesome" as const,
    },
  ];

  // Additional sections
  const sectionNavItems: NavItem[] = [
    {
      id: "all-runs",
      label: "All Runs",
      icon: ENTITY_ICONS.run,
      type: "fontawesome" as const,
      count: runCount,
      href: "#runs",
    },
  ];

  return (
    <>
      {/* Mobile/Tablet: Floating Menu Button */}
      <div className="fixed right-6 bottom-6 z-50 xl:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="text-white shadow-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: entityColors.flow }}
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
                <div
                  className="rounded-lg border p-4 shadow-sm transition-colors"
                  style={{
                    borderColor: `${entityColors.flow}40`,
                    backgroundColor: `${entityColors.flow}10`,
                  }}
                >
                  <h3
                    className="mb-3 text-sm font-semibold"
                    style={{ color: entityColors.flow }}
                  >
                    On This Page
                  </h3>
                  <nav className="space-y-1">
                    {pageNavItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setIsOpen(false)}
                        className="text-foreground/80 hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <span>
                          {item.type === "fontawesome" ? (
                            <FontAwesomeIcon
                              icon={item.icon}
                              className="h-4 w-4"
                            />
                          ) : (
                            <item.icon className="h-4 w-4" />
                          )}
                        </span>
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  {/* Section divider */}
                  <div className="border-border my-3 border-t" />

                  {/* Additional Sections */}
                  <nav className="space-y-1">
                    {sectionNavItems.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-foreground/80 hover:text-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <span className="flex items-center gap-2">
                          <span>
                            {item.type === "fontawesome" ? (
                              <FontAwesomeIcon
                                icon={item.icon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <item.icon className="h-4 w-4" />
                            )}
                          </span>
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
                <div
                  className="rounded-lg border p-4 shadow-sm"
                  style={{
                    borderColor: `${entityColors.flow}40`,
                    backgroundColor: `${entityColors.flow}05`, // very light
                  }}
                >
                  <h3 className="text-foreground mb-3 text-sm font-semibold">
                    Quick Links
                  </h3>
                  <nav className="space-y-1">
                    <Link
                      href="/flows"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Search
                    </Link>
                    <Link
                      href="/flows"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                    >
                      <span>
                        <FontAwesomeIcon
                          icon={ENTITY_ICONS.flow}
                          className="h-4 w-4"
                        />
                      </span>
                      All Flows
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
        className={`hidden shrink-0 transition-all duration-300 xl:block ${
          isCollapsed ? "w-12" : "w-72"
        }`}
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
          <div className="absolute top-8 right-0 max-h-[calc(100vh-12rem)] w-72 space-y-4 overflow-y-auto pr-4">
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
            <div
              className="rounded-lg border p-4 shadow-sm transition-colors"
              style={{
                borderColor: `${entityColors.flow}40`,
                backgroundColor: `${entityColors.flow}10`,
              }}
            >
              <h3
                className="mb-3 text-sm font-semibold"
                style={{ color: entityColors.flow }}
              >
                On This Page
              </h3>
              <nav className="space-y-1">
                {pageNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-foreground/80 hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <span>
                      {item.type === "fontawesome" ? (
                        <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                      ) : (
                        <item.icon className="h-4 w-4" />
                      )}
                    </span>
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Section divider */}
              <div className="border-border my-3 border-t" />

              {/* Additional Sections */}
              <nav className="space-y-1">
                {sectionNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <span>
                        {item.type === "fontawesome" ? (
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="h-4 w-4"
                          />
                        ) : (
                          <item.icon className="h-4 w-4" />
                        )}
                      </span>
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
            <div
              className="rounded-lg border p-4 shadow-sm"
              style={{
                borderColor: `${entityColors.flow}40`,
                backgroundColor: `${entityColors.flow}05`,
              }}
            >
              <h3 className="mb-3 text-sm font-semibold text-[#2f65cb]">
                Navigation
              </h3>
              <nav className="space-y-1">
                <Link
                  href="/flows"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Link>
                <Link
                  href="/flows"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                >
                  <span>
                    <FontAwesomeIcon
                      icon={ENTITY_ICONS.flow}
                      className="h-4 w-4"
                    />
                  </span>
                  All Flows
                </Link>
              </nav>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

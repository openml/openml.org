"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export interface SearchTab {
  label: string;
  /** Absolute path without locale prefix, e.g. "/collections/tasks" */
  path: string;
}

/**
 * Tab strip that switches between sub-pages while preserving the ?q= query.
 * Must be rendered inside a <Suspense> boundary when used from a server component.
 */
export function SearchTabs({
  tabs,
  accentColor,
}: {
  tabs: SearchTab[];
  accentColor: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Strip locale prefix so /en/collections/tasks → /collections/tasks
  const effectivePath = pathname.replace(/^\/[a-z]{2}\//, "/");
  const q = searchParams.get("q");

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <nav className="flex" aria-label="Sub-navigation">
          {tabs.map((tab) => {
            const isActive = effectivePath === tab.path;
            const href = q ? `${tab.path}?q=${encodeURIComponent(q)}` : tab.path;
            return (
              <Link
                key={tab.path}
                href={href}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? ""
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                style={isActive ? { borderColor: accentColor, color: accentColor } : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

"use client";

import { BarChart3, Settings2, FileText } from "lucide-react";

interface RunNavigationMenuProps {
  hasMetrics: boolean;
  hasParameters: boolean;
  hasSetup: boolean;
  metricsCount: number;
  parametersCount: number;
}

export function RunNavigationMenu({
  hasMetrics,
  hasParameters,
  hasSetup,
  metricsCount,
  parametersCount,
}: RunNavigationMenuProps) {
  return (
    <aside className="hidden lg:block lg:w-64">
      <nav className="sticky top-20 space-y-2">
        <h2 className="mb-4 text-sm font-semibold">On this page</h2>

        {hasMetrics && (
          <a
            href="#metrics"
            className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm"
          >
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span>Evaluation Metrics</span>
            <span className="text-muted-foreground ml-auto text-xs">
              {metricsCount}
            </span>
          </a>
        )}

        {hasParameters && (
          <a
            href="#parameters"
            className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm"
          >
            <Settings2 className="h-4 w-4 text-gray-500" />
            <span>Parameters</span>
            <span className="text-muted-foreground ml-auto text-xs">
              {parametersCount}
            </span>
          </a>
        )}

        {hasSetup && (
          <a
            href="#setup"
            className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm"
          >
            <FileText className="h-4 w-4 text-gray-500" />
            <span>Setup</span>
          </a>
        )}
      </nav>
    </aside>
  );
}

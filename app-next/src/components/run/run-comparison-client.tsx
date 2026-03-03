"use client";

import { useState } from "react";
import { Table2, BarChart3 } from "lucide-react";
import { RunComparisonTable } from "./run-comparison-table";
import { RunComparisonChart } from "./run-comparison-chart";
import type { RunDetail } from "@/lib/api/run";

type Tab = "table" | "chart";

interface RunComparisonClientProps {
  runs: RunDetail[];
}

export function RunComparisonClient({ runs }: RunComparisonClientProps) {
  const [tab, setTab] = useState<Tab>("table");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-lg border p-1">
        <button
          onClick={() => setTab("table")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "table"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Table2 className="h-4 w-4" />
          Metric Table
        </button>
        <button
          onClick={() => setTab("chart")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "chart"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Visual Compare
        </button>
      </div>

      {/* Content */}
      {tab === "table" && <RunComparisonTable runs={runs} />}
      {tab === "chart" && <RunComparisonChart runs={runs} />}
    </div>
  );
}

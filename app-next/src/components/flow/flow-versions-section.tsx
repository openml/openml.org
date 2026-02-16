"use client";

import Link from "next/link";
import { GitBranch, Calendar, Hash, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Flow } from "@/types/flow";

interface FlowVersionsSectionProps {
  currentFlowId: number;
  versions: Flow[];
}

export function FlowVersionsSection({
  currentFlowId,
  versions,
}: FlowVersionsSectionProps) {
  if (versions.length <= 1) {
    return (
      <div className="text-muted-foreground py-6 text-center">
        No other versions found for this flow.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-muted-foreground border-b text-xs font-semibold tracking-wider uppercase">
              <th className="px-4 py-2 text-left">Version</th>
              <th className="px-4 py-2 text-left">Upload Date</th>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {versions.map((v) => {
              const isCurrent = v.flow_id === currentFlowId;
              const uploadDate =
                v.upload_date || v.date
                  ? new Date(v.upload_date || v.date!).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : "N/A";

              return (
                <tr
                  key={v.flow_id}
                  className={`transition-colors ${
                    isCurrent
                      ? "bg-blue-50/30 dark:bg-blue-900/10"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <GitBranch
                        className={`h-4 w-4 ${
                          isCurrent ? "text-blue-500" : "text-muted-foreground"
                        }`}
                      />
                      {isCurrent ? (
                        <span className="font-semibold text-blue-600">
                          v.{v.version} (Current)
                        </span>
                      ) : (
                        <Link
                          href={`/flows/${v.flow_id}`}
                          className="font-medium hover:text-blue-600 hover:underline"
                        >
                          v.{v.version}
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {uploadDate}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Hash className="text-muted-foreground h-3 w-3" />
                      {v.flow_id}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isCurrent && (
                      <Badge className="border-green-200 bg-green-100 text-green-700 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" />
                        Viewing
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

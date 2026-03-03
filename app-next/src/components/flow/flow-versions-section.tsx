"use client";

import Link from "next/link";
import { GitBranch, Calendar, Hash, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Flow } from "@/types/flow";
import { entityColors } from "@/constants/entityColors";

interface FlowVersionsSectionProps {
  currentFlowId: number;
  versions: Flow[];
}

export function FlowVersionsSection({
  currentFlowId,
  versions,
}: FlowVersionsSectionProps) {
  if (!versions || versions.length === 0) {
    return null;
  }

  // Sort versions by version number descending (assuming string comparison works or parse float)
  // Or trust the order provided by API if already sorted.
  // Standard string sort for versions "1.0", "2.0" works often, but "10.0" comes before "2.0".
  // Better to rely on API order or simple sort.

  const sortedVersions = [...versions].sort((a, b) => {
    // Try numeric sort
    const vA = parseFloat(a.version);
    const vB = parseFloat(b.version);
    if (!isNaN(vA) && !isNaN(vB)) {
      return vB - vA;
    }
    // Fallback to string sort
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
          <tr>
            <th className="px-4 py-3 font-semibold">Version</th>
            <th className="px-4 py-3 font-semibold">Uploaded</th>
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 text-right font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {sortedVersions.map((v) => {
            const isCurrent = v.flow_id === currentFlowId;
            const uploadDate = v.upload_date
              ? new Date(v.upload_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown date";

            return (
              <tr
                key={v.flow_id}
                className={`group transition-colors ${
                  isCurrent ? "bg-muted/30" : "hover:bg-muted/50"
                }`}
              >
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <GitBranch
                      className="h-4 w-4"
                      style={{
                        color: isCurrent ? entityColors.flow : "currentColor",
                        opacity: isCurrent ? 1 : 0.5,
                      }}
                    />
                    {isCurrent ? (
                      <span
                        className="font-semibold"
                        style={{ color: entityColors.flow }}
                      >
                        v.{v.version} (Current)
                      </span>
                    ) : (
                      <Link
                        href={`/flows/${v.flow_id}`}
                        className="font-medium transition-colors hover:underline"
                        style={
                          {
                            // Use neutral text by default, color on hover?
                            // Or standard link blue?
                            // If adhering to entity colors "everywhere", highlighting link with entity color makes sense on hover.
                          }
                        }
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
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {v.flow_id}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {isCurrent && (
                    <Badge
                      variant="outline"
                      className="bg-opacity-10 gap-1 border-current"
                      style={{
                        color: entityColors.flow,
                        backgroundColor: `${entityColors.flow}1a`, // 10% opacity,
                        borderColor: `${entityColors.flow}40`,
                      }}
                    >
                      <Check className="h-3 w-3" />
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
  );
}

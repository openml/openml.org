"use client";

import Link from "next/link";
import { Cog, ChevronRight } from "lucide-react";
import type { Flow } from "@/types/flow";

interface FlowComponentsSectionProps {
  flow: Flow;
}

export function FlowComponentsSection({ flow }: FlowComponentsSectionProps) {
  const components = flow.components?.component || [];

  if (components.length === 0) {
    return (
      <div className="text-muted-foreground py-6 text-center">
        This flow has no sub-components.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-muted-foreground border-b text-xs font-semibold tracking-wider uppercase">
              <th className="px-4 py-2 text-left">Identifier</th>
              <th className="px-4 py-2 text-left">Flow Name</th>
              <th className="px-4 py-2 text-left">Version</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {components.map((comp, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium">
                  {comp.identifier}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Cog className="h-4 w-4 text-blue-500" />
                    <span>{comp.flow.name}</span>
                  </div>
                </td>
                <td className="text-muted-foreground px-4 py-3 text-sm">
                  v.{comp.flow.version}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/flows/${comp.flow.flow_id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    View Details
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Flow } from "@/types/flow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS, entityColors } from "@/constants";

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

  // Ensure unique keys by filtering duplicates if necessary or trusting API
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
          <tr>
            <th className="px-4 py-3 font-semibold">Component</th>
            <th className="px-4 py-3 font-semibold">Version</th>
            <th className="px-4 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {components.map((comp, i) => (
            <tr
              key={`${comp.identifier}-${i}`}
              className="group hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <div style={{ color: entityColors.flow }}>
                    <FontAwesomeIcon
                      icon={ENTITY_ICONS.flow}
                      className="h-4 w-4"
                    />
                  </div>
                  <span>{comp.flow.name}</span>
                </div>
              </td>
              <td className="text-muted-foreground px-4 py-3 text-sm">
                v.{comp.flow.version}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/flows/${comp.flow.flow_id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
                  style={{ color: entityColors.flow }}
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
  );
}

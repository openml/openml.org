"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Flow } from "@/types/flow";

interface FlowParametersSectionProps {
  flow: Flow;
}

export function FlowParametersSection({ flow }: FlowParametersSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const parameters = flow.parameter || [];

  // Show first 10 by default
  const displayedParams = expanded ? parameters : parameters.slice(0, 10);
  const hasMore = parameters.length > 10;

  if (parameters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider uppercase">
                Description
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider uppercase">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider uppercase">
                Default Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {displayedParams.map((param, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-sm">{param.name}</td>
                <td className="text-muted-foreground px-4 py-3 text-sm">
                  {param.description || "—"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    {param.data_type}
                  </code>
                </td>
                <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                  {param.default_value || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" />
                Show {parameters.length - 10} More Parameters
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

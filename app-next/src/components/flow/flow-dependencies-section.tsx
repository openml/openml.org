import React from "react";
import type { Flow } from "@/types/flow";

interface FlowDependenciesSectionProps {
  flow: Flow;
}

export function FlowDependenciesSection({
  flow,
}: FlowDependenciesSectionProps) {
  // Parse dependencies if it's a string
  const dependencies = flow.dependencies
    ? typeof flow.dependencies === "string"
      ? flow.dependencies.split(",").map((dep) => {
          const [name, version] = dep.trim().split("_");
          return { name, version: version || "N/A" };
        })
      : []
    : [];

  if (dependencies.length === 0) {
    return (
      <div className="text-muted-foreground py-6 text-center">
        No dependencies listed for this flow.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="text-muted-foreground border-b text-xs font-semibold tracking-wider uppercase">
            <th className="px-4 py-2 text-left">Library</th>
            <th className="px-4 py-2 text-left">Version</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {dependencies.map((dep, idx) => (
            <tr key={idx} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-2 text-sm font-medium">{dep.name}</td>
              <td className="text-muted-foreground px-4 py-2 text-sm italic">
                {dep.version}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

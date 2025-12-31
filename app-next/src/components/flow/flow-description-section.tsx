import Link from "next/link";
import type { Flow } from "@/types/flow";

interface FlowDescriptionSectionProps {
  flow: Flow;
}

export function FlowDescriptionSection({ flow }: FlowDescriptionSectionProps) {
  // Parse dependencies if it's a string
  const dependencies = flow.dependencies
    ? typeof flow.dependencies === "string"
      ? flow.dependencies.split(",").map((dep) => {
          const [name, version] = dep.trim().split("_");
          return { name, version: version || "N/A" };
        })
      : []
    : [];

  return (
    <div className="space-y-6" id="description">
      {/* Description */}
      {flow.description && (
        <div className="bg-card text-card-foreground rounded-lg p-1">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {flow.description}
          </p>
        </div>
      )}
    </div>
  );
}

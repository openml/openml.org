"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface EndpointCardProps {
  method: HTTPMethod;
  endpoint: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required?: boolean;
    description: string;
  }[];
  response?: string;
  className?: string;
}

const methodColors: Record<HTTPMethod, string> = {
  GET: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  POST: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  PUT: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  DELETE: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  PATCH:
    "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
};

export function EndpointCard({
  method,
  endpoint,
  description,
  parameters,
  response,
  className,
}: EndpointCardProps) {
  return (
    <div
      className={cn(
        "group bg-card hover:border-primary/30 rounded-lg border transition-all hover:shadow-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-4">
        <Badge
          variant="outline"
          className={cn("font-mono", methodColors[method])}
        >
          {method}
        </Badge>
        <code className="text-foreground text-sm font-medium">{endpoint}</code>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <p className="text-muted-foreground text-sm">{description}</p>

        {/* Parameters */}
        {parameters && parameters.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Parameters</h4>
            <div className="space-y-2">
              {parameters.map((param) => (
                <div
                  key={param.name}
                  className="bg-muted/50 flex items-start gap-2 rounded-md p-2"
                >
                  <code className="text-primary text-xs font-medium">
                    {param.name}
                  </code>
                  <Badge variant="secondary" className="text-[10px]">
                    {param.type}
                  </Badge>
                  {param.required && (
                    <Badge variant="destructive" className="text-[10px]">
                      required
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-xs">
                    {param.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Response</h4>
            <pre className="overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100 dark:bg-slate-900">
              <code>{response}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

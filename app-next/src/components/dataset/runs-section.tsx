"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Loader2,
  ExternalLink,
  Calendar,
  FileJson,
  FileCode,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS } from "@/constants/entityIcons";
import { entityTailwindColors } from "@/constants/entityColors";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { cn } from "@/lib/utils";
import type { Dataset } from "@/types/dataset";

interface RunsSectionProps {
  dataset: Dataset;
  runCount: number;
}

interface Run {
  run_id: number;
  task_id: number;
  flow_id: number;
  uploader_id: number;
  uploader_name: string;
  upload_time: string;
  error_message?: string;
  flow_name?: string;
}

// Get initials from name (first letter of first and last name)
function getInitials(name: string): string {
  if (!name || name === "Unknown") return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * RunsSection Component
 *
 * Displays runs related to this dataset in a collapsible section.
 */
export function RunsSection({ dataset, runCount }: RunsSectionProps) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRuns() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/dataset/${dataset.data_id}/runs?limit=10`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch runs");
        }
        const data = await response.json();

        if (data?.runs) {
          // Map ES response to Run interface
          const runsArray: Run[] = data.runs.map(
            (run: {
              run_id: string | number;
              run_flow?: { flow_id: string | number; name?: string };
              run_task?: { task_id: string | number };
              uploader?: string;
              uploader_id?: number;
              date?: string;
            }) => ({
              run_id: Number(run.run_id),
              flow_id: Number(run.run_flow?.flow_id || 0),
              flow_name: run.run_flow?.name || `Flow #${run.run_flow?.flow_id}`,
              task_id: Number(run.run_task?.task_id || 0),
              uploader_id: run.uploader_id || 0,
              uploader_name: run.uploader || "Unknown",
              upload_time: run.date || "",
            }),
          );

          setRuns(runsArray);
        }
      } catch (error) {
        console.error("Failed to load runs:", error);
      } finally {
        setLoading(false);
      }
    }

    if (runCount > 0) {
      loadRuns();
    }
  }, [dataset.data_id, runCount]);

  if (runCount === 0) {
    return null;
  }

  return (
    <CollapsibleSection
      id="runs"
      title="Runs"
      description="Machine learning experiments performed on this dataset"
      icon={
        <FontAwesomeIcon
          icon={ENTITY_ICONS.run}
          className={cn("h-4 w-4", entityTailwindColors.run.text)}
        />
      }
      badge={runCount}
      defaultOpen={false}
    >
      <div className="space-y-4 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : runs.length > 0 ? (
          <>
            {/* Runs list */}
            <div className="divide-y rounded-lg border">
              {runs.map((run) => (
                <Link
                  key={run.run_id}
                  href={`/runs/${run.run_id}`}
                  className="hover:bg-muted/50 flex items-center gap-3 p-3 transition-colors"
                >
                  <Avatar className="h-8 w-8 border border-gray-600">
                    <AvatarImage
                      src={`https://www.openml.org/img/${run.uploader_id}`}
                      alt={run.uploader_name}
                    />
                    <AvatarFallback className="bg-gray-100 text-xs font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      {getInitials(run.uploader_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={ENTITY_ICONS.flow}
                        className={cn(
                          "h-3 w-3",
                          entityTailwindColors.flow.text,
                        )}
                      />
                      <span className="truncate text-sm font-medium">
                        {run.flow_name}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <FontAwesomeIcon
                        icon={ENTITY_ICONS.task}
                        className={cn(
                          "h-3 w-3",
                          entityTailwindColors.task.text,
                        )}
                      />
                      <span>Task #{run.task_id}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(run.upload_time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Run #{run.run_id}
                  </Badge>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No runs found for this dataset
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/runs?data_id=${dataset.data_id}`}>
              <FontAwesomeIcon
                icon={ENTITY_ICONS.run}
                className="mr-2 h-4 w-4"
              />
              View all {runCount.toLocaleString()} runs
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Runs API
                <ChevronRight className="ml-1 h-4 w-4 rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a
                  href={`https://www.openml.org/api/v1/json/run/list/data_id/${dataset.data_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                  <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`https://www.openml.org/api/v1/xml/run/list/data_id/${dataset.data_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <FileCode className="mr-2 h-4 w-4" />
                  XML
                  <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CollapsibleSection>
  );
}

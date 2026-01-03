"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Loader2,
  ExternalLink,
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
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { cn } from "@/lib/utils";
import type { Dataset } from "@/types/dataset";

interface TasksSectionProps {
  dataset: Dataset;
  taskCount: number;
}

interface Task {
  task_id: number;
  task_type_id: number;
  task_type: string;
  status: string;
  estimation_procedure?: {
    type: string;
  };
}

/**
 * TasksSection Component
 *
 * Displays tasks related to this dataset in a collapsible section.
 */
export function TasksSection({ dataset, taskCount }: TasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/dataset/${dataset.data_id}/tasks?limit=10`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();

        if (data?.tasks?.task) {
          const tasksArray: Task[] = Array.isArray(data.tasks.task)
            ? data.tasks.task
            : [data.tasks.task];
          setTasks(tasksArray);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    if (taskCount > 0) {
      loadTasks();
    }
  }, [dataset.data_id, taskCount]);

  if (taskCount === 0) {
    return null;
  }

  // Map task type IDs to names
  const getTaskTypeName = (typeId: number) => {
    const types: Record<number, string> = {
      1: "Supervised Classification",
      2: "Supervised Regression",
      3: "Learning Curve",
      4: "Supervised Data Stream Classification",
      5: "Clustering",
      6: "Machine Learning Challenge",
      7: "Survival Analysis",
      8: "Subgroup Discovery",
    };
    return types[typeId] || `Type ${typeId}`;
  };

  return (
    <CollapsibleSection
      id="tasks"
      title="Tasks"
      description="Machine learning tasks defined on this dataset"
      icon={
        <FontAwesomeIcon
          icon={ENTITY_ICONS.task}
          className={cn("h-4 w-4", entityTailwindColors.task.text)}
        />
      }
      badge={taskCount}
      defaultOpen={false}
    >
      <div className="space-y-4 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : tasks.length > 0 ? (
          <>
            {/* Tasks list */}
            <div className="divide-y rounded-lg border">
              {tasks.map((task) => (
                <Link
                  key={task.task_id}
                  href={`/tasks/${task.task_id}`}
                  className="hover:bg-muted/50 flex items-center justify-between p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={ENTITY_ICONS.task}
                      className={cn("h-4 w-4", entityTailwindColors.task.text)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Task #{task.task_id}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {getTaskTypeName(task.task_type_id)}
                        </Badge>
                      </div>
                      {task.estimation_procedure?.type && (
                        <p className="text-muted-foreground text-xs">
                          {task.estimation_procedure.type}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No tasks found for this dataset
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks?data_id=${dataset.data_id}`}>
              <FontAwesomeIcon
                icon={ENTITY_ICONS.task}
                className="mr-2 h-4 w-4"
              />
              View all {taskCount} tasks
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Tasks API
                <ChevronRight className="ml-1 h-4 w-4 rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a
                  href={`https://www.openml.org/api/v1/json/task/list/data_id/${dataset.data_id}`}
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
                  href={`https://www.openml.org/api/v1/xml/task/list/data_id/${dataset.data_id}`}
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

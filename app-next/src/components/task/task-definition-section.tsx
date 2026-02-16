"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Settings, Trophy, FileJson } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskDefinitionSectionProps {
  task: Task;
}

export function TaskDefinitionSection({ task }: TaskDefinitionSectionProps) {
  // Extract key details
  const targetFeature =
    task.target_feature || task.input?.source_data?.data_set?.target_feature;

  const estimationType =
    task.estimation_procedure?.type || task.input?.estimation_procedure?.type;

  const estimationParams =
    task.estimation_procedure?.parameters ||
    task.input?.estimation_procedure?.parameters ||
    {};

  // Handle evaluation measures (could be array or nested object depending on API version)
  let metrics: string[] = [];
  if (Array.isArray(task.evaluation_measures)) {
    metrics = task.evaluation_measures;
  } else if (task.input?.evaluation_measures?.evaluation_measure) {
    const measure = task.input.evaluation_measures.evaluation_measure;
    if (Array.isArray(measure)) {
      metrics = measure;
    } else if (typeof measure === "string") {
      metrics = [measure];
    }
  }

  // Cost Matrix (if available)
  const hasCostMatrix = task.cost_matrix && task.cost_matrix.length > 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Target & Type */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold">Target & Type</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Target Feature
              </p>
              <p className="text-lg font-medium">
                {targetFeature || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Task Type
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline">
                  {task.tasktype?.name || task.task_type}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  (ID: {task.task_type_id})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimation Procedure */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
              <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold">Estimation Procedure</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Method
              </p>
              <p className="text-lg font-medium">
                {estimationType || "Not specified"}
              </p>
            </div>

            {Object.keys(estimationParams).length > 0 && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-medium">
                  Parameters
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(estimationParams).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 rounded p-2 text-sm">
                      <span className="text-muted-foreground block text-xs font-medium uppercase">
                        {key}
                      </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Metrics */}
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">Evaluation Metrics</h3>
          </div>

          <div className="space-y-4">
            {metrics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {metrics.map((metric) => (
                  <Badge
                    key={metric}
                    variant="secondary"
                    className="py-1 text-sm"
                  >
                    {metric}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No specific evaluation metrics defined.
              </p>
            )}

            {hasCostMatrix && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileJson className="text-muted-foreground h-4 w-4" />
                  <h4 className="text-sm font-medium">Cost Matrix</h4>
                </div>
                <div className="bg-muted overflow-x-auto rounded-md p-4">
                  <pre className="text-xs">
                    {JSON.stringify(task.cost_matrix, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

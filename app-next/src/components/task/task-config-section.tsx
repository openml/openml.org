"use client";

import { Settings, Target, Clock, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/task";

interface TaskConfigSectionProps {
  task: Task;
}

/**
 * TaskConfigSection Component
 *
 * Displays task configuration details in a clean card layout.
 * Similar to Dataset's metadata section.
 */
export function TaskConfigSection({ task }: TaskConfigSectionProps) {
  const taskType = task.tasktype?.name || task.task_type || "Unknown Task Type";
  const taskTypeDescription = task.tasktype?.description;
  const targetFeature =
    task.target_feature || task.input?.source_data?.data_set?.target_feature;
  const estimation =
    task.estimation_procedure?.type || task.input?.estimation_procedure?.type;
  const estimationParams =
    task.estimation_procedure?.parameters ||
    task.input?.estimation_procedure?.parameters;

  // Normalize evaluationMeasures to always be an array
  const rawMeasures =
    task.evaluation_measures ||
    task.input?.evaluation_measures?.evaluation_measure;
  const evaluationMeasures: string[] = Array.isArray(rawMeasures)
    ? rawMeasures
    : rawMeasures
      ? [String(rawMeasures)]
      : [];

  return (
    <section id="configuration" className="scroll-mt-20">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5 text-orange-500" />
            Task Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Task Type */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Task Type
              </p>
              <p className="text-lg font-semibold">{taskType}</p>
              {taskTypeDescription && (
                <p className="text-muted-foreground text-sm">
                  {taskTypeDescription}
                </p>
              )}
            </div>

            {/* Target Feature */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Target Feature
              </p>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                <p className="text-lg font-semibold">
                  {targetFeature || "Not specified"}
                </p>
              </div>
            </div>

            {/* Estimation Procedure */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Estimation Procedure
              </p>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <p className="text-lg font-semibold">
                  {estimation || "Not specified"}
                </p>
              </div>
              {estimationParams && Object.keys(estimationParams).length > 0 && (
                <div className="text-muted-foreground mt-2 space-y-0.5 text-sm">
                  {Object.entries(estimationParams).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Evaluation Measures */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Evaluation Measures
              </p>
              {evaluationMeasures.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {evaluationMeasures.map((measure, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      <BarChart3 className="mr-1 h-3 w-3" />
                      {measure}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Not specified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

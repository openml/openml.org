"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle, AlertCircle, Clock, Info } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";

const ESTIMATION_PROCEDURES: Record<string, { id: string; label: string }[]> = {
  classification: [
    { id: "1", label: "10-fold Crossvalidation" },
    { id: "2", label: "5 times 2-fold Crossvalidation" },
    { id: "3", label: "10 times 10-fold Crossvalidation" },
    { id: "4", label: "Leave-One-Out" },
    { id: "16", label: "Holdout (66% train / 34% test)" },
    { id: "6", label: "10-fold Learning Curve" },
  ],
  regression: [
    { id: "1", label: "10-fold Crossvalidation" },
    { id: "2", label: "5 times 2-fold Crossvalidation" },
    { id: "3", label: "10 times 10-fold Crossvalidation" },
    { id: "16", label: "Holdout (66% train / 34% test)" },
  ],
  learningcurve: [
    { id: "13", label: "10-fold Learning Curve" },
    { id: "14", label: "10 times 10-fold Learning Curve" },
  ],
  supervised: [{ id: "1", label: "10-fold Crossvalidation" }],
  clustering: [],
};

const EVALUATION_MEASURES: Record<string, string[]> = {
  classification: [
    "predictive_accuracy",
    "area_under_roc_curve",
    "f_measure",
    "kappa",
    "precision",
    "recall",
    "matthews_correlation_coefficient",
    "mean_absolute_error",
  ],
  regression: [
    "mean_absolute_error",
    "root_mean_squared_error",
    "mean_squared_error",
    "relative_absolute_error",
    "root_relative_squared_error",
  ],
  learningcurve: ["predictive_accuracy", "area_under_roc_curve"],
  supervised: ["predictive_accuracy"],
  clustering: [],
};

export function TaskCreateForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [taskType, setTaskType] = useState("classification");
  const [datasetId, setDatasetId] = useState("");
  const [targetName, setTargetName] = useState("");
  const [evaluationMeasure, setEvaluationMeasure] = useState("");
  const [estimationProcedure, setEstimationProcedure] = useState("1");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingTaskId, setExistingTaskId] = useState<string | null>(null);
  const [datasetStatus, setDatasetStatus] = useState<string | null>(null);
  const [datasetFeatures, setDatasetFeatures] = useState<
    { name: string; dataType: string }[]
  >([]);
  const [isFetchingDataset, setIsFetchingDataset] = useState(false);

  useEffect(() => {
    if (!datasetId || isNaN(Number(datasetId))) {
      setDatasetStatus(null);
      setDatasetFeatures([]);
      setIsFetchingDataset(false);
      return;
    }
    setIsFetchingDataset(true);
    const timer = setTimeout(async () => {
      try {
        const base = APP_CONFIG.openmlApiUrl || "https://www.openml.org";
        const [infoRes, featRes] = await Promise.all([
          fetch(`${base}/api/v1/json/data/${datasetId}`),
          fetch(`${base}/api/v1/json/data/features/${datasetId}`),
        ]);
        if (infoRes.ok) {
          const json = await infoRes.json();
          setDatasetStatus(json?.["data_set_description"]?.status ?? null);
        } else {
          setDatasetStatus(null);
        }
        if (featRes.ok) {
          const json = await featRes.json();
          const features: { name: string; dataType: string }[] = (
            json?.["data_features"]?.["feature"] ?? []
          )
            .filter(
              (f: { is_ignore: string; is_row_identifier: string }) =>
                f.is_ignore !== "true" && f.is_row_identifier !== "true",
            )
            .map((f: { name: string; data_type: string }) => ({
              name: f.name,
              dataType: f.data_type,
            }));
          setDatasetFeatures(features);
        } else {
          setDatasetFeatures([]);
        }
      } catch {
        setDatasetStatus(null);
        setDatasetFeatures([]);
      } finally {
        setIsFetchingDataset(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [datasetId]);

  const validTargetFeatures = useMemo(() => {
    if (datasetFeatures.length === 0) return [];
    if (taskType === "regression") {
      const numeric = datasetFeatures.filter((f) => f.dataType === "numeric");
      return numeric.length > 0 ? numeric : datasetFeatures;
    }
    // classification, learningcurve, supervised: nominal/string features only
    const nominal = datasetFeatures.filter((f) => f.dataType !== "numeric");
    return nominal.length > 0 ? nominal : datasetFeatures;
  }, [datasetFeatures, taskType]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isClustering = taskType === "clustering";
    if (!datasetId || !taskType || (!targetName && !isClustering)) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!session) {
      setError("You must be signed in to create a task.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setExistingTaskId(null);

    try {
      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_type: taskType,
          dataset_id: parseInt(datasetId),
          target_name: targetName || undefined,
          estimation_procedure: estimationProcedure || undefined,
          evaluation_measure: evaluationMeasure || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const idMatch = data.error?.match(/matched id\(s\): \[(\d+)\]/);
        if (idMatch) {
          setExistingTaskId(idMatch[1]);
        } else {
          setError(data.error || "Failed to create task. Please try again.");
        }
        return;
      }

      router.push(`/tasks/${data.id}`);
      router.refresh();
    } catch (_err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <PlusCircle className="text-primary h-6 w-6" />
          Define Task
        </CardTitle>
        <CardDescription>
          Create a new machine learning task for an existing dataset.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {existingTaskId && (
            <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle>Task already exists</AlertTitle>
              <AlertDescription>
                This exact task configuration already exists.{" "}
                <a
                  href={`/tasks/${existingTaskId}`}
                  className="font-medium underline underline-offset-2"
                >
                  View task {existingTaskId} →
                </a>
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="taskType">Task Type *</Label>
              <Select
                value={taskType}
                onValueChange={(v) => {
                  setTaskType(v);
                  setTargetName("");
                  setEvaluationMeasure("");
                  setEstimationProcedure("1");
                }}
              >
                <SelectTrigger id="taskType">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classification">Supervised Classification</SelectItem>
                  <SelectItem value="regression">Supervised Regression</SelectItem>
                  <SelectItem value="learningcurve">Learning Curve</SelectItem>
                  <SelectItem value="clustering">Clustering</SelectItem>
                  <SelectItem value="supervised">Supervised</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="datasetId">Dataset ID *</Label>
              <Input
                id="datasetId"
                type="number"
                placeholder="e.g. 128"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                required
              />
              {datasetStatus === "in_preparation" ? (
                <p className="flex items-center gap-1.5 text-sm text-amber-600">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  This dataset is still being processed by OpenML. Tasks can
                  only be created once the dataset is <strong>active</strong>.
                  Please try again in a few minutes.
                </p>
              ) : datasetStatus === "active" ? (
                <p className="text-muted-foreground text-sm">
                  Dataset is active and ready for tasks.
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  The ID of the dataset to use for this task.
                </p>
              )}
            </div>

            {taskType !== "clustering" && (
              <div className="space-y-2">
                <Label htmlFor="targetName">Target Feature *</Label>
                {validTargetFeatures.length > 0 ? (
                  <select
                    id="targetName"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    required
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <option value="">Select a column...</option>
                    {validTargetFeatures.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="targetName"
                    placeholder="e.g. class"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    required
                  />
                )}
                <p className="text-muted-foreground text-sm">
                  {validTargetFeatures.length > 0
                    ? `${validTargetFeatures.length} valid target column${validTargetFeatures.length === 1 ? "" : "s"} available (${taskType === "regression" ? "numeric" : "nominal"}).`
                    : "The name of the target attribute (column) to predict."}
                </p>
              </div>
            )}

            {(ESTIMATION_PROCEDURES[taskType]?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <Label htmlFor="estimationProcedure">
                  Estimation Procedure *
                </Label>
                <select
                  id="estimationProcedure"
                  value={estimationProcedure}
                  onChange={(e) => setEstimationProcedure(e.target.value)}
                  required
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {ESTIMATION_PROCEDURES[taskType].map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <p className="text-muted-foreground text-sm">
                  How to split the data for evaluation.
                </p>
              </div>
            )}

            {(EVALUATION_MEASURES[taskType]?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <Label htmlFor="evaluationMeasure">Evaluation Measure</Label>
                <select
                  id="evaluationMeasure"
                  value={evaluationMeasure}
                  onChange={(e) => setEvaluationMeasure(e.target.value)}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <option value="">None (optional)</option>
                  {EVALUATION_MEASURES[taskType].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <p className="text-muted-foreground text-sm">
                  Optional. Evaluation metric for this task.
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 flex justify-between border-t pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isLoading ||
              isFetchingDataset ||
              datasetStatus === "in_preparation"
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

"use client";

import { useState } from "react";
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
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";

export function TaskCreateForm() {
  const { data: _session } = useSession();
  const router = useRouter();

  const [taskType, setTaskType] = useState("classification");
  const [datasetId, setDatasetId] = useState("");
  const [targetName, setTargetName] = useState("");
  const [evaluationMeasure, setEvaluationMeasure] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetId || !targetName || !taskType) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      // const payload = {
      //   task_type: taskType,
      //   dataset_id: parseInt(datasetId),
      //   target_name: targetName,
      //   evaluation_measure: evaluationMeasure
      // };

      // await fetch("/api/tasks/create", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload)
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock delay

      router.push("/tasks");
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
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger id="taskType">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regression">RegressionTask</SelectItem>
                  <SelectItem value="classification">
                    ClassificationTask
                  </SelectItem>
                  <SelectItem value="clustering">ClusteringTask</SelectItem>
                  <SelectItem value="learningcurve">
                    LearningCurveTask
                  </SelectItem>
                  <SelectItem value="supervised">SupervisedTask</SelectItem>
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
              <p className="text-muted-foreground text-sm">
                The ID of the dataset to use for this task.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetName">Target Feature *</Label>
              <Input
                id="targetName"
                placeholder="e.g. class"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                required
              />
              <p className="text-muted-foreground text-sm">
                The name of the target attribute (column) to predict.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluationMeasure">Evaluation Measure</Label>
              <Input
                id="evaluationMeasure"
                placeholder="e.g. predictive_accuracy"
                value={evaluationMeasure}
                onChange={(e) => setEvaluationMeasure(e.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                Optional. Specific evaluation metric to optimize for.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 flex justify-between border-t pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
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

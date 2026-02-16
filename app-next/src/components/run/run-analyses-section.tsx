"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, Download, Table2, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PredictionRow {
  row_id: number;
  fold: number;
  repeat: number;
  prediction: string | number;
  correct: string | number;
  confidence?: Record<string, number>;
}

interface ConfusionMatrixData {
  actual: string;
  predicted: string;
  count: number;
}

interface RunAnalysesSectionProps {
  runId: number;
  taskId?: number;
}

export function RunAnalysesSection({ runId }: RunAnalysesSectionProps) {
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [confusionMatrix, setConfusionMatrix] = useState<ConfusionMatrixData[]>(
    [],
  );
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("confusion");

  useEffect(() => {
    async function fetchPredictions() {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_URL_API || "https://www.openml.org/api/v1";

        // Fetch predictions from OpenML API
        const response = await fetch(`${apiUrl}/json/run/${runId}`, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch run data");
        }

        const data = await response.json();
        const run = data.run;

        // Check if predictions file exists in output_data
        if (run?.output_data?.file) {
          const predictionFile = run.output_data.file.find(
            (f: { name: string }) => f.name === "predictions",
          );

          if (predictionFile?.url) {
            // Use proxy to avoid CORS issues
            const proxyUrl = `/api/proxy-file?url=${encodeURIComponent(predictionFile.url)}`;
            const predResponse = await fetch(proxyUrl);
            if (predResponse.ok) {
              const predText = await predResponse.text();
              const parsedPredictions = parsePredictions(predText);
              setPredictions(parsedPredictions);

              // Build confusion matrix from predictions
              const { matrix, uniqueClasses } =
                buildConfusionMatrix(parsedPredictions);
              setConfusionMatrix(matrix);
              setClasses(uniqueClasses);
            }
          }
        }

        // If no predictions file, try to build from evaluation data
        if (predictions.length === 0 && run?.output_data?.evaluation) {
          const confMatrixEval = run.output_data.evaluation.find(
            (e: { name: string }) => e.name === "confusion_matrix",
          );
          if (confMatrixEval?.array_data) {
            // Parse confusion matrix from evaluation
            const parsed = parseConfusionMatrixFromEval(
              confMatrixEval.array_data,
            );
            setConfusionMatrix(parsed.matrix);
            setClasses(parsed.classes);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch predictions:", err);
        setError("Could not load predictions data");
        setLoading(false);
      }
    }

    fetchPredictions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  // Parse ARFF-style predictions
  function parsePredictions(text: string): PredictionRow[] {
    const lines = text.split("\n");
    const predictions: PredictionRow[] = [];
    let inData = false;

    for (const line of lines) {
      if (line.trim().toLowerCase() === "@data") {
        inData = true;
        continue;
      }
      if (!inData || !line.trim() || line.startsWith("%")) continue;

      const parts = line.split(",");
      if (parts.length >= 4) {
        predictions.push({
          row_id: parseInt(parts[0]) || 0,
          fold: parseInt(parts[1]) || 0,
          repeat: parseInt(parts[2]) || 0,
          prediction: parts[3]?.replace(/'/g, "").trim(),
          correct: parts[4]?.replace(/'/g, "").trim(),
        });
      }
    }

    return predictions;
  }

  // Build confusion matrix from predictions
  function buildConfusionMatrix(preds: PredictionRow[]): {
    matrix: ConfusionMatrixData[];
    uniqueClasses: string[];
  } {
    const counts: Record<string, Record<string, number>> = {};
    const classSet = new Set<string>();

    preds.forEach((p) => {
      const actual = String(p.correct);
      const predicted = String(p.prediction);
      classSet.add(actual);
      classSet.add(predicted);

      if (!counts[actual]) counts[actual] = {};
      counts[actual][predicted] = (counts[actual][predicted] || 0) + 1;
    });

    const uniqueClasses = Array.from(classSet).sort();
    const matrix: ConfusionMatrixData[] = [];

    uniqueClasses.forEach((actual) => {
      uniqueClasses.forEach((predicted) => {
        matrix.push({
          actual,
          predicted,
          count: counts[actual]?.[predicted] || 0,
        });
      });
    });

    return { matrix, uniqueClasses };
  }

  // Parse confusion matrix from evaluation array_data
  function parseConfusionMatrixFromEval(arrayData: Record<string, unknown>): {
    matrix: ConfusionMatrixData[];
    classes: string[];
  } {
    const matrix: ConfusionMatrixData[] = [];
    const classSet = new Set<string>();

    Object.entries(arrayData).forEach(([key, value]) => {
      // Key format: "actual,predicted" or similar
      const parts = key.split(",");
      if (parts.length === 2) {
        const [actual, predicted] = parts;
        classSet.add(actual);
        classSet.add(predicted);
        matrix.push({
          actual: actual.trim(),
          predicted: predicted.trim(),
          count:
            typeof value === "number" ? value : parseInt(String(value)) || 0,
        });
      }
    });

    return { matrix, classes: Array.from(classSet).sort() };
  }

  // Get class distribution for bar chart
  function getClassDistribution(): {
    name: string;
    correct: number;
    incorrect: number;
  }[] {
    const dist: Record<string, { correct: number; incorrect: number }> = {};

    predictions.forEach((p) => {
      const actual = String(p.correct);
      if (!dist[actual]) dist[actual] = { correct: 0, incorrect: 0 };
      if (p.prediction === p.correct) {
        dist[actual].correct++;
      } else {
        dist[actual].incorrect++;
      }
    });

    return Object.entries(dist).map(([name, counts]) => ({
      name,
      ...counts,
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
        <span className="ml-2 text-sm">Loading analyses...</span>
      </div>
    );
  }

  if (error || (predictions.length === 0 && confusionMatrix.length === 0)) {
    return (
      <div className="text-muted-foreground p-8 text-center text-sm">
        <p>No prediction data available for this run.</p>
        <p className="mt-1 text-xs">
          Predictions are only available for runs that include output files.
        </p>
      </div>
    );
  }

  const classDistribution = getClassDistribution();
  // Use reduce instead of spread to avoid stack overflow with large arrays
  const maxCount = confusionMatrix.reduce(
    (max, c) => Math.max(max, c.count),
    1,
  );

  return (
    <div className="space-y-6 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="confusion" className="flex items-center gap-2">
            <Table2 className="h-4 w-4" />
            Confusion Matrix
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Class Distribution
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Predictions
          </TabsTrigger>
        </TabsList>

        {/* Confusion Matrix Tab */}
        <TabsContent value="confusion" className="mt-4">
          {confusionMatrix.length > 0 && classes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Actual \ Predicted</th>
                    {classes.map((c) => (
                      <th
                        key={c}
                        className="border p-2 text-center font-medium"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classes.map((actual) => (
                    <tr key={actual}>
                      <td className="border p-2 font-medium">{actual}</td>
                      {classes.map((predicted) => {
                        const cell = confusionMatrix.find(
                          (m) =>
                            m.actual === actual && m.predicted === predicted,
                        );
                        const count = cell?.count || 0;
                        const isCorrect = actual === predicted;
                        const intensity = count / maxCount;

                        return (
                          <td
                            key={predicted}
                            className="border p-2 text-center"
                            style={{
                              backgroundColor: isCorrect
                                ? `rgba(34, 197, 94, ${intensity * 0.5})`
                                : count > 0
                                  ? `rgba(239, 68, 68, ${intensity * 0.5})`
                                  : "transparent",
                            }}
                          >
                            {count}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-muted-foreground mt-2 text-xs">
                Green = correct predictions, Red = misclassifications
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No confusion matrix data available
            </p>
          )}
        </TabsContent>

        {/* Class Distribution Tab */}
        <TabsContent value="distribution" className="mt-4">
          {classDistribution.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classDistribution} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    width={100}
                  />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="correct"
                    stackId="a"
                    fill="#22c55e"
                    name="Correct"
                  />
                  <Bar
                    dataKey="incorrect"
                    stackId="a"
                    fill="#ef4444"
                    name="Incorrect"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No class distribution data available
            </p>
          )}
        </TabsContent>

        {/* Predictions Table Tab */}
        <TabsContent value="predictions" className="mt-4">
          {predictions.length > 0 ? (
            <div className="max-h-96 overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="border p-2 text-left">Row</th>
                    <th className="border p-2 text-left">Fold</th>
                    <th className="border p-2 text-left">Actual</th>
                    <th className="border p-2 text-left">Predicted</th>
                    <th className="border p-2 text-center">Correct</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.slice(0, 100).map((p, idx) => {
                    const isCorrect = p.prediction === p.correct;
                    return (
                      <tr key={idx} className="hover:bg-muted/50">
                        <td className="border p-2">{p.row_id}</td>
                        <td className="border p-2">{p.fold}</td>
                        <td className="border p-2">{p.correct}</td>
                        <td className="border p-2">{p.prediction}</td>
                        <td className="border p-2 text-center">
                          {isCorrect ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className="text-red-500">✗</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {predictions.length > 100 && (
                <p className="text-muted-foreground mt-2 text-center text-xs">
                  Showing first 100 of {predictions.length.toLocaleString()}{" "}
                  predictions
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No individual predictions available
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

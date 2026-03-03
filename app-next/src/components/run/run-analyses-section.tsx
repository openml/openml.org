"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Loader2, Download, Table2, BarChart3, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/lib/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlotlyTheme } from "@/hooks/usePlotlyTheme";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

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
  const plotTheme = usePlotlyTheme();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [confusionMatrix, setConfusionMatrix] = useState<ConfusionMatrixData[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("confusion");
  const [selectedCell, setSelectedCell] = useState<{ actual: string; predicted: string } | null>(null);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        setLoading(true);
        const apiUrl = APP_CONFIG.urlApi || "https://www.openml.org/api/v1";

        const response = await fetch(`${apiUrl}/json/run/${runId}`, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch run data");

        const data = await response.json();
        const run = data.run;

        if (run?.output_data?.file) {
          const predictionFile = run.output_data.file.find(
            (f: { name: string }) => f.name === "predictions",
          );

          if (predictionFile?.url) {
            const proxyUrl = `/api/proxy-file?url=${encodeURIComponent(predictionFile.url)}`;
            const predResponse = await fetch(proxyUrl);
            if (predResponse.ok) {
              const predText = await predResponse.text();
              const parsedPredictions = parsePredictions(predText);
              setPredictions(parsedPredictions);

              const { matrix, uniqueClasses } = buildConfusionMatrix(parsedPredictions);
              setConfusionMatrix(matrix);
              setClasses(uniqueClasses);
            }
          }
        }

        if (predictions.length === 0 && run?.output_data?.evaluation) {
          const confMatrixEval = run.output_data.evaluation.find(
            (e: { name: string }) => e.name === "confusion_matrix",
          );
          if (confMatrixEval?.array_data) {
            const parsed = parseConfusionMatrixFromEval(confMatrixEval.array_data);
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

  function parsePredictions(text: string): PredictionRow[] {
    const lines = text.split("\n");
    const predictions: PredictionRow[] = [];
    let inData = false;

    for (const line of lines) {
      if (line.trim().toLowerCase() === "@data") { inData = true; continue; }
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

    // Guard: regression tasks (decimal class labels) or too many unique values
    const isRegression = uniqueClasses.some((c) => {
      const n = parseFloat(c);
      return !isNaN(n) && !Number.isInteger(n);
    });
    if (uniqueClasses.length > 50 || isRegression) return { matrix: [], uniqueClasses: [] };

    const matrix: ConfusionMatrixData[] = [];
    uniqueClasses.forEach((actual) => {
      uniqueClasses.forEach((predicted) => {
        matrix.push({ actual, predicted, count: counts[actual]?.[predicted] || 0 });
      });
    });

    return { matrix, uniqueClasses };
  }

  function parseConfusionMatrixFromEval(arrayData: Record<string, unknown>): {
    matrix: ConfusionMatrixData[];
    classes: string[];
  } {
    const matrix: ConfusionMatrixData[] = [];
    const classSet = new Set<string>();

    Object.entries(arrayData).forEach(([key, value]) => {
      const parts = key.split(",");
      if (parts.length === 2) {
        const [actual, predicted] = parts;
        classSet.add(actual);
        classSet.add(predicted);
        matrix.push({
          actual: actual.trim(),
          predicted: predicted.trim(),
          count: typeof value === "number" ? value : parseInt(String(value)) || 0,
        });
      }
    });

    return { matrix, classes: Array.from(classSet).sort() };
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

  // ── Confusion matrix: build z-matrix (rows = actual, cols = predicted) ──
  const heatmapZ = classes.map((actual) =>
    classes.map((predicted) => {
      const cell = confusionMatrix.find(
        (m) => m.actual === actual && m.predicted === predicted,
      );
      return cell?.count || 0;
    }),
  );

  const annotationColor = isDark ? "white" : "#166534";
  const heatmapAnnotations = classes.flatMap((actual, i) =>
    classes.map((predicted, j) => ({
      x: predicted,
      y: actual,
      // Only annotate non-zero cells to avoid clutter on empty light-mode cells
      text: heatmapZ[i][j] > 0 ? String(heatmapZ[i][j]) : "",
      showarrow: false,
      font: {
        color: annotationColor,
        size: classes.length > 20 ? 8 : 11,
      },
    })),
  );

  // Filtered predictions when a confusion matrix cell is selected
  const displayedPredictions = selectedCell
    ? predictions.filter(
        (p) =>
          String(p.correct) === selectedCell.actual &&
          String(p.prediction) === selectedCell.predicted,
      )
    : predictions;

  // ── Class distribution for stacked bar chart ──
  const distMap: Record<string, { correct: number; incorrect: number }> = {};
  predictions.forEach((p) => {
    const actual = String(p.correct);
    if (!distMap[actual]) distMap[actual] = { correct: 0, incorrect: 0 };
    if (p.prediction === p.correct) distMap[actual].correct++;
    else distMap[actual].incorrect++;
  });
  const distClasses = Object.keys(distMap).sort();

  const totalCorrect = distClasses.reduce((s, c) => s + distMap[c].correct, 0);
  const totalPredictions = predictions.length;
  const overallAccuracy = totalPredictions > 0
    ? ((totalCorrect / totalPredictions) * 100).toFixed(1)
    : null;

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

        {/* ── Confusion Matrix Tab ── */}
        <TabsContent value="confusion" className="mt-4">
          {confusionMatrix.length > 0 && classes.length > 0 ? (
            <div>
              <Plot
                data={[
                  {
                    type: "heatmap",
                    x: classes,
                    y: classes,
                    z: heatmapZ,
                    colorscale: isDark
                      ? [[0, "rgba(34,197,94,0.08)"], [1, "rgba(34,197,94,0.9)"]]
                      : [[0, "#dcfce7"], [1, "#15803d"]],
                    showscale: false,
                    hovertemplate:
                      "Actual: %{y}<br>Predicted: %{x}<br>Count: %{z}<br><i>Click to filter predictions</i><extra></extra>",
                  } as object,
                ]}
                layout={
                  {
                    height: Math.min(600, Math.max(300, classes.length * 40 + 100)),
                    margin: { l: 100, r: 20, t: 30, b: 80 },
                    font: plotTheme.font,
                    xaxis: {
                      title: { text: "Predicted" },
                      tickfont: plotTheme.font,
                      side: "bottom",
                      gridcolor: plotTheme.gridcolor,
                    },
                    yaxis: {
                      title: { text: "Actual" },
                      tickfont: plotTheme.font,
                      autorange: "reversed",
                      gridcolor: plotTheme.gridcolor,
                    },
                    annotations: heatmapAnnotations,
                    paper_bgcolor: plotTheme.paper_bgcolor,
                    plot_bgcolor: plotTheme.plot_bgcolor,
                    hoverlabel: plotTheme.hoverlabel,
                  } as object
                }
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: "100%", cursor: "pointer" }}
                onClick={(event) => {
                  if (event.points?.length) {
                    const pt = event.points[0];
                    setSelectedCell({
                      actual: String(pt.y),
                      predicted: String(pt.x),
                    });
                    setActiveTab("predictions");
                  }
                }}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Darker = more predictions. Diagonal = correct. Click a cell to filter predictions.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No confusion matrix data available for this run (regression tasks or too many classes are not shown).
            </p>
          )}
        </TabsContent>

        {/* ── Class Distribution Tab ── */}
        <TabsContent value="distribution" className="mt-4">
          {distClasses.length > 0 ? (
            <div className="space-y-3">
              {/* Overall accuracy summary */}
              {overallAccuracy !== null && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Overall accuracy:</span>
                  <span className="font-semibold text-green-500">{overallAccuracy}%</span>
                  <span className="text-muted-foreground">
                    ({totalCorrect.toLocaleString()} / {totalPredictions.toLocaleString()} correct)
                  </span>
                </div>
              )}
              <Plot
                data={[
                  {
                    type: "bar",
                    orientation: "h",
                    name: "Correct",
                    y: distClasses,
                    x: distClasses.map((c) => distMap[c].correct),
                    marker: { color: "#22c55e" },
                    customdata: distClasses.map((c) => {
                      const total = distMap[c].correct + distMap[c].incorrect;
                      return total > 0
                        ? ((distMap[c].correct / total) * 100).toFixed(1)
                        : "0.0";
                    }),
                    hovertemplate:
                      "<b>%{y}</b><br>Correct: %{x} (%{customdata}% of class)<extra></extra>",
                  } as object,
                  {
                    type: "bar",
                    orientation: "h",
                    name: "Incorrect",
                    y: distClasses,
                    x: distClasses.map((c) => distMap[c].incorrect),
                    marker: { color: "#ef4444" },
                    customdata: distClasses.map((c) => {
                      const total = distMap[c].correct + distMap[c].incorrect;
                      return total > 0
                        ? ((distMap[c].incorrect / total) * 100).toFixed(1)
                        : "0.0";
                    }),
                    hovertemplate:
                      "<b>%{y}</b><br>Incorrect: %{x} (%{customdata}% of class)<extra></extra>",
                  } as object,
                ]}
                layout={
                  {
                    barmode: "stack",
                    height: Math.min(600, Math.max(300, distClasses.length * 30 + 100)),
                    margin: { l: 100, r: 20, t: 20, b: 50 },
                    font: plotTheme.font,
                    xaxis: {
                      title: { text: "Count" },
                      tickfont: plotTheme.font,
                      gridcolor: plotTheme.gridcolor,
                    },
                    yaxis: {
                      tickfont: plotTheme.font,
                      gridcolor: plotTheme.gridcolor,
                      automargin: true,
                    },
                    legend: { orientation: "h", y: -0.15 },
                    paper_bgcolor: plotTheme.paper_bgcolor,
                    plot_bgcolor: plotTheme.plot_bgcolor,
                    hoverlabel: plotTheme.hoverlabel,
                  } as object
                }
                config={{
                  responsive: true,
                  displayModeBar: true,
                  modeBarButtonsToRemove: ["lasso2d", "select2d"],
                  displaylogo: false,
                }}
                style={{ width: "100%" }}
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No class distribution data available
            </p>
          )}
        </TabsContent>

        {/* ── Predictions Table Tab ── */}
        <TabsContent value="predictions" className="mt-4">
          {predictions.length > 0 ? (
            <div className="space-y-2">
              {/* Active cell filter banner */}
              {selectedCell && (
                <div className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-950">
                  <span className="text-blue-700 dark:text-blue-300">
                    Showing predictions where actual =&nbsp;
                    <strong>{selectedCell.actual}</strong> and predicted =&nbsp;
                    <strong>{selectedCell.predicted}</strong>
                    &nbsp;({displayedPredictions.length} rows)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-blue-700 hover:text-blue-900 dark:text-blue-300"
                    onClick={() => setSelectedCell(null)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                </div>
              )}
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
                    {displayedPredictions.slice(0, 200).map((p, idx) => {
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
                {displayedPredictions.length > 200 && (
                  <p className="text-muted-foreground mt-2 text-center text-xs">
                    Showing first 200 of {displayedPredictions.length.toLocaleString()} rows
                  </p>
                )}
              </div>
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

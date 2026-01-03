interface Evaluation {
  name: string;
  value: string | number;
  array_data?: Record<string, string | number>;
}

interface Run {
  output_data?: {
    evaluation?: Evaluation[];
  };
}

interface RunMetricsSectionProps {
  run: Run;
}

export function RunMetricsSection({ run }: RunMetricsSectionProps) {
  const evaluations = run.output_data?.evaluation || [];

  if (evaluations.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No evaluation metrics available
      </div>
    );
  }

  // Format metric names
  const formatMetricName = (name: string) => {
    const mapping: Record<string, string> = {
      predictive_accuracy: "Predictive Accuracy",
      area_under_roc_curve: "Area Under ROC Curve (AUC)",
      root_mean_squared_error: "Root Mean Squared Error (RMSE)",
      mean_absolute_error: "Mean Absolute Error (MAE)",
      f_measure: "F-Measure",
      precision: "Precision",
      recall: "Recall",
      kappa: "Kappa",
      kb_relative_information_score: "KB Relative Information Score",
      weighted_recall: "Weighted Recall",
    };
    return (
      mapping[name] ||
      name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  return (
    <div className="space-y-4">
      {evaluations.map((evaluation: Evaluation, index: number) => {
        const value = parseFloat(evaluation.value as string);
        const arrayData = evaluation.array_data;

        return (
          <div key={index} className="rounded-lg border p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-muted-foreground text-sm font-medium">
                {formatMetricName(evaluation.name)}
              </h3>
              <span className="text-2xl font-bold">
                {!isNaN(value) ? value.toFixed(4) : evaluation.value}
              </span>
            </div>

            {/* Per-class metrics (if available) */}
            {arrayData && (
              <div className="mt-2 space-y-1 border-t pt-2 text-xs">
                {Object.entries(arrayData).map(
                  ([key, val]: [string, string | number]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">
                        {typeof val === "number"
                          ? val.toFixed(4)
                          : parseFloat(val).toFixed(4)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import { MeasureSearchContainer, MeasureStatsCard } from "@/components/measure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS } from "@/constants/entityIcons";
import { entityColors } from "@/constants/entityColors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model Evaluation - OpenML Performance Metrics",
  description:
    "Explore ML model evaluation metrics. Find standardized measures like accuracy, AUC, RMSE, F1-score, and more for comparing algorithm performance.",
  keywords: [
    "model evaluation",
    "performance metrics",
    "accuracy",
    "AUC",
    "RMSE",
    "F1-score",
    "ML metrics",
    "OpenML measures",
  ],
  openGraph: {
    title: "Model Evaluation - OpenML Performance Metrics",
    description: "Standardized ML performance metrics.",
    type: "website",
    url: "https://www.openml.org/measures/model-evaluation",
    siteName: "OpenML",
  },
};

export default async function ModelEvaluationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={ENTITY_ICONS.measure}
              className="h-8 w-8"
              style={{ color: entityColors.measures }}
              aria-hidden="true"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Evaluation Measures
              </h1>
              <p className="text-muted-foreground">
                Standardized metrics for evaluating ML model performance
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <MeasureStatsCard measureType="evaluation_measure" />
        <MeasureSearchContainer measureType="evaluation_measure" />
      </div>
    </div>
  );
}

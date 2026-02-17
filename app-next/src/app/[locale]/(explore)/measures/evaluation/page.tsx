import { setRequestLocale } from "next-intl/server";
import { MeasureList } from "@/components/measure/measure-list";
import { Gauge } from "lucide-react";
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
            <Gauge className="h-8 w-8 text-sky-600" aria-hidden="true" />
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
      <div className="container mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
        <MeasureList measureType="evaluation_measure" />
      </div>
    </div>
  );
}

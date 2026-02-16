import { setRequestLocale } from "next-intl/server";
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Model Evaluation</h1>
      <p className="text-muted-foreground mt-4">
        Model evaluation measures - coming soon
      </p>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runs - OpenML Experiment Results",
  description:
    "Explore machine learning experiment results on OpenML. Find reproducible runs with predictions, evaluations, and performance metrics across tasks and datasets.",
  keywords: [
    "machine learning experiments",
    "ML runs",
    "experiment results",
    "model evaluations",
    "benchmark results",
    "performance metrics",
    "OpenML runs",
    "reproducible experiments",
    "accuracy scores",
    "cross-validation results",
  ],
  openGraph: {
    title: "Runs - OpenML Experiment Results",
    description:
      "Reproducible ML experiments with predictions and evaluations.",
    type: "website",
    url: "https://www.openml.org/runs",
    siteName: "OpenML",
  },
  twitter: {
    card: "summary_large_image",
    title: "Runs - OpenML",
    description: "ML experiment results and evaluations.",
    site: "@open_ml",
  },
};

export default async function RunsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Runs</h1>
      <p className="text-muted-foreground mt-4">Runs page - coming soon</p>
    </div>
  );
}

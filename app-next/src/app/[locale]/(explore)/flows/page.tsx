import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flows - OpenML Machine Learning Pipelines",
  description:
    "Browse machine learning flows and pipelines on OpenML. Find reusable ML workflows, algorithms, and model implementations for scikit-learn, Weka, MLR, and more.",
  keywords: [
    "machine learning flows",
    "ML pipelines",
    "scikit-learn pipelines",
    "AutoML",
    "model implementations",
    "ML algorithms",
    "Weka classifiers",
    "MLR learners",
    "OpenML flows",
    "reproducible ML",
  ],
  openGraph: {
    title: "Flows - OpenML Machine Learning Pipelines",
    description: "Reusable ML workflows and algorithm implementations.",
    type: "website",
    url: "https://www.openml.org/flows",
    siteName: "OpenML",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flows - OpenML",
    description: "ML pipelines and algorithm implementations.",
    site: "@open_ml",
  },
};

export default async function FlowsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Flows</h1>
      <p className="text-muted-foreground mt-4">Flows page - coming soon</p>
    </div>
  );
}

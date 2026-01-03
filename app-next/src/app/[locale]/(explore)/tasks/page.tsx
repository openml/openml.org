import { setRequestLocale } from "next-intl/server";
import { TasksSearchPage } from "@/components/search/tasks/tasks-search-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks - OpenML Machine Learning Benchmarks",
  description:
    "Explore machine learning tasks on OpenML. Find standardized ML problems with predefined datasets, target variables, and evaluation metrics for fair algorithm comparison.",
  keywords: [
    "machine learning tasks",
    "ML benchmarks",
    "classification tasks",
    "regression tasks",
    "supervised learning",
    "AutoML benchmarks",
    "OpenML tasks",
    "model evaluation",
    "train test splits",
    "cross-validation",
  ],
  openGraph: {
    title: "Tasks - OpenML Machine Learning Benchmarks",
    description:
      "Standardized ML tasks with predefined evaluation for fair algorithm comparison.",
    type: "website",
    url: "https://www.openml.org/tasks",
    siteName: "OpenML",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasks - OpenML",
    description: "Standardized ML tasks for benchmarking.",
    site: "@open_ml",
  },
};

export default async function TasksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TasksSearchPage />;
}

import { setRequestLocale } from "next-intl/server";
import { BenchmarksSearchPage } from "@/components/search/benchmarks/benchmarks-search-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Suites - OpenML Benchmarking",
  description:
    "Explore standardized task suites for ML benchmarking. Compare algorithms across curated collections of tasks like AutoML Benchmark, OpenML-CC18, and more.",
  keywords: [
    "task suites",
    "ML benchmarking",
    "AutoML benchmark",
    "OpenML-CC18",
    "algorithm comparison",
    "standardized benchmarks",
  ],
  openGraph: {
    title: "Task Suites - OpenML Benchmarking",
    description: "Standardized ML benchmarking suites.",
    type: "website",
    url: "https://www.openml.org/benchmarks/tasks-suites",
    siteName: "OpenML",
  },
};

export default async function TaskSuitesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <BenchmarksSearchPage
      studyType="task"
      title="Task Suites"
      description="Standardized benchmark suites for comparing ML algorithms"
    />
  );
}

import { setRequestLocale } from "next-intl/server";
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Task Suites</h1>
      <p className="text-muted-foreground mt-4">
        Benchmark task suites - coming soon
      </p>
    </div>
  );
}

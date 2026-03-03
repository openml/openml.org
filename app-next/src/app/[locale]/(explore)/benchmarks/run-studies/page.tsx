import { setRequestLocale } from "next-intl/server";
import { BenchmarksSearchPage } from "@/components/search/benchmarks/benchmarks-search-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Run Studies - OpenML Benchmark Studies",
  description:
    "Explore run studies comparing ML algorithms across standardized benchmarks. Comprehensive algorithm comparisons with reproducible results.",
  keywords: [
    "run studies",
    "algorithm comparison",
    "ML benchmarks",
    "reproducible results",
    "OpenML studies",
    "performance comparison",
  ],
  openGraph: {
    title: "Run Studies - OpenML Benchmark Studies",
    description: "Algorithm comparison studies with reproducible results.",
    type: "website",
    url: "https://www.openml.org/benchmarks/run-studies",
    siteName: "OpenML",
  },
};

export default async function RunStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <BenchmarksSearchPage
      studyType="run"
      title="Run Studies"
      description="Algorithm comparison studies with reproducible results"
    />
  );
}

import { setRequestLocale } from "next-intl/server";
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Run Studies</h1>
      <p className="text-muted-foreground mt-4">
        Benchmark run studies - coming soon
      </p>
    </div>
  );
}

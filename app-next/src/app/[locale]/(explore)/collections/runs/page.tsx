import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Run Collections - OpenML",
  description:
    "Browse collections of machine learning experiment runs. Find grouped experiments for comparison studies and reproducibility.",
  keywords: [
    "run collections",
    "ML experiments",
    "experiment collections",
    "OpenML runs",
  ],
  openGraph: {
    title: "Run Collections - OpenML",
    description: "Collections of ML experiment runs.",
    type: "website",
    url: "https://www.openml.org/collections/runs",
    siteName: "OpenML",
  },
};

export default async function CollectionRunsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Run Collections</h1>
      <p className="text-muted-foreground mt-4">
        Run collections - coming soon
      </p>
    </div>
  );
}

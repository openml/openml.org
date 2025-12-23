import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Qualities - OpenML Dataset Metrics",
  description:
    "Explore data quality measures and meta-features for ML datasets. Find dataset characteristics like dimensionality, class balance, and statistical properties.",
  keywords: [
    "data qualities",
    "dataset metrics",
    "meta-features",
    "dataset characteristics",
    "data complexity",
    "OpenML measures",
  ],
  openGraph: {
    title: "Data Qualities - OpenML Dataset Metrics",
    description: "Dataset quality measures and meta-features.",
    type: "website",
    url: "https://www.openml.org/measures/data-qualities",
    siteName: "OpenML",
  },
};

export default async function DataQualitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Data Qualities</h1>
      <p className="text-muted-foreground mt-4">
        Data quality measures - coming soon
      </p>
    </div>
  );
}

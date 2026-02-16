import { setRequestLocale } from "next-intl/server";
import { MeasureList } from "@/components/measure/measure-list";
import { Gauge } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Quality Measures - OpenML",
  description:
    "Explore data quality measures used to characterize ML datasets. Number of features, missing values, class entropy, and more.",
  keywords: [
    "data quality",
    "dataset characteristics",
    "feature count",
    "missing values",
    "class entropy",
    "OpenML qualities",
  ],
  openGraph: {
    title: "Data Quality Measures - OpenML",
    description: "Dataset quality measures and characteristics.",
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
    <div className="flex min-h-screen flex-col">
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="flex items-start gap-3">
            <Gauge className="h-8 w-8 text-sky-600" aria-hidden="true" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Data Quality Measures
              </h1>
              <p className="text-muted-foreground">
                Measures used to characterize and describe datasets
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
        <MeasureList measureType="data_quality" />
      </div>
    </div>
  );
}

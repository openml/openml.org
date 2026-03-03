import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { MeasureSearchContainer, MeasureStatsCard } from "@/components/measure";
import { SearchTabs } from "@/components/search/shared/search-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MEASURE_TABS = [
  { label: "Evaluation Measures", path: "/measures/evaluation" },
  { label: "Data Quality", path: "/measures/data" },
  { label: "Estimation Procedures", path: "/measures/procedures" },
];
import { ENTITY_ICONS, entityColors } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estimation Procedures - OpenML",
  description:
    "Browse estimation procedures used in ML experiments. Cross-validation, holdout, and other evaluation strategies.",
  keywords: [
    "estimation procedures",
    "cross-validation",
    "holdout",
    "ML evaluation",
    "OpenML procedures",
  ],
  openGraph: {
    title: "Estimation Procedures - OpenML",
    description: "ML evaluation procedures and strategies.",
    type: "website",
    url: "https://www.openml.org/measures/procedures",
    siteName: "OpenML",
  },
};

export default async function ProceduresPage({
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
            <FontAwesomeIcon
              icon={ENTITY_ICONS.measures}
              className="h-4 w-4"
              style={{
                color: entityColors.measures,
                width: "32px",
                height: "32px",
              }}
              aria-hidden="true"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Estimation Procedures
              </h1>
              <p className="text-muted-foreground">
                Cross-validation, holdout, and other evaluation strategies
              </p>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="h-12 border-b" />}>
        <SearchTabs tabs={MEASURE_TABS} accentColor={entityColors.measures} />
      </Suspense>
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <MeasureStatsCard measureType="estimation_procedure" />
        <MeasureSearchContainer measureType="estimation_procedure" />
      </div>
    </div>
  );
}

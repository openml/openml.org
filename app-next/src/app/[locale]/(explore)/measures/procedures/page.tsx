import { setRequestLocale } from "next-intl/server";
import { MeasureList } from "@/components/measure/measure-list";
import { Gauge } from "lucide-react";
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
            <Gauge className="h-8 w-8 text-sky-600" aria-hidden="true" />
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
      <div className="container mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
        <MeasureList measureType="estimation_procedure" />
      </div>
    </div>
  );
}

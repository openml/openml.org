import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { RunsSearchPage } from "@/components/search/runs/runs-search-page";

export const metadata: Metadata = {
  title: "Runs - OpenML Experiment Results",
  description: "Browse machine learning experiment runs on OpenML.",
};

export default async function RunsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RunsSearchPage />;
}

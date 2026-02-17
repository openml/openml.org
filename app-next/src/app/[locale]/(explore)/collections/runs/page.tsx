import { setRequestLocale } from "next-intl/server";
import { CollectionsSearchPage } from "@/components/search/collections/collections-search-page";
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
    <CollectionsSearchPage
      studyType="run"
      title="Run Collections"
      description="Collections of machine learning experiment runs"
    />
  );
}

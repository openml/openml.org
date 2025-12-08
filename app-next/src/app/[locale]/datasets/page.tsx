import { setRequestLocale } from "next-intl/server";
import { DatasetsSearchPage } from "@/components/search/datasets-search-page";

export default async function DatasetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DatasetsSearchPage />;
}

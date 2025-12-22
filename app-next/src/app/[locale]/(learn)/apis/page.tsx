import { setRequestLocale, getTranslations } from "next-intl/server";
import { APIPageContent } from "@/components/api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getTranslations({
    locale,
    namespace: "home.api.meta",
  })) as (key: string) => string;

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "OpenML API",
      "machine learning API",
      "Python ML API",
      "R machine learning",
      "Java ML",
      "REST API",
      "datasets API",
      "ML experiments",
      "benchmarking",
      "scikit-learn",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function APIPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <APIPageContent />;
}

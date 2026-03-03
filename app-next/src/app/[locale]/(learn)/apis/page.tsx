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
    alternates: {
      canonical: `/${locale}/apis`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://www.openml.org/${locale}/apis`,
      siteName: "OpenML",
      images: [
        {
          url: "https://www.openml.org/images/og/apis.png",
          width: 1200,
          height: 630,
          alt: "OpenML APIs - Python, R, Java, REST",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: "@open_ml",
      images: ["https://www.openml.org/images/og/apis.png"],
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

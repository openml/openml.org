import { setRequestLocale } from "next-intl/server";
import { DatasetsSearchPage } from "@/components/search/datasets/datasets-search-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datasets - OpenML Machine Learning Repository",
  description:
    "Explore thousands of machine learning datasets. Find standardized, versioned datasets for classification, regression, clustering, and more. Download datasets for scikit-learn, TensorFlow, PyTorch, and R.",
  keywords: [
    "machine learning datasets",
    "ML datasets",
    "training data",
    "OpenML datasets",
    "scikit-learn datasets",
    "classification datasets",
    "regression datasets",
    "benchmark datasets",
    "tabular data",
    "UCI datasets",
  ],
  openGraph: {
    title: "Datasets - OpenML Machine Learning Repository",
    description:
      "Explore thousands of machine learning datasets for classification, regression, and more.",
    type: "website",
    url: "https://www.openml.org/datasets",
    siteName: "OpenML",
  },
  twitter: {
    card: "summary_large_image",
    title: "Datasets - OpenML",
    description: "Explore thousands of standardized ML datasets.",
    site: "@open_ml",
  },
};

export default async function DatasetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DatasetsSearchPage />;
}

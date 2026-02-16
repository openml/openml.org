import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Procedures - OpenML Evaluation Methods",
  description:
    "Explore test procedures and evaluation methods. Find standardized train/test splits, cross-validation schemes, and evaluation protocols for reproducible ML.",
  keywords: [
    "test procedures",
    "cross-validation",
    "train test split",
    "evaluation methods",
    "holdout",
    "k-fold",
    "OpenML procedures",
  ],
  openGraph: {
    title: "Test Procedures - OpenML Evaluation Methods",
    description: "Standardized evaluation procedures for ML.",
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Test Procedures</h1>
      <p className="text-muted-foreground mt-4">
        Test procedure measures - coming soon
      </p>
    </div>
  );
}

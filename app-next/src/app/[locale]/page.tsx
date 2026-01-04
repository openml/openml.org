import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroHome } from "@/components/home/hero-home";
import { ThreePillarsSection } from "@/components/home/three-pillars-section";
import { AccessibilitySection } from "@/components/home/accessibility-section";
import { BenchmarkingSection } from "@/components/home/benchmarking-section";
import { WorkflowLoopSection } from "@/components/home/workflow-loop-section";
import { AcademicImpactSection } from "@/components/home/academic-impact-section";
import FAQSection from "@/components/home/faq-section";
import { HomePageWrapper } from "@/components/home/home-page-wrapper";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getTranslations({
    locale,
    namespace: "home.hero",
  })) as (key: string) => string;

  return {
    title: "OpenML - Machine Learning, Better, Together",
    description: t("subtitle"),
    keywords: [
      "OpenML",
      "machine learning",
      "datasets",
      "ML benchmarks",
      "reproducible research",
      "open science",
      "AutoML",
      "scikit-learn",
      "data science",
    ],
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title: "OpenML - Machine Learning, Better, Together",
      description: t("subtitle"),
      type: "website",
      url: `https://www.openml.org/${locale}`,
      siteName: "OpenML",
      images: [
        {
          url: "https://www.openml.org/images/og/home.png",
          width: 1200,
          height: 630,
          alt: "OpenML - Open Machine Learning Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "OpenML - Machine Learning, Better, Together",
      description: t("subtitle"),
      site: "@open_ml",
      images: ["https://www.openml.org/images/og/home.png"],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <HomePageWrapper>
      <HeroHome />
      <ThreePillarsSection />
      <AccessibilitySection />
      <BenchmarkingSection />
      <WorkflowLoopSection />
      <AcademicImpactSection />
      <FAQSection />
    </HomePageWrapper>
  );
}

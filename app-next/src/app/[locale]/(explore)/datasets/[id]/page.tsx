import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FlaskConical,
  Heart,
  CloudDownload,
  BarChart3,
  Info,
  Database,
  ArrowLeft,
  Grid3x3,
} from "lucide-react";
import {
  fetchDataset,
  fetchDatasetTaskCount,
  fetchDatasetRunCount,
} from "@/lib/api/dataset";
import { DatasetHeader } from "@/components/dataset/dataset-header-new";
import { DatasetDescription } from "@/components/dataset/dataset-description";
import { DatasetMetadataGrid } from "@/components/dataset/dataset-metadata-grid";
import { FeatureTable } from "@/components/dataset/feature-table";
import { QualityTable } from "@/components/dataset/quality-table";
import { DatasetNavigationMenu } from "@/components/dataset/dataset-navigation-menu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const dataset = await fetchDataset(id);

    // Truncate description for meta tags (Google shows ~160 chars)
    const description =
      dataset.description?.slice(0, 160) || `OpenML Dataset: ${dataset.name}`;

    // Extract keywords from tags and features
    const keywords = [
      "machine learning",
      "dataset",
      "OpenML",
      dataset.name,
      ...(dataset.tags?.map((t) => t.tag) || []),
      `${dataset.qualities?.NumberOfInstances || 0} instances`,
      `${dataset.qualities?.NumberOfFeatures || 0} features`,
    ];

    return {
      // Primary metadata
      title: `${dataset.name} - OpenML Dataset`,
      description,
      keywords: keywords.join(", "),

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: dataset.name,
        description,
        type: "article",
        url: `https://www.openml.org/datasets/${id}`,
        siteName: "OpenML",
        locale: "en_US",
        // dataset image if available and wanted
        // images: [{ url: dataset.image_url }],
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: dataset.name,
        description,
        site: "@open_ml",
        creator: dataset.creator || "@open_ml",
      },

      // Custom meta tags for academic/research platforms
      other: {
        // Google Scholar metadata
        citation_title: dataset.name,
        citation_author: dataset.creator || dataset.uploader,
        citation_publication_date: dataset.date,

        // Dublin Core metadata (library/academic systems)
        "DC.title": dataset.name,
        "DC.creator": dataset.creator || dataset.uploader,
        "DC.date": dataset.date,
        "DC.format": dataset.format,
        "DC.identifier": `openml:dataset:${id}`,
        "DC.rights": dataset.licence,

        // Dataset-specific
        "openml:data_id": id,
        "openml:version": dataset.version.toString(),
        "openml:instances": dataset.qualities?.NumberOfInstances?.toString(),
        "openml:features": dataset.qualities?.NumberOfFeatures?.toString(),
      },

      // Canonical URL (important for SEO if you have multiple URLs)
      alternates: {
        canonical: `https://www.openml.org/datasets/${id}`,
      },

      // Robots (control search engine indexing)
      robots: {
        index: dataset.status === "active", // Only index active datasets
        follow: true,
        googleBot: {
          index: dataset.status === "active",
          follow: true,
        },
      },
    };
  } catch (_error) {
    // If dataset doesn't exist, return minimal metadata
    return {
      title: "Dataset Not Found - OpenML",
      description: "The requested dataset could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [dataset, taskCount, runCount] = await Promise.all([
    fetchDataset(id),
    fetchDatasetTaskCount(id),
    fetchDatasetRunCount(id),
  ]);

  // If dataset is deactivated, show notice
  if (dataset.status === "deactivated") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border-destructive bg-destructive/10 rounded-lg border p-6">
          <h1 className="text-destructive text-2xl font-bold">
            Dataset Deactivated
          </h1>
          <p className="text-muted-foreground mt-2">
            This dataset has been deactivated and is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header: Full Width - Name, stats, actions */}
        <DatasetHeader
          dataset={dataset}
          taskCount={taskCount}
          runCount={runCount}
        />

        {/* Content with Sidebar - Below Header */}
        <div className="relative flex min-h-screen gap-8">
          {/* Left: Main Content */}
          <div className="min-w-0 flex-1">
            {/* Description: Primary content */}
            <section id="description" className="mt-8 scroll-mt-20">
              <DatasetDescription dataset={dataset} />
            </section>

            {/* <section id="information" className="mt-8 scroll-mt-20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Info className="h-5 w-5 text-green-600 dark:text-green-500" />
                Dataset Information
              </h2>
              <DatasetMetadataGrid dataset={dataset} />
            </section> */}

            {/* Features: Technical details */}
            {dataset.features && dataset.features.length > 0 && (
              <section id="features" className="mt-8 scroll-mt-20">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <BarChart3 className="h-5 w-5 rotate-90 text-gray-500" />
                  Features ({dataset.features.length})
                </h2>
                <FeatureTable features={dataset.features} />
              </section>
            )}

            {/* Qualities: Meta-features */}
            {dataset.qualities && Object.keys(dataset.qualities).length > 0 && (
              <section id="qualities" className="mt-8 scroll-mt-20">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <BarChart3 className="h-5 w-5 text-gray-500" />
                  Dataset Qualities
                </h2>
                <QualityTable qualities={dataset.qualities} />
              </section>
            )}

            {/* TODO: Related Tasks section */}
            {/* TODO: Recent Runs section */}
            {/* TODO: Visualizations section */}
          </div>

          {/* Right: Navigation Menu - Responsive */}
          <DatasetNavigationMenu
            hasFeatures={dataset.features && dataset.features.length > 0}
            hasQualities={
              dataset.qualities && Object.keys(dataset.qualities).length > 0
            }
            featuresCount={dataset.features?.length || 0}
          />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // 1 hour

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataset } from "@/lib/elasticsearch/get-dataset";
import { DatasetHeader } from "@/components/dataset/dataset-header";
import { DatasetActionBar } from "@/components/dataset/dataset-action-bar";
import { DatasetMetadataGrid } from "@/components/dataset/dataset-metadata-grid";
import { DatasetDescription } from "@/components/dataset/dataset-description";
import { FeatureTable } from "@/components/dataset/feature-table";
import { QualityTable } from "@/components/dataset/quality-table";

/**
 * Generate metadata for dataset detail page
 * This runs on the server and provides SEO-optimized meta tags
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const datasetId = parseInt(id);

  // Validate ID
  if (isNaN(datasetId)) {
    return {
      title: "Dataset Not Found | OpenML",
    };
  }

  try {
    const dataset = await getDataset(datasetId);

    return {
      title: `${dataset.name} - Dataset #${dataset.data_id} | OpenML`,
      description: dataset.description.slice(0, 160) + "...",
      keywords: [
        "machine learning",
        "dataset",
        dataset.name,
        ...dataset.tags.map((t) => t.tag),
      ],
      openGraph: {
        title: `${dataset.name} | OpenML`,
        description: dataset.description.slice(0, 160) + "...",
        type: "website",
        url: `https://www.openml.org/datasets/${dataset.data_id}`,
      },
      alternates: {
        canonical: `https://www.openml.org/datasets/${dataset.data_id}`,
      },
    };
  } catch (error) {
    return {
      title: "Dataset Not Found | OpenML",
    };
  }
}

/**
 * Dataset Detail Page - Server Component
 *
 * This page displays comprehensive information about a single dataset,
 * including metadata, features, quality metrics, and download options.
 *
 * Architecture:
 * - Server Component for optimal SEO and performance
 * - Data fetched directly from Elasticsearch on the server
 * - Client Component islands for interactive features (tables, actions)
 * - ISR with 1-hour revalidation for data freshness
 */
export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const datasetId = parseInt(id);

  // Validate dataset ID
  if (isNaN(datasetId)) {
    notFound();
  }

  // Fetch dataset data on the server
  let dataset;
  try {
    dataset = await getDataset(datasetId);
  } catch (error) {
    console.error(`Failed to fetch dataset ${datasetId}:`, error);
    notFound();
  }

  // TODO: Get actual login status from session/auth
  const isLoggedIn = false;

  return (
    <div className="min-h-screen">
      {/* Action Bar - Sticky at top */}
      <DatasetActionBar dataset={dataset} isLoggedIn={isLoggedIn} />

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header Section */}
        <DatasetHeader dataset={dataset} />

        {/* Metadata Grid */}
        <div className="mb-8">
          <DatasetMetadataGrid dataset={dataset} />
        </div>

        {/* Description and Additional Info */}
        <div className="mb-8">
          <DatasetDescription dataset={dataset} />
        </div>

        {/* Features Section */}
        {dataset.features && dataset.features.length > 0 && (
          <div className="mb-8">
            <FeatureTable features={dataset.features} />
          </div>
        )}

        {/* Quality Metrics Section */}
        {dataset.qualities && Object.keys(dataset.qualities).length > 0 && (
          <div className="mb-8">
            <QualityTable qualities={dataset.qualities} />
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
          <p className="text-muted-foreground text-sm">
            <strong>Note:</strong> This dataset is part of the OpenML platform.
            For programmatic access, use the{" "}
            <a
              href={`https://www.openml.org/api/v1/json/data/${dataset.data_id}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenML API
            </a>
            . For Python users, check out the{" "}
            <a
              href="https://openml.github.io/openml-python/"
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              openml-python
            </a>{" "}
            package.
          </p>
        </div>
      </div>
    </div>
  );
}

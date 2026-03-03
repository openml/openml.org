import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BarChart3 } from "lucide-react";
import {
  fetchDataset,
  fetchDatasetTaskCount,
  fetchDatasetRunCount,
} from "@/lib/api/dataset";
import { DatasetHeader } from "@/components/dataset/dataset-header-new";
import { DatasetDescription } from "@/components/dataset/dataset-description";
import { QualityTable } from "@/components/dataset/quality-table";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { DataAnalysisSection } from "@/components/dataset/data-analysis-section";
import { MetadataSection } from "@/components/dataset/metadata-section";
import { ActivityOverview } from "@/components/dataset/activity-overview";
import { DataDetailSection } from "@/components/dataset/data-detail-section";
import { TasksSection } from "@/components/dataset/tasks-section";
import { RunsSection } from "@/components/dataset/runs-section";
import { WorkspaceSetter } from "@/components/workspace/workspace-setter";
import { entityColors } from "@/constants";

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
        {/* Push context to the persistent workspace panel */}
        <WorkspaceSetter
          entity={{
            type: "dataset",
            id: dataset.data_id,
            title: dataset.name,
            subtitle: `${dataset.qualities?.NumberOfInstances?.toLocaleString() || "?"} instances · ${dataset.qualities?.NumberOfFeatures?.toLocaleString() || "?"} features`,
            url: `/datasets/${id}`,
            color: entityColors.data,
          }}
          sections={[
            { id: "description", label: "Description", iconName: "FileText" },
            ...(dataset.features && dataset.features.length > 0
              ? [
                  {
                    id: "data-analysis",
                    label: `Data & Analysis`,
                    iconName: "Database",
                    count: dataset.features.length,
                  },
                ]
              : []),
            { id: "metadata", label: "Metadata", iconName: "Tags" },
            { id: "activity", label: "Activity", iconName: "LineChart" },
            { id: "data-detail", label: "Data Detail", iconName: "Database" },
            {
              id: "tasks",
              label: "Tasks",
              iconName: "ExternalLink",
              count: taskCount,
            },
            {
              id: "runs",
              label: "Runs",
              iconName: "ExternalLink",
              count: runCount,
            },
            ...(dataset.qualities && Object.keys(dataset.qualities).length > 0
              ? [
                  {
                    id: "qualities",
                    label: "Qualities",
                    iconName: "BarChart3",
                    count: Object.keys(dataset.qualities).length,
                  },
                ]
              : []),
          ]}
          quickLinks={[
            ...(dataset.data_id
              ? [
                  {
                    label: `Tasks on this dataset`,
                    href: `/tasks?data_id=${dataset.data_id}`,
                    iconName: "ExternalLink",
                  },
                  {
                    label: `Runs on this dataset`,
                    href: `/runs?data_id=${dataset.data_id}`,
                    iconName: "ExternalLink",
                  },
                ]
              : []),
          ]}
        />

        {/* Header: Full Width - Name, stats, actions */}
        <DatasetHeader
          dataset={dataset}
          taskCount={taskCount}
          runCount={runCount}
        />

        {/* Main Content */}
        <div className="mt-6 space-y-6">
          {/* Description: Primary content */}
          <section id="description" className="scroll-mt-20">
            <DatasetDescription dataset={dataset} />
          </section>

          {/* Data & Analysis Section - MERGED: Features table + Distribution + Correlation */}
          {dataset.features && dataset.features.length > 0 && (
            <DataAnalysisSection dataset={dataset} />
          )}

          {/* Metadata Section - kggl style expandable metadata */}
          <MetadataSection dataset={dataset} />

          {/* Activity Overview - kggl style activity stats */}
          <ActivityOverview dataset={dataset} />

          {/* Data Detail Section - Download links, API, code snippets */}
          <DataDetailSection dataset={dataset} />

          {/* Tasks Section - Tasks defined on this dataset */}
          <TasksSection dataset={dataset} taskCount={taskCount} />

          {/* Runs Section - Experiments performed on this dataset */}
          <RunsSection dataset={dataset} runCount={runCount} />

          {/* Qualities: Meta-features (collapsed by default) */}
          {dataset.qualities && Object.keys(dataset.qualities).length > 0 && (
            <CollapsibleSection
              id="qualities"
              title="Dataset Qualities"
              description="Computed meta-features and statistics"
              icon={<BarChart3 className="h-4 w-4 text-gray-500" />}
              badge={Object.keys(dataset.qualities).length}
              defaultOpen={false}
            >
              <QualityTable qualities={dataset.qualities} />
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // 1 hour

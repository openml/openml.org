import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Generate metadata for dataset detail page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Dataset #${id} | OpenML`,
    description: `View details, statistics, and download options for dataset #${id} on OpenML.`,
  };
}

/**
 * Dataset Detail Page - Server Component
 * TODO: Fetch actual data using useDataset hook in client component or fetch in server component
 */
export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const datasetId = parseInt(id);

  // Basic validation
  if (isNaN(datasetId)) {
    notFound();
  }

  // TODO: Fetch dataset data from API
  // const dataset = await apiClient.getDataset(datasetId);
  // For now, using placeholder

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-4xl font-bold">Dataset #{datasetId}</h1>
          <Badge>Placeholder</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Detailed dataset information will appear here
        </p>
      </div>

      {/* Construction Notice */}
      <Card className="mb-8 border-yellow-500/50">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-500/10">
              🚧 Under Construction
            </Badge>
          </div>
          <CardTitle>Dataset Detail Page</CardTitle>
          <CardDescription className="text-base">
            <p className="mt-4">This page will display:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              <li>Dataset name, version, and description</li>
              <li>Uploader information and upload date</li>
              <li>Dataset statistics (instances, features, missing values)</li>
              <li>Quality metrics and data characteristics</li>
              <li>Download buttons (CSV, ARFF, Parquet)</li>
              <li>Feature distribution charts</li>
              <li>Related tasks and runs</li>
              <li>Tags and categories</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Placeholder Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium">Dataset ID:</dt>
                <dd className="text-muted-foreground">{datasetId}</dd>
              </div>
              <div>
                <dt className="font-medium">Status:</dt>
                <dd className="text-muted-foreground">Placeholder</dd>
              </div>
              <div>
                <dt className="font-medium">Type:</dt>
                <dd className="text-muted-foreground">Example</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium">Instances:</dt>
                <dd className="text-muted-foreground">TODO: Load from API</dd>
              </div>
              <div>
                <dt className="font-medium">Features:</dt>
                <dd className="text-muted-foreground">TODO: Load from API</dd>
              </div>
              <div>
                <dt className="font-medium">Missing Values:</dt>
                <dd className="text-muted-foreground">TODO: Load from API</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* TypeScript Hook Example */}
      <Card className="mt-6 border-blue-500/50">
        <CardHeader>
          <CardTitle>For Developers</CardTitle>
          <CardDescription>
            <p className="mt-2">
              This page uses the{" "}
              <code className="bg-muted rounded px-1 py-0.5">params.id</code>{" "}
              prop from the Next.js App Router.
            </p>
            <p className="mt-2">
              To fetch data, you can use the{" "}
              <code className="bg-muted rounded px-1 py-0.5">useDataset</code>{" "}
              hook in a Client Component:
            </p>
            <pre className="bg-muted mt-2 overflow-x-auto rounded p-3 text-xs">
              {`'use client';

import { useDataset } from '@/hooks/use-entity';

export function DatasetDetails({ id }: { id: number }) {
  const { data: dataset, isLoading, error } = useDataset(id);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dataset</div>;
  if (!dataset) return <div>Dataset not found</div>;
  
  return <div>{dataset.name}</div>;
}`}
            </pre>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

"use client";

import { Database, FileText, Download, ExternalLink } from "lucide-react";
import { entityTailwindColors } from "@/constants/entityColors";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { cn } from "@/lib/utils";
import type { Dataset } from "@/types/dataset";

interface DataDetailSectionProps {
  dataset: Dataset;
}

/**
 * DataDetailSection Component
 *
 * Displays detailed data information including:
 * - File format and size
 * - Download links
 * - API endpoints
 * - Data preview link
 */
export function DataDetailSection({ dataset }: DataDetailSectionProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://www.openml.org";

  return (
    <CollapsibleSection
      id="data-detail"
      title="Data Detail"
      description="Download links, file formats, and API access"
      icon={
        <Database className={cn("h-4 w-4", entityTailwindColors.data.text)} />
      }
      defaultOpen={false}
    >
      <div className="space-y-6 p-4">
        {/* File Information */}
        <div>
          <h4 className="mb-3 text-sm font-medium">File Information</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Format</div>
              <div className="font-medium">{dataset.format || "ARFF"}</div>
            </div>
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Version</div>
              <div className="font-medium">{dataset.version}</div>
            </div>
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Status</div>
              <div className="font-medium capitalize">{dataset.status}</div>
            </div>
            {dataset.qualities?.NumberOfInstances && (
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Instances</div>
                <div className="font-medium">
                  {dataset.qualities.NumberOfInstances.toLocaleString()}
                </div>
              </div>
            )}
            {dataset.qualities?.NumberOfFeatures && (
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Features</div>
                <div className="font-medium">
                  {dataset.qualities.NumberOfFeatures.toLocaleString()}
                </div>
              </div>
            )}
            {dataset.qualities?.NumberOfClasses && (
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Classes</div>
                <div className="font-medium">
                  {dataset.qualities.NumberOfClasses.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Links */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Download</h4>
          <div className="flex flex-wrap gap-2">
            {dataset.url && (
              <Button variant="outline" size="sm" asChild>
                <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download {dataset.format || "ARFF"}
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <a
                href={`${apiUrl}/api/v1/data/${dataset.data_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Raw Data
              </a>
            </Button>
          </div>
        </div>

        {/* API Endpoints */}
        <div>
          <h4 className="mb-3 text-sm font-medium">API Endpoints</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded border p-2">
              <code className="text-muted-foreground text-xs">
                GET /api/v1/json/data/{dataset.data_id}
              </code>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={`${apiUrl}/api/v1/json/data/${dataset.data_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded border p-2">
              <code className="text-muted-foreground text-xs">
                GET /api/v1/json/data/features/{dataset.data_id}
              </code>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={`${apiUrl}/api/v1/json/data/features/${dataset.data_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded border p-2">
              <code className="text-muted-foreground text-xs">
                GET /api/v1/json/data/qualities/{dataset.data_id}
              </code>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={`${apiUrl}/api/v1/json/data/qualities/${dataset.data_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Code Snippets */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Quick Start</h4>
          <div className="space-y-3">
            <div>
              <div className="text-muted-foreground mb-1 text-xs">Python</div>
              <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                <code>{`import openml
dataset = openml.datasets.get_dataset(${dataset.data_id})
X, y, _, _ = dataset.get_data(target=dataset.default_target_attribute)`}</code>
              </pre>
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-xs">R</div>
              <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                <code>{`library(OpenML)
dataset <- getOMLDataSet(data.id = ${dataset.data_id})`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}

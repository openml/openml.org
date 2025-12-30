"use client";

import Link from "next/link";
import { Database, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";

interface TaskDatasetSectionProps {
  task: Task;
}

/**
 * TaskDatasetSection Component
 *
 * Shows information about the source dataset for this task.
 * Links to the dataset detail page.
 */
export function TaskDatasetSection({ task }: TaskDatasetSectionProps) {
  const datasetName = task.source_data?.name || "Unknown Dataset";
  const datasetId = task.source_data?.data_id;

  return (
    <section id="dataset" className="scroll-mt-20">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Database className="h-5 w-5 text-green-500" />
            Source Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Dataset Icon */}
              <svg
                viewBox="0 0 448 512"
                className="h-10 w-10"
                style={{ color: "#66BB6A" }}
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold">{datasetName}</h3>
                {datasetId && (
                  <p className="text-muted-foreground text-sm">
                    Dataset ID: {datasetId}
                  </p>
                )}
              </div>
            </div>
            {datasetId && (
              <Link href={`/datasets/${datasetId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-2 hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-400"
                >
                  View Dataset
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

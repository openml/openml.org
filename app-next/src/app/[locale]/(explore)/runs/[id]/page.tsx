import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { getRun } from "@/lib/api/run";
import { RunHeader } from "@/components/run/run-header";
import { RunMetricsSection } from "@/components/run/run-metrics-section";
import { RunParametersSection } from "@/components/run/run-parameters-section";
import { RunTagsSection } from "@/components/run/run-tags-section";
import { RunOutputFilesSection } from "@/components/run/run-output-files-section";
import { RunAnalysesSection } from "@/components/run/run-analyses-section";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { WorkspaceSetter } from "@/components/workspace/workspace-setter";
import { entityColors } from "@/constants";
import {
  BarChart3,
  Settings2,
  Tags,
  FileText,
  LineChart,
  Download,
} from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const runId = parseInt(id, 10);

  if (isNaN(runId)) {
    return {
      title: "Run Not Found | OpenML",
    };
  }

  const { run } = await getRun(runId);

  if (!run) {
    return {
      title: "Run Not Found | OpenML",
    };
  }

  return {
    title: `Run ${run.run_id} | OpenML`,
    description: `Details for Run ${run.run_id} on task ${run.task_id} with flow ${run.flow_id}.`,
  };
}

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const runId = parseInt(id, 10);
  if (isNaN(runId)) {
    notFound();
  }

  const { run, error } = await getRun(runId);

  // Show error state if run not found or API error
  if (error || !run) {
    return (
      <div className="container mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">Run Not Found</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            {error ||
              `Run #${runId} could not be found. It may have been deleted or the ID is incorrect.`}
          </p>
          <Link
            href="/runs"
            className="inline-flex items-center gap-2 rounded-md bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            Browse All Runs
          </Link>
        </div>
      </div>
    );
  }

  // Count parameters, evaluations, and tags
  const parametersCount = run.parameter_setting?.length || 0;
  const evaluationsCount = run.output_data?.evaluation?.length || 0;
  const tagsCount = run.tag?.length || 0;

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Push context to the persistent workspace panel */}
        <WorkspaceSetter
          entity={{
            type: "run",
            id: run.run_id,
            title: `Run #${run.run_id}`,
            subtitle: run.flow_name || `Flow #${run.flow_id}`,
            url: `/runs/${run.run_id}`,
            color: entityColors.run,
          }}
          sections={[
            ...(evaluationsCount > 0
              ? [
                  {
                    id: "metrics",
                    label: "Evaluation Metrics",
                    iconName: "BarChart3",
                    count: evaluationsCount,
                  },
                ]
              : []),
            {
              id: "analyses",
              label: "Analyses",
              iconName: "LineChart",
            },
            ...(parametersCount > 0
              ? [
                  {
                    id: "parameters",
                    label: "Parameters",
                    iconName: "Settings2",
                    count: parametersCount,
                  },
                ]
              : []),
            ...(tagsCount > 0
              ? [
                  {
                    id: "tags",
                    label: "Tags",
                    iconName: "Tags",
                    count: tagsCount,
                  },
                ]
              : []),
            {
              id: "output-files",
              label: "Output Files",
              iconName: "Download",
            },
            ...(run.setup_string
              ? [
                  {
                    id: "setup",
                    label: "Setup",
                    iconName: "FileText",
                  },
                ]
              : []),
          ]}
          quickLinks={[
            ...(run.task_id
              ? [
                  {
                    label: `Task #${run.task_id}`,
                    href: `/tasks/${run.task_id}`,
                    iconName: "ExternalLink",
                  },
                ]
              : []),
            {
              label: run.flow_name || `Flow #${run.flow_id}`,
              href: `/flows/${run.flow_id}`,
              iconName: "ExternalLink",
            },
          ]}
          actions={[
            {
              label: "Compare with…",
              href: `/runs/compare?ids=${run.run_id}`,
              iconName: "GitCompareArrows",
            },
          ]}
        />

        {/* Header: Full Width */}
        <RunHeader run={run} />

        {/* Main Content */}
        <div className="mt-6 space-y-6">
          {/* Evaluation Metrics */}
          {evaluationsCount > 0 && (
            <CollapsibleSection
              id="metrics"
              title="Evaluation Metrics"
              description="Performance metrics from cross-validation"
              icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
              badge={evaluationsCount}
              defaultOpen={true}
            >
              <RunMetricsSection run={run} />
            </CollapsibleSection>
          )}

          {/* Analyses - Predictions, Confusion Matrix */}
          <CollapsibleSection
            id="analyses"
            title="Analyses"
            description="Predictions, confusion matrix, and class distribution"
            icon={<LineChart className="h-4 w-4 text-purple-500" />}
            defaultOpen={false}
          >
            <RunAnalysesSection runId={run.run_id} />
          </CollapsibleSection>

          {/* Parameters */}
          {parametersCount > 0 && (
            <CollapsibleSection
              id="parameters"
              title="Parameters"
              description="Flow parameters used in this run"
              icon={<Settings2 className="h-4 w-4 text-gray-500" />}
              badge={parametersCount}
              defaultOpen={true}
            >
              <RunParametersSection run={run} />
            </CollapsibleSection>
          )}

          {/* Tags */}
          {tagsCount > 0 && (
            <CollapsibleSection
              id="tags"
              title="Tags"
              description="Labels and categories for this run"
              icon={<Tags className="h-4 w-4 text-purple-500" />}
              badge={tagsCount}
              defaultOpen={false}
            >
              <RunTagsSection tags={run.tag || []} />
            </CollapsibleSection>
          )}

          {/* Output Files */}
          <CollapsibleSection
            id="output-files"
            title="Output Files"
            description="Download run description and predictions"
            icon={<Download className="h-4 w-4 text-blue-500" />}
            defaultOpen={false}
          >
            <RunOutputFilesSection runId={run.run_id} />
          </CollapsibleSection>

          {/* Setup Description (if available) */}
          {run.setup_string && (
            <CollapsibleSection
              id="setup"
              title="Setup"
              description="Run configuration details"
              icon={<FileText className="h-4 w-4 text-gray-500" />}
              defaultOpen={false}
            >
              <div className="prose dark:prose-invert max-w-none p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  {run.setup_string}
                </pre>
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;

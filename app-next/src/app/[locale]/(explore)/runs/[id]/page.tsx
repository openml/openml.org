import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  FileText,
  BarChart3,
  Settings2,
  Tags,
  AlertCircle,
  LineChart,
  Download,
} from "lucide-react";
import { RunHeader } from "@/components/run/run-header";
import { RunMetricsSection } from "@/components/run/run-metrics-section";
import { RunParametersSection } from "@/components/run/run-parameters-section";
import { RunNavigationMenu } from "@/components/run/run-navigation-menu";
import { RunTagsSection } from "@/components/run/run-tags-section";
import { RunOutputFilesSection } from "@/components/run/run-output-files-section";
import { RunAnalysesSection } from "@/components/run/run-analyses-section";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import Link from "next/link";

// API response types
interface RunApiResponse {
  run?: Run;
  error?: { code: string; message: string };
}

interface Run {
  run_id: number;
  uploader?: string;
  uploader_id?: number;
  upload_time?: string;
  flow_id?: number;
  flow_name?: string;
  task_id?: number;
  task?: {
    task_id?: number;
    task_type?: string;
    source_data?: {
      data_id?: number;
      name?: string;
    };
  };
  visibility?: string;
  error_message?: string | null;
  tag?: string[];
  parameter_setting?: Array<{
    name: string;
    value: string | number | boolean | null;
  }>;
  output_data?: {
    evaluation?: Array<{
      name: string;
      value: string | number;
      stdev?: string | number;
      array_data?: Record<string, string | number>;
      per_fold?: Array<number | number[]>;
    }>;
  };
  nr_of_likes?: number;
  nr_of_downloads?: number;
  nr_of_issues?: number;
  nr_of_downvotes?: number;
  setup_string?: string;
}

// Fetch run data from API - no mock data, proper error handling
async function getRun(
  runId: number,
): Promise<{ run: Run | null; error: string | null }> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_URL_API || "https://www.openml.org/api/v1";
    const response = await fetch(`${apiUrl}/json/run/${runId}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { run: null, error: `Run #${runId} not found` };
      }
      return {
        run: null,
        error: `Failed to fetch run: HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { run: null, error: "Invalid response format from API" };
    }

    const data: RunApiResponse = await response.json();

    if (data.error) {
      return { run: null, error: data.error.message || "Unknown API error" };
    }

    return { run: data.run || null, error: null };
  } catch (error) {
    console.error("Failed to fetch run:", error);
    return { run: null, error: "Failed to connect to OpenML API" };
  }
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
        {/* Header: Full Width */}
        <RunHeader run={run} />

        {/* Content with Sidebar */}
        <div className="relative mt-6 flex min-h-screen gap-8">
          {/* Left: Main Content */}
          <div className="min-w-0 flex-1 space-y-6">
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

          {/* Right: Navigation Menu */}
          <RunNavigationMenu
            hasMetrics={evaluationsCount > 0}
            hasAnalyses={true}
            hasParameters={parametersCount > 0}
            hasTags={tagsCount > 0}
            hasSetup={!!run.setup_string}
            metricsCount={evaluationsCount}
            parametersCount={parametersCount}
            tagsCount={tagsCount}
          />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;

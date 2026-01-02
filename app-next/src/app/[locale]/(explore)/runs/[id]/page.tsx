import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { FileText, BarChart3, Settings2 } from "lucide-react";
import { RunHeader } from "@/components/run/run-header";
import { RunMetricsSection } from "@/components/run/run-metrics-section";
import { RunParametersSection } from "@/components/run/run-parameters-section";
import { RunNavigationMenu } from "@/components/run/run-navigation-menu";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

// Fetch run data from API
async function getRun(runId: number) {
  try {
    // OpenML API returns XML by default, need to specify JSON format
    const apiUrl =
      process.env.NEXT_PUBLIC_URL_API || "https://www.openml.org/api/v1";
    const response = await fetch(`${apiUrl}/json/run/${runId}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`API returned ${response.status} for run ${runId}`);
      return getMockRun(runId);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("API returned non-JSON response, using mock data");
      return getMockRun(runId);
    }

    const data = await response.json();
    return data.run || null;
  } catch (error) {
    console.error("Failed to fetch run:", error);
    return getMockRun(runId);
  }
}

// Mock data for development
function getMockRun(runId: number) {
  return {
    run_id: runId,
    uploader: "Sukmin Yoon",
    uploader_date: "2025-11-19T09:22:43",
    flow_id: 56,
    flow_name: "sklearn.ensemble._forest.RandomForestClassifier",
    task_id: 59,
    task: {
      task_id: 59,
      task_type: "Supervised Classification",
      source_data: {
        data_id: 61,
        name: "iris",
      },
    },
    error_message: null,
    parameter_setting: [
      { name: "bootstrap", value: "true" },
      { name: "criterion", value: "gini" },
      { name: "max_depth", value: "null" },
      { name: "max_features", value: "sqrt" },
    ],
    output_data: {
      evaluation: [
        {
          name: "area_under_roc_curve",
          value: "0.9945",
          array_data: {
            "Iris-setosa": "1.0000",
            "Iris-versicolor": "0.9916",
            "Iris-virginica": "0.9918",
          },
        },
        {
          name: "f_measure",
          value: "0.9533",
          array_data: {
            "Iris-setosa": "1.0000",
            "Iris-versicolor": "0.9293",
            "Iris-virginica": "0.9307",
          },
        },
        {
          name: "kappa",
          value: "0.9300",
        },
        {
          name: "mean_absolute_error",
          value: "0.0369",
        },
      ],
    },
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

  const run = await getRun(runId);
  if (!run) {
    notFound();
  }

  // Count parameters and evaluations
  const parametersCount = run.parameter_setting?.length || 0;
  const evaluationsCount = run.output_data?.evaluation?.length || 0;

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
            hasParameters={parametersCount > 0}
            hasSetup={!!run.setup_string}
            metricsCount={evaluationsCount}
            parametersCount={parametersCount}
          />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;

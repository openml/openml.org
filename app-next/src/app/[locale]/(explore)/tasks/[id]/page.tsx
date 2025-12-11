/**
 * 📚 Task Detail Page
 *
 * Server Component that displays task information.
 * Uses generic entity components for consistency with other entity pages.
 */

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FlaskConical,
  Heart,
  CloudDownload,
  Info,
  Database,
  ArrowLeft,
  Grid3x3,
  Trophy,
  Target,
  Settings,
} from "lucide-react";
import { fetchTask, fetchTaskRunCount } from "@/lib/api/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { entityConfigs } from "@/config/entities";

/**
 * Generate SEO Metadata for Task
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const task = await fetchTask(id);
    const datasetName = task.source_data?.name || "Unknown Dataset";
    const taskType = task.tasktype?.name || task.task_type || "Task";

    return {
      title: `${taskType} on ${datasetName} - OpenML Task`,
      description: `Machine learning task: ${taskType} on dataset ${datasetName}`,
      openGraph: {
        title: `${taskType} on ${datasetName}`,
        description: `OpenML Task #${id}: ${taskType}`,
        type: "article",
        url: `https://www.openml.org/tasks/${id}`,
      },
    };
  } catch {
    return {
      title: "Task Not Found - OpenML",
      description: "The requested task could not be found.",
    };
  }
}

/**
 * Main Task Detail Page Component
 */
export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const config = entityConfigs.task;

  // Parallel data fetching
  const [task, runCount] = await Promise.all([
    fetchTask(id),
    fetchTaskRunCount(id),
  ]);

  const datasetName = task.source_data?.name || "Unknown Dataset";
  const datasetId = task.source_data?.data_id;
  const taskType = task.tasktype?.name || task.task_type || "Unknown Task Type";
  const estimation =
    task.estimation_procedure?.type || task.input?.estimation_procedure?.type;
  const targetFeature =
    task.target_feature || task.input?.source_data?.data_set?.target_feature;

  // Normalize evaluationMeasures to always be an array
  const rawMeasures =
    task.evaluation_measures ||
    task.input?.evaluation_measures?.evaluation_measure;
  const evaluationMeasures: string[] = Array.isArray(rawMeasures)
    ? rawMeasures
    : rawMeasures
      ? [String(rawMeasures)]
      : [];

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl py-8 pl-12">
        <div className="flex gap-8">
          {/* Left: Main Content (70%) */}
          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-start gap-4">
                <Trophy
                  className="h-12 w-12 shrink-0"
                  style={{ color: config.color }}
                />
                <div>
                  <h1 className="text-3xl font-bold">{taskType}</h1>
                  <p className="text-muted-foreground mt-1 text-lg">
                    on{" "}
                    {datasetId ? (
                      <Link
                        href={`/datasets/${datasetId}`}
                        className="text-green-600 hover:underline dark:text-green-400"
                      >
                        {datasetName}
                      </Link>
                    ) : (
                      datasetName
                    )}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 fill-red-500 text-red-500" />
                  <span className="font-medium">
                    {runCount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm">runs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-purple-500 text-purple-500" />
                  <span className="font-medium">{task.runs || 0}</span>
                  <span className="text-muted-foreground text-sm">likes</span>
                </div>
              </div>
            </div>

            {/* Task Configuration Section */}
            <section id="configuration" className="mt-8 scroll-mt-20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Settings className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                Task Configuration
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Task Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{taskType}</p>
                    {task.tasktype?.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {task.tasktype.description}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Target Feature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-500" />
                      <p className="text-lg font-semibold">
                        {targetFeature || "Not specified"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Estimation Procedure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      {estimation || "Not specified"}
                    </p>
                    {task.input?.estimation_procedure?.parameters && (
                      <div className="text-muted-foreground mt-2 text-sm">
                        {Object.entries(
                          task.input.estimation_procedure.parameters,
                        ).map(([key, value]) => (
                          <div key={key}>
                            {key}: {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Evaluation Measures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {evaluationMeasures.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {evaluationMeasures.map(
                          (measure: string, idx: number) => (
                            <Badge key={idx} variant="secondary">
                              {measure}
                            </Badge>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Not specified</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Source Dataset Section */}
            <section id="dataset" className="mt-8 scroll-mt-20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Database className="h-5 w-5 text-green-600 dark:text-green-500" />
                Source Dataset
              </h2>

              <Card className="border-0 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg
                        viewBox="0 0 448 512"
                        className="h-8 w-8"
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
                          className="cursor-pointer hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-400"
                        >
                          View Dataset
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Information Section */}
            <section id="information" className="mt-8 scroll-mt-20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Info className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                Task Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Task ID
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-lg">
                      #{task.task_id}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Task Type ID
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-lg">{task.task_type_id}</p>
                  </CardContent>
                </Card>

                {task.upload_date && (
                  <Card className="border-0 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Upload Date
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">
                        {new Date(task.upload_date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {task.tag && task.tag.length > 0 && (
                  <Card className="border-0 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {task.tag.map((t: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>

          {/* Right: Table of Contents (30%) - Sticky */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-32 space-y-4">
              {/* Table of Contents - Task orange color #FFA726 */}
              <div className="rounded-sm border-l-2 border-amber-500/40 bg-amber-50/70 p-4 dark:bg-amber-950/20">
                <h3 className="mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  On This Page
                </h3>
                <nav className="space-y-1">
                  <a
                    href="#configuration"
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-amber-600 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  >
                    <Settings className="h-4 w-4" />
                    Configuration
                  </a>
                  <a
                    href="#dataset"
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-amber-600 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  >
                    <Database className="h-4 w-4" />
                    Source Dataset
                  </a>
                  <a
                    href="#information"
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-amber-600 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  >
                    <Info className="h-4 w-4" />
                    Information
                  </a>
                </nav>
              </div>

              {/* Navigation Links */}
              <div className="bg-background/40 rounded-sm border-l-2 p-4">
                <h3 className="text-foreground mb-3 text-sm font-semibold">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  <Link
                    href="/tasks"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                  </Link>
                  <Link
                    href="/tasks"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    All Tasks
                  </Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Tell Next.js: Revalidate cached page every hour
export const revalidate = 3600;

/**
 * 📚 Task Detail Page
 *
 * Server Component that displays task information.
 * Uses tab-based navigation matching the original OpenML design:
 * - Task Detail tab: Configuration, dataset info, metadata
 * - Analysis tab: Evaluation chart with metric selector
 * - Runs tab: Paginated list of runs
 */

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { fetchTask, fetchTaskRunCount } from "@/lib/api/task";
import { TaskHeader } from "@/components/task/task-header";
import { TaskDetailAccordion } from "@/components/task/task-detail-accordion";

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

  // Parallel data fetching
  const [task, runCount] = await Promise.all([
    fetchTask(id),
    fetchTaskRunCount(id),
  ]);

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header: Full Width - Name, stats, actions (Kaggle-style) */}
        <TaskHeader task={task} runCount={runCount} />

        {/* Collapsible content (DID datasets style) */}
        <div className="mt-6">
          <TaskDetailAccordion task={task} runCount={runCount} />
        </div>
      </div>
    </div>
  );
}

// Tell Next.js: Revalidate cached page every hour
export const revalidate = 3600;

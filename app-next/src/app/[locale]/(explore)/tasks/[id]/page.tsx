import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BarChart3, List, FileText } from "lucide-react";
import { fetchTask, fetchTaskRunCount } from "@/lib/api/task";
import { TaskHeader } from "@/components/task/task-header";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { TaskDefinitionSection } from "@/components/task/task-definition-section";
import { TaskAnalysisSection } from "@/components/task/task-analysis-section";
import { TaskRunsList } from "@/components/task/task-runs-list";
import { TaskNavigationMenu } from "@/components/task/task-navigation-menu";

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

  // Parallel data fetching for Task details
  const [task, runCount] = await Promise.all([
    fetchTask(id),
    fetchTaskRunCount(id),
  ]);

  // Use task.runs from ES metadata if available, else computed runCount
  const displayRunCount = task.runs || runCount;

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header: Full Width - Name, stats, actions (Kaggle-style) */}
        <TaskHeader task={task} runCount={displayRunCount} />

        {/* Content with Sidebar - Below Header */}
        <div className="relative mt-6 flex min-h-screen gap-8">
          {/* Left: Main Content - Single Column for now to match requested clean look */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* 1. Task Definition (Target, Splits, Metrics) */}
            <CollapsibleSection
              id="definition"
              title="Task Definition"
              description="Target feature, estimation procedure, and metrics"
              icon={<FileText className="h-4 w-4 text-gray-500" />}
              defaultOpen={true}
            >
              <TaskDefinitionSection task={task} />
            </CollapsibleSection>

            {/* 2. Task Analysis / Evaluation */}
            <CollapsibleSection
              id="task-analysis"
              title="Task Analysis"
              description="Performance evaluations and metrics"
              icon={<BarChart3 className="h-4 w-4 text-gray-500" />}
              defaultOpen={true}
            >
              <TaskAnalysisSection task={task} runCount={displayRunCount} />
            </CollapsibleSection>

            {/* 3. Runs List */}
            <CollapsibleSection
              id="runs"
              title="Runs"
              description="List of experimental runs on this task"
              icon={<List className="h-4 w-4 text-gray-500" />}
              badge={displayRunCount}
              defaultOpen={false}
            >
              <TaskRunsList task={task} runCount={displayRunCount} />
            </CollapsibleSection>
          </div>

          {/* Right: Navigation Menu - Responsive */}
          <TaskNavigationMenu runCount={displayRunCount} />
        </div>
      </div>
    </div>
  );
}

// Tell Next.js: Revalidate cached page every hour
export const revalidate = 3600;

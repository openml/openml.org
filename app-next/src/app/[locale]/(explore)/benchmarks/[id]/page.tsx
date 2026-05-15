import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Award, Database, Flag, Cog, FlaskConical, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { BenchmarkDatasetsSection } from "@/components/benchmark/benchmark-datasets-section";
import { BenchmarkTasksSection } from "@/components/benchmark/benchmark-tasks-section";
import { BenchmarkNavigationMenu } from "@/components/benchmark/benchmark-navigation-menu";
import { entityColors } from "@/constants/entityColors";
import Link from "next/link";
import { fetchStudy } from "@/lib/api/study";
import type { StudyData } from "@/lib/api/study";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const study = await fetchStudy(id);
    const typeLabel = study.study_type === "task" ? "Task Suite" : "Run Study";

    return {
      title: `${study.name} - ${typeLabel} - OpenML Benchmarks`, description:
        study.description?.substring(0, 160) ||
        `OpenML Benchmark ${typeLabel} #${id}`,
      openGraph: {
        title: `${study.name} - ${typeLabel}`,
        description: `OpenML Benchmark #${id}: ${study.name}`,
        type: "article",
        url: `https://www.openml.org/benchmarks/${id}`,
      },
    };
  } catch {
    return {
      title: "Benchmark Not Found - OpenML",
      description: "The requested benchmark could not be found.",
    };
  }
}

export default async function BenchmarkDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let study: StudyData;
  try {
    study = await fetchStudy(id);
  } catch {
    notFound();
  }

  const typeLabel = study.study_type === "task" ? "Task Suite" : "Run Study";

  const entityCounts = [
    {
      label: "Datasets",
      count: study.datasets_included || 0,
      icon: Database,
      color: entityColors.data,
    },
    {
      label: "Tasks",
      count: study.tasks_included || 0,
      icon: Flag,
      color: entityColors.task,
    },
    {
      label: "Flows",
      count: study.flows_included || 0,
      icon: Cog,
      color: entityColors.flow,
    },
    {
      label: "Runs",
      count: study.runs_included || 0,
      icon: FlaskConical,
      color: entityColors.run,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: entityColors.benchmarks }}
            >
              {typeLabel}
            </span>
            <span className="text-muted-foreground text-sm">#{id}</span>
          </div>

          <h1 className="mb-4 flex items-center gap-3 text-3xl font-bold tracking-tight">
            <Award
              className="h-8 w-8"
              style={{ color: entityColors.benchmarks }}
              aria-hidden="true"
            />
            {study.name}
          </h1>

          <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {study.uploader && (
              <Link
                href={`/users/${study.uploader_id}`}
                className="hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <User className="h-4 w-4" />
                {study.uploader}
              </Link>
            )}
            {study.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(study.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Entity counts grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {entityCounts
            .filter((e) => e.count > 0)
            .map(({ label, count, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="flex items-center gap-3 pt-6">
                  <Icon className="h-5 w-5" style={{ color }} />
                  <div>
                    <p className="text-2xl font-bold">
                      {Number(count).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Content with Sidebar Navigation */}
        <div className="relative flex gap-8">
          {/* Left: Main Content */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Description */}
            {study.description && (
              <section id="description" className="scroll-mt-20">
                <CollapsibleSection
                  title="Description"
                  icon={
                    <Award
                      className="h-4 w-4"
                      style={{ color: entityColors.benchmarks }}
                    />
                  }
                  defaultOpen={true}
                >
                  <div
                    className="text-muted-foreground prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: study.description }}
                  />
                </CollapsibleSection>
              </section>
            )}

            {/* Datasets Section */}
            <BenchmarkDatasetsSection
              studyId={id}
              totalCount={study.datasets_included || 0}
            />

            {/* Tasks Section */}
            <BenchmarkTasksSection
              studyId={id}
              totalCount={study.tasks_included || 0}
            />
          </div>

          {/* Right: Navigation Menu */}
          <BenchmarkNavigationMenu
            datasetsCount={study.datasets_included || 0}
            tasksCount={study.tasks_included || 0}
            basePath="/benchmarks"
          />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { FileText, Flag, Hash, FlaskConical, Database, BarChart3 } from "lucide-react";
import { fetchMeasure, fetchRelatedTasks } from "@/lib/api/measure";
import { MeasureHeader, MeasureAnalysisSection } from "@/components/measure";
import { MeasureDescriptionSection } from "@/components/measure/measure-description-section";
import { MeasureNavigationMenu } from "@/components/measure/measure-navigation-menu";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const measure = await fetchMeasure(id);
    return {
      title: `${measure.name} - OpenML Measure`,
      description:
        measure.description || `OpenML Measure: ${measure.name}`,
      openGraph: {
        title: `${measure.name} - OpenML Measure`,
        description:
          measure.description || `OpenML Measure #${id}: ${measure.name}`,
        type: "article",
        url: `https://www.openml.org/measures/${id}`,
      },
    };
  } catch {
    return {
      title: "Measure Not Found - OpenML",
      description: "The requested measure could not be found.",
    };
  }
}

export default async function MeasureDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const measure = await fetchMeasure(id);
  const tasks = await fetchRelatedTasks(measure.name);

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <MeasureHeader measure={measure} />

        <div className="relative mt-6 flex min-h-screen gap-8">
          <div className="min-w-0 flex-1 space-y-6">
            {/* 1. Description */}
            <CollapsibleSection
              id="description"
              title="Description"
              description="Details and properties of this measure"
              icon={
                <FileText
                  className="h-4 w-4"
                  style={{ color: entityColors.measures }}
                />
              }
              defaultOpen={true}
            >
              <MeasureDescriptionSection measure={measure} />
            </CollapsibleSection>

            {/* 2. Analysis */}
            <CollapsibleSection
              id="analysis"
              title="Analysis"
              description="Statistics and insights about this measure"
              icon={
                <BarChart3
                  className="h-4 w-4"
                  style={{ color: entityColors.measures }}
                />
              }
              defaultOpen={false}
            >
              <MeasureAnalysisSection measure={measure} />
            </CollapsibleSection>

            {/* 3. Related Tasks */}
            <CollapsibleSection
              id="related-tasks"
              title="Related Tasks"
              description="Tasks that use this measure for evaluation"
              icon={
                <Flag
                  className="h-4 w-4"
                  style={{ color: entityColors.task }}
                />
              }
              badge={tasks.length}
              defaultOpen={false}
            >
              {tasks.length > 0 ? (
                <div className="space-y-0">
                  {tasks.map((t) => (
                    <div
                      key={t.task_id}
                      className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start gap-3">
                          <Flag
                            className="mt-0.5 h-5 w-5 shrink-0"
                            style={{ color: entityColors.task }}
                          />
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-base font-semibold">
                              Task #{t.task_id}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {t.task_type || `Type ${t.task_type_id}`}
                            </Badge>
                          </div>
                        </div>
                        {t.source_data?.name && (
                          <div className="text-muted-foreground mb-2 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Database
                                className="h-3.5 w-3.5"
                                style={{ color: entityColors.data }}
                              />
                              Dataset: {t.source_data.name}
                            </span>
                          </div>
                        )}
                        {t.runs !== undefined && t.runs > 0 && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1.5">
                                  <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                                  {Number(t.runs).toLocaleString()}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Runs</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="openml"
                        className="relative z-10 flex items-center gap-0.75 px-2 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: entityColors.task }}
                      >
                        <Hash className="h-3 w-3" />
                        {t.task_id}
                      </Badge>
                      <Link
                        href={`/tasks/${t.task_id}`}
                        className="absolute inset-0"
                        aria-label={`View task ${t.task_id}`}
                      >
                        <span className="sr-only">View task {t.task_id}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground p-8 text-center">
                  No tasks found using this measure.
                </div>
              )}
            </CollapsibleSection>
          </div>

          <MeasureNavigationMenu
            relatedTaskCount={tasks.length}
            measureType={measure.measure_type}
          />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;

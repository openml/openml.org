import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Award,
  Database,
  GitBranch,
  Zap,
  Calendar,
  User,
} from "lucide-react";
import { getElasticsearchUrl } from "@/lib/elasticsearch";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface StudyData {
  study_id: number;
  study_type: string;
  name: string;
  description?: string;
  uploader?: string;
  uploader_id?: number;
  date?: string;
  datasets_included?: number;
  tasks_included?: number;
  flows_included?: number;
  runs_included?: number;
}

async function fetchStudy(id: string): Promise<StudyData> {
  const url = getElasticsearchUrl(`study/_doc/${id}`);
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Benchmark ${id} not found`);
  }

  const data = await res.json();
  if (!data.found || !data._source) {
    throw new Error(`Benchmark ${id} not found`);
  }

  return data._source as StudyData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const study = await fetchStudy(id);
    const typeLabel =
      study.study_type === "task" ? "Task Suite" : "Run Study";

    return {
      title: `${study.name} - ${typeLabel} - OpenML Benchmarks`,
      description:
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

  const typeLabel =
    study.study_type === "task" ? "Task Suite" : "Run Study";

  const entityCounts = [
    {
      label: "Datasets",
      count: study.datasets_included || 0,
      icon: Database,
      color: "text-green-600",
      href: `/datasets?q=study_${id}`,
    },
    {
      label: "Tasks",
      count: study.tasks_included || 0,
      icon: Award,
      color: "text-blue-600",
      href: `/tasks?q=study_${id}`,
    },
    {
      label: "Flows",
      count: study.flows_included || 0,
      icon: GitBranch,
      color: "text-orange-600",
      href: `/flows?q=study_${id}`,
    },
    {
      label: "Runs",
      count: study.runs_included || 0,
      icon: Zap,
      color: "text-purple-600",
      href: `/runs?q=study_${id}`,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {typeLabel}
            </span>
            <span className="text-muted-foreground text-sm">#{id}</span>
          </div>

          <h1 className="mb-4 flex items-center gap-3 text-3xl font-bold tracking-tight">
            <Award className="h-8 w-8 text-amber-600" aria-hidden="true" />
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
          {entityCounts.map(({ label, count, icon: Icon, color, href }) => (
            <Link key={label} href={href}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="flex items-center gap-3 pt-6">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div>
                    <p className="text-2xl font-bold">
                      {Number(count).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">{label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Description */}
        {study.description && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <div className="text-muted-foreground prose dark:prose-invert max-w-none whitespace-pre-wrap">
                {study.description}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export const revalidate = 3600;

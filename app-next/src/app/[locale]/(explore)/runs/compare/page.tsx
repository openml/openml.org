import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft, GitCompareArrows } from "lucide-react";
import { getRun } from "@/lib/api/run";
import type { RunDetail } from "@/lib/api/run";
import { RunComparisonClient } from "@/components/run/run-comparison-client";
import { WorkspaceSetter } from "@/components/workspace/workspace-setter";
import { entityColors } from "@/constants";

export const metadata: Metadata = {
  title: "Compare Runs | OpenML",
  description: "Side-by-side comparison of multiple OpenML runs.",
};

export default async function RunComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const idsRaw = typeof sp.ids === "string" ? sp.ids : "";
  const runIds = idsRaw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0)
    .slice(0, 10); // Cap at 10 runs

  if (runIds.length < 2) {
    return (
      <div className="container mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="text-muted-foreground mb-4 h-16 w-16" />
          <h1 className="mb-2 text-2xl font-bold">
            Need at Least 2 Runs to Compare
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Add run IDs to the URL like{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              /runs/compare?ids=123,456
            </code>{" "}
            or use the checkboxes on the run search page.
          </p>
          <Link
            href="/runs"
            className="inline-flex items-center gap-2 rounded-md bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Runs
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all runs in parallel
  const results = await Promise.all(runIds.map((id) => getRun(id)));

  const runs: RunDetail[] = [];
  const errors: string[] = [];

  for (let i = 0; i < results.length; i++) {
    if (results[i].run && results[i].error === null) {
      runs.push(results[i].run!);
    } else {
      errors.push(results[i].error || `Run #${runIds[i]} could not be loaded`);
    }
  }

  if (runs.length < 2) {
    return (
      <div className="container mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">
            Could Not Load Enough Runs
          </h1>
          <p className="text-muted-foreground mb-4 max-w-md">
            At least 2 runs are needed for comparison. Only {runs.length} could
            be loaded.
          </p>
          {errors.length > 0 && (
            <ul className="text-muted-foreground mb-6 text-sm">
              {errors.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          )}
          <Link
            href="/runs"
            className="inline-flex items-center gap-2 rounded-md bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Runs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Push context to the persistent workspace panel */}
        <WorkspaceSetter
          entity={{
            type: "run",
            id: `compare-${runIds.join("-")}`,
            title: "Compare Runs",
            subtitle: runs.map((r) => `#${r.run_id}`).join(", "),
            url: `/runs/compare?ids=${runIds.join(",")}`,
            color: entityColors.run,
            resetHref: "/runs",
          }}
          sections={runs.map((r) => ({
            id: `run-${r.run_id}`,
            label: `Run #${r.run_id}`,
            iconName: "ExternalLink",
            href: `/runs/${r.run_id}`,
          }))}
        />

        {/* Header */}
        <header className="space-y-3 border-b pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/runs"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <GitCompareArrows className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Compare Runs
              </h1>
              <p className="text-muted-foreground text-sm">
                {runs.length} runs side-by-side —{" "}
                {runs.map((r) => `#${r.run_id}`).join(", ")}
              </p>
            </div>
          </div>

          {/* Run summary cards */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {runs.map((run, i) => (
              <Link
                key={run.run_id}
                href={`/runs/${run.run_id}`}
                className="hover:bg-muted/50 group flex items-start gap-2 rounded-lg border p-3 transition-colors"
              >
                <span
                  className="mt-1 h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: [
                      "#3b82f6",
                      "#22c55e",
                      "#f59e0b",
                      "#ef4444",
                      "#8b5cf6",
                      "#ec4899",
                      "#14b8a6",
                      "#f97316",
                    ][i % 8],
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Run #{run.run_id}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {run.flow_name || `Flow #${run.flow_id}`}
                  </p>
                  {run.task_id && (
                    <p className="text-muted-foreground text-xs">
                      Task #{run.task_id}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
              {errors.length} run(s) could not be loaded: {errors.join("; ")}
            </div>
          )}
        </header>

        {/* Client-side interactive comparison */}
        <div className="mt-6">
          <RunComparisonClient runs={runs} />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;

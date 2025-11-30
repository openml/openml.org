import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";
import { Target, BarChart3, ArrowRight, MoveUpRight } from "lucide-react";

export function BenchmarkingSection() {
  return (
    <SectionContainer
      id="benchmarking-suites"
      className="bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
    >
      <div className="mb-16 text-center">
        <h2 className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Benchmarking Suites
          <span className="text-muted-foreground mt-2 block text-2xl font-normal">
            The Scientific Method
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
          <span className="text-foreground font-semibold">
            Rigorous Model Comparison:
          </span>
          Validate your research against curated benchmarking suites. Ensure
          your algorithm performs well across diverse domains, from medical
          imaging to tabular financial data.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Feature 1: Tasks (The Problem) */}
        <Card className="group hover:border-primary relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="relative space-y-6 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Target className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2 text-2xl font-bold">Tasks</CardTitle>
                <p className="text-muted-foreground text-sm font-medium">
                  The Problem
                </p>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed">
              Standardized machine learning challenges with fixed evaluation
              metrics (AUC, RMSE, Accuracy). Each task provides predefined
              train/test splits to ensure your results are comparable and
              peer-review ready.
            </CardDescription>

            <Link href="/tasks" className="block">
              <Button
                variant="outline"
                className="group/btn w-full transition-all duration-300 hover:bg-blue-500 hover:text-white"
              >
                View Tasks
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
        </Card>

        {/* Feature 2: Suites (The Collection) */}
        <Card className="group hover:border-primary relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="relative space-y-6 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <BarChart3 className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2 text-2xl font-bold">
                  Suites
                </CardTitle>
                <p className="text-muted-foreground text-sm font-medium">
                  The Collection
                </p>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed">
              Curated collections of tasks (e.g., "AutoML Benchmark," "Medical
              Diagnosis Suite") for comprehensive algorithm stress-testing
              across multiple datasets and problem domains.
            </CardDescription>

            <Link href="/benchmarks" className="block">
              <Button
                variant="outline"
                className="group/btn w-full transition-all duration-300 hover:bg-purple-500 hover:text-white"
              >
                Browse Suites
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </div>
    </SectionContainer>
  );
}

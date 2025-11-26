import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";

/**
 * Reproducible Benchmarks Section - Server Component
 * From user's diagram: reproducible benchmarks (tests, benchmarking suites)
 */
export function BenchmarksSection() {
  return (
    <SectionContainer id="benchmarks" className="bg-muted/30">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          reproducible benchmarks
        </h2>
        <p className="text-muted-foreground text-lg">
          Standardized tasks and benchmarking suites for fair model comparison
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        {/* Tests */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">tests</CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p>
                Standardized machine learning tasks with predefined train/test
                splits and evaluation measures
              </p>
              <Link
                href="/tasks"
                className="text-primary inline-block font-medium hover:underline"
              >
                View Tasks →
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Benchmarking Suites */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="mb-4 text-2xl">benchmarking suites</CardTitle>
            <CardDescription className="space-y-4 text-base">
              <p>
                Curated collections of tasks for comprehensive algorithm
                evaluation across multiple datasets
              </p>
              <Link
                href="/benchmarks"
                className="text-primary inline-block font-medium hover:underline"
              >
                Browse Suites →
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SectionContainer>
  );
}

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

/**
 * Hero Section - Server Component
 * Main hero with 3 value propositions from user's diagram
 * RunPod-inspired gradient background
 */
export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background (RunPod style) */}
      <div className="from-primary/10 via-background to-accent dark:from-primary/20 dark:via-background dark:to-primary/5 absolute inset-0 bg-gradient-to-br" />
      <div className="from-primary/5 absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] via-transparent to-transparent" />

      <div className="relative container mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-32">
        {/* Main Heading */}
        <div className="mb-16 text-center">
          <h1 className="from-foreground to-foreground/70 mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight md:text-6xl">
            openML
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl">
            Open platform for sharing datasets, algorithms, and experiments to
            build a global machine learning repository
          </p>
        </div>

        {/* Three Main CTAs - From User's Diagram */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Get the Data */}
          <Card className="hover:shadow-primary/5 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="text-3xl">📊</span>
              </div>
              <CardTitle className="mb-2 text-2xl">Get the Data</CardTitle>
              <CardDescription className="text-base">
                Access thousands of datasets ready for machine learning
                experiments
              </CardDescription>
              <Link href="/datasets" className="mt-4 block">
                <Button className="w-full">Explore Datasets</Button>
              </Link>
            </CardHeader>
          </Card>

          {/* Reproducible benchmarks */}
          <Card className="hover:shadow-primary/5 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="text-3xl">🎯</span>
              </div>
              <CardTitle className="mb-2 text-2xl">
                Reproducible benchmarks
              </CardTitle>
              <CardDescription className="text-base">
                Run standardized benchmarks and compare results with the
                community
              </CardDescription>
              <Link href="/tasks" className="mt-4 block">
                <Button className="w-full">View Tasks</Button>
              </Link>
            </CardHeader>
          </Card>

          {/* Frictionless ML */}
          <Card className="hover:shadow-primary/5 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="text-3xl">⚡</span>
              </div>
              <CardTitle className="mb-2 text-2xl">Frictionless ML</CardTitle>
              <CardDescription className="text-base">
                Import data, build models, and share experiments with minimal
                friction
              </CardDescription>
              <Link href="/flows" className="mt-4 block">
                <Button className="w-full">Explore Flows</Button>
              </Link>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

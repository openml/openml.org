import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";
import { Download, Cog, Upload, ArrowRight } from "lucide-react";
import Image from "next/image";

/**
 * The Workflow Loop Section - Server Component
 * Visualizes the cycle of open science: Local Environment → Cloud → Community
 */
export function WorkflowLoopSection() {
  return (
    <SectionContainer
      id="workflow-loop"
      className="bg-muted/30"
      style={{
        backgroundImage:
          "conic-gradient(at right center, rgb(199, 210, 254), rgb(71, 85, 105), rgb(199, 210, 254))",
      }}
    >
      <div className="mb-16 text-center">
        <h2 className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          The Workflow Loop
          <span className="text-muted-foreground mt-2 block text-2xl font-normal">
            Frictionless ML
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
          <span className="text-foreground font-semibold">
            The Cycle of Open Science:
          </span>{" "}
          Seamlessly integrate OpenML into your ML workflow
        </p>
      </div>
      <Image
        src="/licensed-image.jpg"
        alt="Workflow Loop"
        width={350}
        height={250}
        className="mx-auto"
      />

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {/* Step 1: Import */}
        <Card className="group hover:border-primary relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="relative space-y-6 p-8">
            {/* Step Number Badge */}
            <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-xl font-bold text-white shadow-lg">
              1
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Download className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2 text-2xl font-bold">
                  Import
                </CardTitle>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed">
              Load data in one line. Compatible with Scikit-learn, PyTorch,
              TensorFlow, and XGBoost.
            </CardDescription>

            {/* Technology Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                Scikit-learn
              </Badge>
              <Badge variant="outline" className="text-xs">
                PyTorch
              </Badge>
              <Badge variant="outline" className="text-xs">
                TensorFlow
              </Badge>
              <Badge variant="outline" className="text-xs">
                XGBoost
              </Badge>
            </div>

            <Link href="/docs/getting-started" className="block">
              <Button
                variant="outline"
                className="group/btn w-full transition-all duration-300 hover:bg-green-500 hover:text-white"
              >
                Get Started Guide
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
        </Card>

        {/* Step 2: Build & Run */}
        <Card className="group hover:border-primary relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="relative space-y-6 p-8">
            {/* Step Number Badge */}
            <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-xl font-bold text-white shadow-lg">
              2
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Cog className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2 text-2xl font-bold">
                  Build & Run
                </CardTitle>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed">
              Train your models locally using your preferred compute resources.
              Full control over your development environment and infrastructure.
            </CardDescription>

            {/* Visual Emphasis */}
            <div className="border-muted-foreground/30 bg-muted/50 rounded-lg border border-dashed p-4">
              <p className="text-muted-foreground text-center text-sm">
                <span className="font-semibold">Local Control</span>
                <br />
                Your compute, your way
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Step 3: Export & Publish */}
        <Card className="group hover:border-primary relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="relative space-y-6 p-8">
            {/* Step Number Badge */}
            <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-xl font-bold text-white shadow-lg">
              3
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Upload className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2 text-2xl font-bold">
                  Export & Publish
                </CardTitle>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed">
              <span className="font-semibold">Automatic Publishing.</span> Push
              your workflows, run parameters, and evaluation metrics to the
              OpenML hub for citations and collaboration.
            </CardDescription>

            {/* Flow Tags */}
            <div className="space-y-2">
              <Link
                href="/flows"
                className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
              >
                → Flows
                <span className="text-muted-foreground text-xs">
                  (workflows)
                </span>
              </Link>
              <Link
                href="/runs"
                className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
              >
                → Runs
                <span className="text-muted-foreground text-xs">
                  (experiments)
                </span>
              </Link>
              <Link
                href="/measures"
                className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
              >
                → Metrics
                <span className="text-muted-foreground text-xs">
                  (evaluation)
                </span>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </SectionContainer>
  );
}

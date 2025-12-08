import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";
import {
  Download,
  Cog,
  Upload,
  ArrowBigRight,
  CornerRightUp,
} from "lucide-react";
import Image from "next/image";
import {
  WorkflowImportIcon,
  WorkflowRunIcon,
  WorkflowExportIcon,
} from "@/components/home/workflowLoopIcons";

export function WorkflowLoopSection() {
  return (
    <SectionContainer className="bg-muted/30 overflow-hidden">
      <div className="relative container mx-auto max-w-7xl px-4 py-18 md:px-6 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-muted-foreground mb-10 text-4xl font-bold tracking-tight md:text-5xl">
            The OpenML Workflow Loop
            <span className="my-3 block text-2xl font-normal text-slate-800 dark:text-slate-300">
              Integrate OpenML into every step of your ML workflow.
            </span>
          </h1>
        </div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-3">
          <WorkflowConnectorArrow className="left-[calc(33.33%-0.5rem)]" />
          <WorkflowConnectorArrow className="left-[calc(66.66%+0.3rem)]" />
          {/* Step 1: Import */}
          <Card className="group hover:border-primary relative mb-0 flex flex-col overflow-hidden border-2 pb-6 transition-all duration-300 hover:shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Step Number Badge */}
            <div className="absolute -top-2 -right-2 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tl from-[#6366f1] to-[#8b5cf6] text-xl font-bold text-white shadow-lg">
              1
            </div>
            <CardHeader className="relative mb-0 space-y-2 px-8 pt-3 pb-0">
              <div className="flex items-end gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-baseline rounded-xl bg-linear-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <WorkflowImportIcon />
                </div>
                <div className="flex-1">
                  <CardTitle className="-mb-2 text-2xl font-bold">
                    Import
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="my-1 text-base leading-relaxed">
                Load OpenML datasets in a single line of code, compatible with
                scikit-learn, PyTorch, TensorFlow, XGBoost, and more.
              </CardDescription>
              {/* logos placeholder */}
              <Step1Visuals />
            </CardHeader>
            <CardFooter className="mt-6 -mb-6 flex-1">
              <Link
                href="/docs/getting-started"
                className="mt-2 mb-0 flex w-full border-t-2 border-slate-400 lg:my-6"
              >
                <Button
                  variant="outline"
                  className="group/btn mr-2 w-full justify-end transition-all duration-300 group-hover:translate-x-1 group-hover:scale-105 dark:hover:bg-transparent dark:hover:text-white"
                >
                  Get Started Guide
                  <CornerRightUp className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <WorkflowVerticalArrow className="left-[calc(50%)] -mt-3 block rotate-90" />
          {/* Step 2: Build & Run */}
          <Card className="group hover:border-primary relative mb-0 overflow-hidden border-2 pb-6 transition-all duration-300 hover:shadow-xl">
            <div className="absolute inset-0 flex flex-col bg-linear-to-br from-[#8b5cf6]/5 to-[#ec4899]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Step Number Badge */}
            <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#8b5cf6] to-[#ec4899] text-xl font-bold text-white shadow-lg">
              2
            </div>
            <CardHeader className="relative mb-0 space-y-2 px-8 pt-3 pb-0">
              <div className="flex items-end gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-end rounded-xl bg-linear-to-br from-[#8b5cf6] to-[#ec4899] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <WorkflowRunIcon />
                </div>
                <div className="flex-1">
                  <CardTitle className="-mb-2 text-2xl font-bold">
                    Build & Run
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="my-1 text-base leading-relaxed">
                Train and evaluate models on those tasks using your favorite ML
                libraries. Try different pipelines and hyperparameters until you
                get results you are happy with.
              </CardDescription>
              {/* Visual Emphasis */}
              <Step2Diagram
                light="/img/step2-BuildRun_lMode.png"
                dark="/img/step2-BuildRun_dMode.png"
                alt="Step 2 Build & Run diagram"
              />
            </CardHeader>
          </Card>
          <WorkflowVerticalArrow className="left-[calc(50%)] -mt-3 block rotate-90" />

          <Card className="group hover:border-primary relative mb-0 overflow-hidden border-2 pb-6 transition-all duration-300 hover:shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-[#ec4899]/5 to-[#6366f1]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Step Number Badge */}
            <div className="absolute -top-2 -right-2 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#ec4899] to-[#6366f1] text-xl font-bold text-white shadow-lg">
              3
            </div>
            <CardHeader className="relative mb-0 space-y-2 px-8 pt-3 pb-0">
              <div className="flex items-end gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#ec4899] to-[#6366f1] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <WorkflowExportIcon />
                </div>
                <div className="flex-1">
                  <CardTitle className="mb-2 text-2xl font-bold">
                    Export & Publish
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="my-1 text-base leading-relaxed">
                <span className="font-semibold">Automatically publish</span>:{" "}
                Upload your workflows (flows), experiments (runs), and
                evaluation metrics back to OpenML so others can compare and
                reuse them.
              </CardDescription>
              {/* Flow Tags */}
              <div className="ml-3 space-y-2">
                <Link
                  href="/flows"
                  className="text-primary text-md flex items-center gap-2 font-medium transition group-hover:no-underline hover:scale-105 hover:opacity-90"
                >
                  → Flows
                  <span className="border-text-primary light:text-primary dark:border-text-slate-200 rounded-sm border-2 px-4 py-1 text-xs font-bold uppercase opacity-70">
                    workflows
                  </span>
                </Link>
                <Link
                  href="/runs"
                  className="text-primary text-md flex items-center gap-2 font-medium transition group-hover:no-underline hover:scale-105 hover:opacity-90"
                >
                  → Runs
                  <span className="border-text-primary light:text-primary dark:border-text-slate-200 rounded-sm border-2 px-4 py-1 text-xs font-bold uppercase opacity-70">
                    experiments
                  </span>
                </Link>
                <Link
                  href="/measures"
                  className="text-primary text-md flex items-center gap-2 font-medium transition group-hover:no-underline hover:scale-105 hover:opacity-90"
                >
                  → Metrics
                  <span className="border-text-primary light:text-primary dark:border-text-slate-200 rounded-sm border-2 px-4 py-1 text-xs font-bold uppercase opacity-70">
                    evaluation
                  </span>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </SectionContainer>
  );
}

const Step1Visuals = () => (
  <div className="relative mt-2 flex w-full justify-between gap-x-2">
    <Link
      href="/documentation/pytorch/"
      title="OpenML is compatible with PyTorch Flows"
    >
      <Image
        src="/img/PyTorch-logo.png"
        alt="PyTorch logo"
        height={150}
        width={150}
        priority
        className="h-9 w-auto rounded-xs bg-white object-contain p-0.75"
      />
    </Link>
    <Link href="/runs">
      <Image
        src="/img/Scikit-learn-logo.png"
        alt="Scikit-learn logo"
        height={150}
        width={150}
        priority
        className="h-9 w-auto rounded-xs bg-white object-contain p-0.75"
      />
    </Link>
    <Link href="/runs">
      <Image
        src="/img/TensorFlow-logo.png"
        alt="TensorFlow logo"
        height={150}
        width={150}
        priority
        className="h-9 w-auto rounded-xs bg-white object-contain p-0.75"
      />
    </Link>
    <Link href="/runs">
      <Image
        src="/img/XGBoost-logo.png"
        alt="XGBoost logo"
        height={150}
        width={150}
        priority
        className="h-9 w-auto rounded-xs bg-white object-contain p-0.75"
      />
    </Link>
  </div>
);

const Step2Diagram: React.FC<{ light: string; dark: string; alt: string }> = ({
  light,
  dark,
  alt,
}) => {
  return (
    <div className="relative mt-2 w-full">
      <Image
        src={light}
        alt={alt}
        width={1400}
        height={700}
        className="h-auto w-full object-contain dark:hidden"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
      />
      <Image
        src={dark}
        alt={alt}
        width={1400}
        height={700}
        className="hidden h-auto w-full object-contain dark:block"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
      />
    </div>
  );
};

const WorkflowConnectorArrow: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={`absolute top-3/10 z-10 hidden h-9 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/70 shadow-md lg:flex ${className}`}
  >
    <ArrowBigRight className="text-primary/70 h-8 w-8" />
  </div>
);

const WorkflowVerticalArrow: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={`absolute top-3/10 z-10 flex h-9 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/70 shadow-md lg:hidden ${className}`}
  >
    <ArrowBigRight className="text-primary/70 h-8 w-8" />
  </div>
);


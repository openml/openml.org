import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";

export function ThreePillarsSection() {
  return (
    <div className="three-pillars-background relative overflow-hidden">
      <div className="py-18md:px-6 relative container mx-auto max-w-7xl px-4 md:py-24">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="from-foreground to-foreground/70 light:text-slate-950 mb-6 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight md:text-6xl dark:bg-[linear-gradient(15deg,#ec4899,#6366f1,#ec4899,#8b5cf6,#ec4899)] dark:bg-clip-text dark:text-transparent">
            The Three Pillars of OpenML
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl">
            Open platform for sharing datasets, algorithms, and experiments to
            build a global machine learning repository
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <Card className="hover:shadow-primary/5 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <Image
                src="/icons/scale.jpg"
                alt="Dataset"
                width={160}
                height={160}
                priority
                className="mx-auto mb-0 flex items-center justify-center dark:hidden"
              />
              <Image
                src="/icons/dark-scale.jpg"
                alt="Dataset"
                width={160}
                height={160}
                priority
                className="border-primary/20 mx-auto mb-0 hidden items-center justify-center rounded-2xl border dark:block"
              />
              <CardTitle className="mb-2 text-2xl">
                FAIR Data at Scale
              </CardTitle>
              <CardDescription className="text-base">
                Access thousands of uniformly formatted datasets. Every dataset
                is versioned, meta-tagged, and ready for immediate loading into
                your analysis pipeline.
              </CardDescription>
              <Link href="/datasets" className="mt-4 block">
                <Button className="w-full transition hover:scale-105 dark:bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)] dark:text-white">
                  Explore Datasets <MoveRight />
                </Button>
              </Link>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-primary/5 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <Image
                src="/icons/ObjectiveEvaluation.jpg" // Your light-specific image
                alt="Dataset"
                width={160}
                height={160}
                priority
                className="mx-auto mb-0 flex items-center justify-center dark:hidden"
              />
              <Image
                src="/icons/dark-dataset.jpg"
                alt="Dataset"
                width={160}
                height={160}
                priority
                className="border-primary/20 mx-auto mb-0 hidden items-center justify-center rounded-2xl border dark:block"
              />
              <CardTitle className="mb-2 text-2xl">
                Objective Evaluation
              </CardTitle>
              <CardDescription className="text-base">
                Stop guessing. Run your algorithms on standardized tasks with
                predefined train/test splits to ensure your results are
                comparable and peer-review ready.
              </CardDescription>
              <Link href="/tasks" className="mt-4 block">
                <Button className="w-full transition hover:scale-105 dark:bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)] dark:text-white">
                  View Benchmark Tasks <MoveRight />
                </Button>
              </Link>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-primary/5 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <Image
                src="/icons/FrictionlessMLFlows.jpg"
                alt="Dataset"
                width={160}
                height={160}
                priority
                className="mx-auto mb-0 flex items-center justify-center dark:hidden"
              />
              <Image
                src="/icons/dark-frictionless.jpg"
                alt="Dataset"
                width={160}
                height={160}
                priority
                className="border-primary/20 mx-auto mb-0 hidden items-center justify-center rounded-2xl border dark:block"
              />
              <CardTitle className="mb-2 text-2xl">
                Frictionless ML Flows
              </CardTitle>
              <CardDescription className="text-base">
                Treat experiments as objects. Share your model pipelines (flows)
                and results (runs) automatically to create a transparent
                scientific record.
              </CardDescription>
              <Link href="/flows" className="mt-4 block">
                <Button className="w-full transition hover:scale-105 dark:bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)] dark:text-white">
                  Explore Flows <MoveRight />
                </Button>
              </Link>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

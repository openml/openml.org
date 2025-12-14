"use client";
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
import { useTranslations } from "next-intl";

export function ThreePillarsSection() {
  const t = useTranslations("home.threePillars");

  return (
    <div className="three-pillars-background relative overflow-hidden">
      <div className="py-18md:px-6 relative container mx-auto max-w-7xl px-4 md:py-24">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="from-foreground to-foreground/70 light:text-slate-950 mb-6 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight md:text-6xl dark:bg-[linear-gradient(15deg,#ec4899,#6366f1,#ec4899,#8b5cf6,#ec4899)] dark:bg-clip-text dark:text-transparent">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl">
            {t("subtitle")}
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
                {t("fairData.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("fairData.description")}
              </CardDescription>
              <Link href="/datasets" className="mt-4 block">
                <Button className="w-full transition hover:scale-105 dark:bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)] dark:text-white">
                  {t("fairData.button")} <MoveRight />
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
                {t("objectiveEvaluation.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("objectiveEvaluation.description")}
              </CardDescription>
              <Link href="/tasks" className="mt-4 block">
                <Button className="w-full transition hover:scale-105 dark:bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)] dark:text-white">
                  {t("objectiveEvaluation.button")} <MoveRight />
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
                {t("frictionlessFlows.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("frictionlessFlows.description")}
              </CardDescription>
              <Link href="/flows" className="mt-4 block">
                <Button className="w-full transition hover:scale-105 dark:bg-[linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)] dark:text-white">
                  {t("frictionlessFlows.button")} <MoveRight />
                </Button>
              </Link>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

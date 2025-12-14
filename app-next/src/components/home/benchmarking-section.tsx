"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/layout/section-container";
import {
  BarChart3,
  ArrowRight,
  MoveUpRight,
  CornerRightUp,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function BenchmarkingSection() {
  const t = useTranslations("home.benchmarking");

  return (
    <SectionContainer id="benchmarking-suites" className="bg-muted/30">
      <div className="mb-10 text-center">
        <h1 className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          {t("title")}
          <span className="mt-2 block text-3xl font-normal text-slate-800 dark:text-slate-300">
            {t("subtitle")}
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-4xl text-xl leading-relaxed">
          <span className="text-foreground font-semibold">
            Validate your models{" "}
          </span>
          {t("description").replace("Validate your models ", "")}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Feature 1: Tasks (The Problem) */}
        <Card className="group hover:border-primary relative mb-0 overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="relative space-y-4 px-8 py-3">
            <div className="gradient-bg p2 flex items-end gap-2 rounded-tl-xl rounded-tr-xl">
              <div className="justify-centerbg-white flex h-[100px] w-[100px] shrink-0 items-center p-2 mix-blend-multiply transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/icons/Benchmarking-tasks01.png"
                  alt="Task"
                  width={100}
                  height={100}
                  className="m-1 h-full w-full rounded-2xl bg-white object-cover"
                  priority
                />
              </div>
              <div className="flex-1 pb-2 text-white">
                <CardTitle className="mb-0 text-4xl font-bold">
                  {t("tasks.title")}
                </CardTitle>
                <p className="text-muted-foreground dark:text-accent text-lg font-medium">
                  {t("tasks.subtitle")}
                </p>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed">
              {t("tasks.description")}
            </CardDescription>

            <Link href="/tasks" className="flex border-t-2 border-slate-400">
              <Button
                variant="outline"
                className="group/btn mr-2 w-full justify-end shadow-none transition-all duration-300 hover:translate-x-1 hover:scale-105 hover:bg-transparent dark:hover:bg-transparent dark:hover:text-white"
              >
                {t("tasks.button")}
                <CornerRightUp className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
        </Card>

        {/* Feature 2: Suites (The Collection) */}
        <Card className="group hover:border-primary relative mb-0 overflow-hidden border-2 transition-all duration-300 hover:shadow-xl">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <CardHeader className="relative space-y-4 px-8 py-3">
            <div className="gradient-bg p2 flex items-end gap-2 rounded-tl-xl rounded-tr-xl">
              <div className="justify-centerbg-white flex h-[100px] w-[100px] shrink-0 items-center p-2 mix-blend-multiply transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/icons/Benchmarking-suits.png"
                  alt="Task"
                  width={100}
                  height={100}
                  className="h-full w-full bg-white object-cover p-1"
                  priority
                />
              </div>
              <div className="flex-1 pb-2 text-white">
                <CardTitle className="mb-0 text-4xl font-bold">
                  {t("suites.title")}
                </CardTitle>
                <p className="text-muted-foreground dark:text-accent text-lg font-medium">
                  {t("suites.subtitle")}
                </p>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed">
              {t("suites.description")}
            </CardDescription>

            <Link
              href="/benchmarks"
              className="flex border-t-2 border-slate-400"
            >
              <Button
                variant="outline"
                className="group/btn mr-2 w-full justify-end shadow-none transition-all duration-300 hover:translate-x-1 hover:scale-105 hover:bg-transparent dark:hover:bg-transparent dark:hover:text-white"
              >
                {t("suites.button")}
                <CornerRightUp className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </div>
    </SectionContainer>
  );
}

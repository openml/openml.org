"use client";

import { ENTITY_ICONS, entityColors } from "@/constants";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { createBenchmarkConfig } from "./benchmark-search-config";
import { StudySearchPage } from "../shared/study-search-page";
import type { SearchTab } from "../shared/search-tabs";

const TABS: SearchTab[] = [
  { label: "Task Suites", path: "/benchmarks/tasks" },
  { label: "Run Studies", path: "/benchmarks/runs" },
];

interface BenchmarksSearchPageProps {
  studyType: "task" | "run";
  title: string;
  description: string;
}

const BenchmarkIcon = (props: React.HTMLAttributes<HTMLElement>) => (
  // FontAwesomeIcon accepts HTML attributes, not full SVG props
  <FontAwesomeIcon
    icon={ENTITY_ICONS.benchmark}
    className={props.className}
    style={props.style as FontAwesomeIconProps["style"]}
  />
);

export function BenchmarksSearchPage({
  studyType,
  title,
  description,
}: BenchmarksSearchPageProps) {
  return (
    <StudySearchPage
      studyType={studyType}
      title={title}
      description={description}
      basePath="/benchmarks"
      icon={BenchmarkIcon}
      entityColor={entityColors.benchmarks}
      tabs={TABS}
      createConfig={createBenchmarkConfig}
    />
  );
}

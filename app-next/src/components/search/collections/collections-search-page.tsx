"use client";

import { Layers } from "lucide-react";
import { entityColors } from "@/constants/entityColors";
import { createCollectionConfig } from "./collection-search-config";
import { StudySearchPage } from "../shared/study-search-page";
import type { SearchTab } from "../shared/search-tabs";

const TABS: SearchTab[] = [
  { label: "Task Collections", path: "/collections/tasks" },
  { label: "Run Collections", path: "/collections/runs" },
];

interface CollectionsSearchPageProps {
  studyType: "task" | "run";
  title: string;
  description: string;
  basePath?: string;
}

export function CollectionsSearchPage({
  studyType,
  title,
  description,
  basePath = "/collections",
}: CollectionsSearchPageProps) {
  return (
    <StudySearchPage
      studyType={studyType}
      title={title}
      description={description}
      basePath={basePath}
      icon={Layers}
      entityColor={entityColors.collections}
      tabs={TABS}
      createConfig={createCollectionConfig}
    />
  );
}

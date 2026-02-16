"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import { useSearchParams } from "next/navigation";
import { createCollectionConfig } from "./collection-search-config";
import { CollectionsSearchContainer } from "./collections-search-container";
import { Layers } from "lucide-react";
import { entityColors } from "@/constants/entityColors";

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
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const config = createCollectionConfig(studyType);

  return (
    <SearchProvider
      config={
        {
          ...config,
          initialState: {
            ...config.initialState,
            searchTerm: initialQuery,
          },
        } as SearchDriverOptions
      }
    >
      <div className="flex min-h-screen flex-col">
        {/* Page Header */}
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-8 sm:px-6">
            <div className="flex items-start gap-3">
              <Layers
                className="h-8 w-8"
                style={{ color: entityColors.collections }}
                aria-hidden="true"
              />
              <div className="space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="mx-auto w-full flex-1 px-1.5 py-6">
          <CollectionsSearchContainer basePath={basePath} />
        </div>
      </div>
    </SearchProvider>
  );
}

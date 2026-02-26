"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CollectionsSearchContainer } from "../collections/collections-search-container";
import { UrlSearchSync } from "./url-search-sync";
import { SearchTabs, type SearchTab } from "./search-tabs";

interface StudySearchPageProps {
  studyType: "task" | "run";
  title: string;
  description: string;
  basePath: string;
  icon: React.ElementType;
  entityColor: string;
  tabs: SearchTab[];
  createConfig: (studyType: "task" | "run") => {
    initialState?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

/**
 * Shared page shell for study-based search pages (collections & benchmarks).
 * Handles SearchProvider setup, URL ?q= sync, page header, and tab navigation.
 * Use the thin wrappers in collections/ and benchmarks/ to consume this.
 */
export function StudySearchPage({
  studyType,
  title,
  description,
  basePath,
  icon: Icon,
  entityColor,
  tabs,
  createConfig,
}: StudySearchPageProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // Initialised once — prevents SearchProvider re-mount (and focus loss) on URL changes.
  const [config] = useState<SearchDriverOptions>(() => {
    const cfg = createConfig(studyType);
    return {
      ...cfg,
      initialState: {
        ...cfg.initialState,
        searchTerm: urlQuery,
      },
    } as SearchDriverOptions;
  });

  return (
    <SearchProvider config={config}>
      <UrlSearchSync q={urlQuery} />
      <div className="flex min-h-screen flex-col">
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-8 sm:px-6">
            <div className="flex items-start gap-3">
              <Icon
                className="h-8 w-8"
                style={{ color: entityColor }}
                aria-hidden="true"
              />
              <div className="space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </div>

        <SearchTabs tabs={tabs} accentColor={entityColor} />

        <div className="mx-auto w-full flex-1 px-1.5 pb-6">
          <CollectionsSearchContainer
            basePath={basePath}
            entityColor={entityColor}
          />
        </div>
      </div>
    </SearchProvider>
  );
}

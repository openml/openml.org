"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Table2, Grid3x3, PanelLeftClose } from "lucide-react";
import {
  ResultsPerPage,
  PagingInfo,
  WithSearch,
} from "@elastic/react-search-ui";

/**
 * Controls Bar Component
 *
 * TERMINOLOGY:
 * - "Sort dropdown": Predefined sort options (Most Runs, Most Likes, etc.)
 * - "View toggle": Switch between List/Table/Grid display modes
 * - "Results per page": Number of items to show (20, 50, 100)
 * - "Pagination info": "Showing 1-20 out of 24,502 results"
 *
 * Features:
 * - Sort selection with URL synchronization
 * - View mode toggle
 * - Results per page selector
 * - Pagination information display
 */

export interface SortOption {
  name: string;
  value: Array<{ field: string; direction: string }>;
  id: string;
}

// Default sort options for datasets
export const datasetSortOptions: SortOption[] = [
  { name: "Relevance", value: [], id: "relevance" },
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
  {
    name: "Most Runs",
    value: [{ field: "runs", direction: "desc" }],
    id: "runs",
  },
  {
    name: "Most Likes",
    value: [{ field: "nr_of_likes", direction: "desc" }],
    id: "likes",
  },
  {
    name: "Most Downloads",
    value: [{ field: "nr_of_downloads", direction: "desc" }],
    id: "downloads",
  },
  {
    name: "Most Instances",
    value: [{ field: "qualities.NumberOfInstances", direction: "desc" }],
    id: "instances",
  },
  {
    name: "Most Features",
    value: [{ field: "qualities.NumberOfFeatures", direction: "desc" }],
    id: "features",
  },
  {
    name: "Most Numeric Features",
    value: [{ field: "qualities.NumberOfNumericFeatures", direction: "desc" }],
    id: "numeric",
  },
  {
    name: "Most Missing Values",
    value: [{ field: "qualities.NumberOfMissingValues", direction: "desc" }],
    id: "missing",
  },
  {
    name: "Most Classes",
    value: [{ field: "qualities.NumberOfClasses", direction: "desc" }],
    id: "classes",
  },
];

// Sort options for tasks
export const taskSortOptions: SortOption[] = [
  { name: "Relevance", value: [], id: "relevance" },
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
  {
    name: "Most Runs",
    value: [{ field: "runs", direction: "desc" }],
    id: "runs",
  },
  {
    name: "Most Likes",
    value: [{ field: "nr_of_likes", direction: "desc" }],
    id: "likes",
  },
  {
    name: "Most Downloads",
    value: [{ field: "nr_of_downloads", direction: "desc" }],
    id: "downloads",
  },
];

interface ControlsBarProps {
  view?: string;
  onViewChange?: (view: string) => void;
  /** Custom sort options for the entity type. Defaults to dataset sort options. */
  sortOptions?: SortOption[];
}

export function ControlsBar({
  view = "table",
  onViewChange,
  sortOptions = datasetSortOptions,
}: ControlsBarProps) {
  return (
    <div className="bg-background flex items-center justify-between gap-6 border-b px-4">
      {/* Left side: Sort and View Toggle */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <WithSearch
          mapContextToProps={({ sortList, setSort }) => ({
            sortList,
            setSort,
          })}
        >
          {({ sortList, setSort }) => {
            const currentSortId = (() => {
              if (!sortList || sortList.length === 0) {
                return "relevance";
              }
              const currentField = sortList[0]?.field;
              const matchedOption = sortOptions.find(
                (opt) => opt.value?.[0]?.field === currentField,
              );
              return matchedOption?.id || "relevance";
            })();

            return (
              <div className="flex items-center gap-2 p-4">
                <span className="text-muted-foreground text-sm">Sort by:</span>
                <Select
                  value={currentSortId}
                  onValueChange={(id) => {
                    const option = sortOptions.find((opt) => opt.id === id);
                    if (!option) {
                      console.error(`Sort option not found for id: ${id}`);
                      return;
                    }
                    if (setSort) {
                      // Cast to any to avoid type issues with elastic search-ui
                      (setSort as (value: unknown) => void)(option.value);
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }}
        </WithSearch>

        {/* View Toggle */}
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && onViewChange?.(value)}
          className="border"
        >
          <ToggleGroupItem
            value="list"
            aria-label="List view"
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="table"
            aria-label="Table view"
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
          >
            <Table2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="grid"
            aria-label="Grid view"
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
          >
            <Grid3x3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="split"
            aria-label="Split pane view"
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Right side: Results per page and Pagination info */}
      <div className="flex items-center gap-4">
        {/* Results Per Page */}
        <ResultsPerPage
          options={[20, 50, 100]}
          view={({ options, value, onChange }) => (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Show:</span>
              <Select
                value={value?.toString()}
                onValueChange={(val) => onChange(parseInt(val))}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Pagination Info */}
        <PagingInfo
          view={({ start, end, totalResults }) => (
            <div className="text-muted-foreground pr-4 text-sm dark:border-slate-400">
              Showing{" "}
              <span className="text-foreground font-medium">{start}</span> -{" "}
              <span className="text-foreground font-medium">{end}</span> of{" "}
              <span className="text-foreground font-medium">
                {totalResults?.toLocaleString()}
              </span>{" "}
              results
            </div>
          )}
        />
      </div>
    </div>
  );
}

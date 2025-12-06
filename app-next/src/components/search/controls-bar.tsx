"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Table2, Grid3x3 } from "lucide-react";
import { ResultsPerPage, PagingInfo, Sorting } from "@elastic/react-search-ui";

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

const sortOptions = [
  { name: "Relevance", value: [] },
  { name: "Most Runs", value: [{ field: "runs", direction: "desc" }] },
  { name: "Most Likes", value: [{ field: "nr_of_likes", direction: "desc" }] },
  {
    name: "Most Downloads",
    value: [{ field: "nr_of_downloads", direction: "desc" }],
  },
  { name: "Most Recent", value: [{ field: "date", direction: "desc" }] },
  {
    name: "Most Instances",
    value: [{ field: "qualities.NumberOfInstances", direction: "desc" }],
  },
  {
    name: "Most Features",
    value: [{ field: "qualities.NumberOfFeatures", direction: "desc" }],
  },
  {
    name: "Most Numeric Features",
    value: [{ field: "qualities.NumberOfNumericFeatures", direction: "desc" }],
  },
  {
    name: "Most Missing Values",
    value: [{ field: "qualities.NumberOfMissingValues", direction: "desc" }],
  },
  {
    name: "Most classNamees",
    value: [{ field: "qualities.NumberOfclassNamees", direction: "desc" }],
  },
];

interface ControlsBarProps {
  view?: string;
  onViewChange?: (view: string) => void;
}

export function ControlsBar({
  view = "table",
  onViewChange,
}: ControlsBarProps) {
  return (
    <div className="bg-background flex items-center justify-between gap-4 border-b p-4">
      {/* Left side: Sort and View Toggle */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <Sorting
          sortOptions={sortOptions}
          view={({ value, onChange }) => {
            // value can be a string or an array of sort objects
            const currentField =
              Array.isArray(value) && value.length > 0
                ? value[0]?.field
                : "relevance";

            return (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Sort by:</span>
                <Select
                  value={currentField || "relevance"}
                  onValueChange={(field) => {
                    const option = sortOptions.find(
                      (opt) =>
                        (opt.value.length > 0 &&
                          opt.value[0]?.field === field) ||
                        (field === "relevance" && opt.value.length === 0),
                    );
                    if (option && option.value) {
                      onChange(option.value);
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option, index) => (
                      <SelectItem
                        key={index}
                        value={option.value[0]?.field || "relevance"}
                      >
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }}
        />

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
            // className="data-[state=on]:bg-primary hover:bg-slate-600 hover:text-white data-[state=on]:text-slate-100"
          >
            <Grid3x3 className="h-4 w-4" />
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
            <div className="text-muted-foreground text-sm">
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

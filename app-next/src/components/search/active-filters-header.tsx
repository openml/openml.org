"use client";
import { WithSearch } from "@elastic/react-search-ui";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Active Filters Display Component for Header
 * Shows selected filters in horizontal layout on right side of page header
 */

// Elastic Search UI types
type FieldValue = string | number | boolean | Array<string | number | boolean>;
type FilterValueRange = {
  from?: FieldValue;
  name: string;
  to?: FieldValue;
};
type FilterValue = FieldValue | FilterValueRange;
type FilterType = "any" | "all" | "none";

interface Filter {
  field: string;
  type: FilterType;
  values: FilterValue[];
  persistent?: boolean;
}

interface ActiveFiltersHeaderProps {
  facetLabels: Record<string, string>;
}

function formatFacetValue(value: string, field: string): string {
  if (field === "status.keyword") {
    switch (value) {
      case "active":
        return "Verified";
      case "deactivated":
        return "Deactivated";
      case "in_preparation":
        return "In Preparation";
      default:
        return value;
    }
  }
  return value;
}

function truncateText(text: string, maxLength: number = 25): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function ActiveFiltersHeader({ facetLabels }: ActiveFiltersHeaderProps) {
  return (
    <WithSearch
      mapContextToProps={({ filters, removeFilter, clearFilters }) => ({
        filters,
        removeFilter,
        clearFilters,
      })}
    >
      {({ filters, removeFilter, clearFilters }) => {
        if (!filters || filters.length === 0) return null;

        // Group filters by field
        const filtersByField = new Map<
          string,
          { label: string; values: string[] }
        >();

        filters.forEach((filter: Filter) => {
          const label = facetLabels[filter.field] || filter.field;
          if (!filtersByField.has(filter.field)) {
            filtersByField.set(filter.field, { label, values: [] });
          }
          filter.values.forEach((value: FilterValue) => {
            let displayValue: string;
            if (typeof value === "string") {
              displayValue = formatFacetValue(value, filter.field);
            } else if (
              typeof value === "object" &&
              value !== null &&
              "name" in value
            ) {
              displayValue = value.name;
            } else {
              displayValue = String(value);
            }
            filtersByField.get(filter.field)!.values.push(displayValue);
          });
        });

        return (
          <div className="flex flex-wrap items-start gap-4">
            {/* Filter keys displayed horizontally */}
            <div className="flex flex-wrap items-start gap-6">
              {Array.from(filtersByField.entries()).map(
                ([field, { label, values }]) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <span className="border-b-2 border-slate-400 pb-0.5 text-sm font-semibold text-slate-700 dark:border-slate-500 dark:text-slate-300">
                      {label} ({values.length}x)
                    </span>
                    {/* Values stacked under each key */}
                    <div className="flex flex-col gap-1">
                      {values.map((value, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                          title={value} // Show full text on hover
                        >
                          <span>{truncateText(value, 25)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 rounded-full p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                            onClick={() => {
                              // Find the original value to remove
                              const filterToRemove = filters.find(
                                (f: Filter) => f.field === field,
                              );
                              if (filterToRemove && removeFilter) {
                                const originalValue =
                                  filterToRemove.values[index];
                                removeFilter(field, originalValue);
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
            {/* Clear All button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearFilters?.()}
              className="shrink-0 text-xs"
            >
              Clear All
            </Button>
          </div>
        );
      }}
    </WithSearch>
  );
}

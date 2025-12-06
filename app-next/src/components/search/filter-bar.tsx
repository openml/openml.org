"use client";

import * as React from "react";
import { Facet } from "@elastic/react-search-ui";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * Filter Bar Component - Dropdown Style
 *
 * Features:
 * - Dropdown menus for each facet (Status, License, etc.)
 * - Multi-select support with checkboxes
 * - Searchable options within dropdowns
 * - Active filter indicators
 * - Smart label formatting
 */

interface FilterBarProps {
  facets: Array<{
    label: string;
    field: string;
  }>;
}

/**
 * Format facet value for display
 */
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

export function FilterBar({ facets }: FilterBarProps) {
  const [openPopover, setOpenPopover] = React.useState<string | null>(null);

  return (
    <div className="bg-background flex flex-wrap items-center gap-2 border-b p-4">
      <span className="text-muted-foreground mr-2 text-sm font-medium">
        Filters:
      </span>
      {facets.map((facet) => (
        <Facet
          key={facet.field}
          field={facet.field}
          label={facet.label}
          filterType="any"
          show={100} // Show more options in dropdown
          view={({ options, onSelect, onRemove, values }) => {
            const selectedValues = new Set(values);
            const hasActiveFilters = selectedValues.size > 0;
            const isOpen = openPopover === facet.field;

            return (
              <Popover
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenPopover(open ? facet.field : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 border-dashed",
                      hasActiveFilters &&
                        "bg-accent text-accent-foreground border-solid",
                    )}
                  >
                    {facet.label}
                    {hasActiveFilters && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal lg:hidden"
                        >
                          {selectedValues.size}
                        </Badge>
                        <div className="hidden space-x-1 lg:flex">
                          {selectedValues.size > 2 ? (
                            <Badge
                              variant="secondary"
                              className="rounded-sm px-1 font-normal"
                            >
                              {selectedValues.size} selected
                            </Badge>
                          ) : (
                            options
                              .filter((option) =>
                                selectedValues.has(option.value),
                              )
                              .map((option) => (
                                <Badge
                                  variant="secondary"
                                  key={String(option.value)}
                                  className="rounded-sm px-1 font-normal"
                                >
                                  {formatFacetValue(
                                    String(option.value),
                                    facet.field,
                                  )}
                                </Badge>
                              ))
                          )}
                        </div>
                      </>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={`Filter ${facet.label}...`} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => {
                          const isSelected = selectedValues.has(option.value);
                          const valueStr = String(option.value);
                          return (
                            <CommandItem
                              key={valueStr}
                              onSelect={(e) => {
                                if (isSelected) {
                                  onRemove(option.value as any);
                                } else {
                                  onSelect(option.value as any);
                                }
                                // Prevent popover from closing
                                e.preventDefault?.();
                              }}
                            >
                              <div
                                className={cn(
                                  "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible",
                                )}
                              >
                                <Check className={cn("h-4 w-4")} />
                              </div>
                              <span>
                                {formatFacetValue(valueStr, facet.field)}
                              </span>
                              <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                {option.count.toLocaleString()}
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                      {hasActiveFilters && (
                        <>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                values.forEach((v: any) => onRemove(v));
                              }}
                              className="justify-center text-center"
                            >
                              Clear filters
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          }}
        />
      ))}
    </div>
  );
}

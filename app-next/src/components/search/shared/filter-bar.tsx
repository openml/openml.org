"use client";

import * as React from "react";
import { Facet, WithSearch } from "@elastic/react-search-ui";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounce";
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
  showSearch?: boolean;
  searchScopeOptions?: Array<{
    value: string;
    label: string;
  }>;
  onSearchScopeChange?: (scope: string) => void;
  defaultSearchScope?: string;
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

export function FilterBar({
  facets,
  showSearch = false,
  searchScopeOptions,
  onSearchScopeChange,
  defaultSearchScope = "all",
}: FilterBarProps) {
  const [openPopover, setOpenPopover] = React.useState<string | null>(null);
  const [pendingSelections, setPendingSelections] = React.useState<
    Map<string, Set<string>>
  >(new Map());
  const [searchScope, setSearchScope] =
    React.useState<string>(defaultSearchScope);

  return (
    <div className="bg-background flex flex-wrap items-center gap-2 border-b p-4">
      <span className="text-muted-foreground mr-2 text-sm font-medium">
        Filters:
      </span>

      {/* Search Input (if enabled) */}
      {showSearch && (
        <WithSearch
          mapContextToProps={({ searchTerm, setSearchTerm, isLoading }) => ({
            searchTerm,
            setSearchTerm,
            isLoading,
          })}
        >
          {({ searchTerm, setSearchTerm, isLoading }) => {
            const [localSearchTerm, setLocalSearchTerm] = React.useState(
              searchTerm || "",
            );
            const [isSearching, setIsSearching] = React.useState(false);

            // Sync local state with external searchTerm when it changes externally
            React.useEffect(() => {
              setLocalSearchTerm(searchTerm || "");
            }, [searchTerm]);

            // Track when we're waiting for debounce
            React.useEffect(() => {
              if (localSearchTerm !== searchTerm) {
                setIsSearching(true);
              } else {
                setIsSearching(false);
              }
            }, [localSearchTerm, searchTerm]);

            // Create debounced search handler
            const debouncedSetSearch = useDebouncedCallback((value: string) => {
              if (setSearchTerm) {
                setSearchTerm(value);
              }
            }, 500);

            const handleSearchChange = (
              e: React.ChangeEvent<HTMLInputElement>,
            ) => {
              const value = e.target.value;
              setLocalSearchTerm(value);
              debouncedSetSearch(value);
            };

            const handleClear = () => {
              setLocalSearchTerm("");
              if (setSearchTerm) {
                setSearchTerm("");
              }
            };

            const showLoading = isSearching || (isLoading && localSearchTerm);

            return (
              <div className="flex items-center gap-2">
                {/* Search Scope Dropdown */}
                {searchScopeOptions && searchScopeOptions.length > 0 && (
                  <Popover
                    open={openPopover === "search-scope"}
                    onOpenChange={(open) =>
                      setOpenPopover(open ? "search-scope" : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-dashed"
                      >
                        {searchScopeOptions.find((o) => o.value === searchScope)
                          ?.label || "Search in"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="start">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {searchScopeOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                onSelect={() => {
                                  setSearchScope(option.value);
                                  onSearchScopeChange?.(option.value);
                                  setOpenPopover(null);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    searchScope === option.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Search Input */}
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    className="h-9 w-64 pr-9 pl-9"
                  />
                  {localSearchTerm && (
                    <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                      {showLoading && (
                        <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 hover:bg-transparent"
                        onClick={handleClear}
                        aria-label="Clear search"
                      >
                        <span className="text-muted-foreground hover:text-foreground text-lg leading-none">
                          ×
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        </WithSearch>
      )}

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

            // Get pending selections for this facet
            const pending = pendingSelections.get(facet.field) || new Set();

            return (
              <Popover
                open={isOpen}
                onOpenChange={(open) => {
                  if (open) {
                    // Initialize pending with current selections
                    const newPending = new Map(pendingSelections);
                    newPending.set(facet.field, new Set(selectedValues));
                    setPendingSelections(newPending);
                    setOpenPopover(facet.field);
                  } else {
                    setOpenPopover(null);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 border-dashed dark:hover:text-slate-100",
                      hasActiveFilters &&
                        "bg-accent text-accent-foreground border-solid dark:text-slate-300",
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
                          className="rounded-sm px-1 font-normal"
                        >
                          {selectedValues.size} selected
                        </Badge>
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
                        <CommandItem
                          onSelect={() => {
                            // Apply pending selections
                            const facetPending = pending;
                            const currentValues = Array.from(selectedValues);

                            // Remove deselected items
                            currentValues.forEach((v) => {
                              if (!facetPending.has(v)) {
                                onRemove(v);
                              }
                            });

                            // Add newly selected items
                            facetPending.forEach((v) => {
                              if (!selectedValues.has(v)) {
                                onSelect(v);
                              }
                            });

                            // Close popover
                            setOpenPopover(null);
                          }}
                          disabled={
                            pending.size === selectedValues.size &&
                            Array.from(pending).every((v) =>
                              selectedValues.has(v),
                            )
                          }
                          className="bg-primary text-primary-foreground hover:bg-primary/90 justify-center disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Apply Filters
                        </CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup>
                        {options.map((option) => {
                          const isSelected = pending.has(option.value);
                          const valueStr = String(option.value);
                          return (
                            <CommandItem
                              key={valueStr}
                              value={valueStr}
                              onSelect={() => {
                                // Toggle in pending selections
                                const newPending = new Map(pendingSelections);
                                const facetPending =
                                  newPending.get(facet.field) || new Set();
                                if (facetPending.has(option.value)) {
                                  facetPending.delete(option.value);
                                } else {
                                  facetPending.add(option.value);
                                }
                                newPending.set(facet.field, facetPending);
                                setPendingSelections(newPending);
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
                              <span className="flex-1">
                                {formatFacetValue(valueStr, facet.field)}
                              </span>
                              <span className="text-muted-foreground ml-2 shrink-0 text-xs tabular-nums">
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
                                values.forEach(
                                  (v: string | number | { name: string }) =>
                                    onRemove(v),
                                );
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

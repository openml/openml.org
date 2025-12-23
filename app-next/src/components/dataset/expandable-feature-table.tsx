"use client";

import { useState, useMemo, Fragment } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Target,
  Hash,
  Type,
  Calendar,
  BarChart3,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DatasetFeature } from "@/types/dataset";
import { cn } from "@/lib/utils";

interface ExpandableFeatureTableProps {
  features: DatasetFeature[];
  defaultExpanded?: boolean;
  initialDisplayCount?: number;
}

type FeatureType = "numeric" | "nominal" | "string" | "date";

/**
 * ExpandableFeatureTable - Enhanced feature table with expand/collapse and filtering
 *
 * Features:
 * - Collapsible section (expand/collapse entire table)
 * - Show more/less for large feature sets
 * - Search/filter functionality
 * - Type filter badges
 * - Sortable columns
 * - Expandable feature rows with detailed stats
 * - Target feature highlighting
 */
export function ExpandableFeatureTable({
  features,
  defaultExpanded = true,
  initialDisplayCount = 10,
}: ExpandableFeatureTableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof DatasetFeature | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [typeFilters, setTypeFilters] = useState<Set<FeatureType>>(
    new Set(["numeric", "nominal", "string", "date"]),
  );

  // Count features by type
  const featureCounts = useMemo(() => {
    return features.reduce(
      (acc, f) => {
        acc[f.type] = (acc[f.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [features]);

  // Filter and sort features
  const filteredFeatures = useMemo(() => {
    let result = features.filter(
      (f) =>
        typeFilters.has(f.type as FeatureType) &&
        f.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal === undefined || bVal === undefined) return 0;
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [features, searchTerm, sortField, sortDirection, typeFilters]);

  // Display features (with show more/less)
  const displayFeatures = showAll
    ? filteredFeatures
    : filteredFeatures.slice(0, initialDisplayCount);

  const handleSort = (field: keyof DatasetFeature) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleRowExpanded = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const toggleTypeFilter = (type: FeatureType) => {
    const newFilters = new Set(typeFilters);
    if (newFilters.has(type)) {
      // Don't allow removing all filters
      if (newFilters.size > 1) {
        newFilters.delete(type);
      }
    } else {
      newFilters.add(type);
    }
    setTypeFilters(newFilters);
  };

  // Get type badge config
  const getTypeBadge = (type: string) => {
    const configs: Record<
      string,
      { icon: React.ReactNode; className: string }
    > = {
      numeric: {
        icon: <Hash className="mr-1 h-3 w-3" />,
        className:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      },
      nominal: {
        icon: <Type className="mr-1 h-3 w-3" />,
        className:
          "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      },
      string: {
        icon: <Type className="mr-1 h-3 w-3" />,
        className:
          "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      },
      date: {
        icon: <Calendar className="mr-1 h-3 w-3" />,
        className:
          "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
      },
    };
    const config = configs[type] || configs.string;
    return (
      <Badge variant="outline" className={cn("capitalize", config.className)}>
        {config.icon}
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-left hover:opacity-80">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                  <BarChart3 className="h-4 w-4 rotate-90 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Features
                    <Badge variant="secondary" className="ml-1">
                      {features.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Detailed information about each attribute in the dataset
                  </CardDescription>
                </div>
              </button>
            </CollapsibleTrigger>

            {/* Type Count Badges (always visible) */}
            <div className="hidden flex-wrap gap-2 md:flex">
              {Object.entries(featureCounts).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Type Filters */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter Types
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Feature Types</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(
                      ["numeric", "nominal", "string", "date"] as FeatureType[]
                    ).map((type) => (
                      <DropdownMenuCheckboxItem
                        key={type}
                        checked={typeFilters.has(type)}
                        onCheckedChange={() => toggleTypeFilter(type)}
                        disabled={
                          typeFilters.size === 1 && typeFilters.has(type)
                        }
                      >
                        <span className="capitalize">{type}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          ({featureCounts[type] || 0})
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Results count */}
            {searchTerm && (
              <p className="text-muted-foreground text-sm">
                Showing {filteredFeatures.length} of {features.length} features
              </p>
            )}

            {/* Feature Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead
                      className="hover:bg-muted/50 w-12 cursor-pointer"
                      onClick={() => handleSort("index")}
                    >
                      #
                      {sortField === "index" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Feature Name
                      {sortField === "name" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      Type
                    </TableHead>
                    <TableHead
                      className="hover:bg-muted/50 cursor-pointer text-right"
                      onClick={() => handleSort("distinct")}
                    >
                      Distinct
                    </TableHead>
                    <TableHead
                      className="hover:bg-muted/50 cursor-pointer text-right"
                      onClick={() => handleSort("missing")}
                    >
                      Missing
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayFeatures.map((feature) => (
                    <Fragment key={feature.index}>
                      <TableRow
                        className={cn(
                          "cursor-pointer transition-colors",
                          feature.target === "1" &&
                            "bg-amber-50 dark:bg-amber-950/20",
                          expandedRows.has(feature.index) && "bg-muted/50",
                        )}
                        onClick={() => toggleRowExpanded(feature.index)}
                      >
                        <TableCell className="w-8 p-2">
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedRows.has(feature.index) && "rotate-90",
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {feature.index}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {feature.name}
                            {feature.target === "1" && (
                              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                <Target className="mr-1 h-3 w-3" />
                                Target
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(feature.type)}</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {feature.distinct?.toLocaleString() ?? "—"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {feature.missing?.toLocaleString() ?? "—"}
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row Details */}
                      {expandedRows.has(feature.index) && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={6} className="p-4">
                            <FeatureDetails feature={feature} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}

                  {displayFeatures.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground py-8 text-center"
                      >
                        No features match your search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Show More/Less Button */}
            {filteredFeatures.length > initialDisplayCount && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="gap-2"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show All {filteredFeatures.length} Features
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

/**
 * FeatureDetails - Expanded view for a single feature
 */
function FeatureDetails({ feature }: { feature: DatasetFeature }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* Statistics for numeric features */}
      {feature.type === "numeric" && (
        <>
          {feature.min !== undefined && (
            <StatBox
              label="Minimum"
              value={parseFloat(feature.min).toFixed(4)}
            />
          )}
          {feature.max !== undefined && (
            <StatBox
              label="Maximum"
              value={parseFloat(feature.max).toFixed(4)}
            />
          )}
          {feature.mean !== undefined && (
            <StatBox label="Mean" value={parseFloat(feature.mean).toFixed(4)} />
          )}
          {feature.stdev !== undefined && (
            <StatBox
              label="Std Dev"
              value={parseFloat(feature.stdev).toFixed(4)}
            />
          )}
        </>
      )}

      {/* Distribution for nominal features */}
      {feature.type === "nominal" &&
        feature.distr &&
        feature.distr.length > 0 && (
          <div className="col-span-full">
            <p className="mb-2 text-sm font-medium">Value Distribution</p>
            <div className="flex flex-wrap gap-2">
              {feature.distr.slice(0, 10).map(([value, count]) => (
                <Badge key={value} variant="outline" className="text-xs">
                  {value}: {count}
                </Badge>
              ))}
              {feature.distr.length > 10 && (
                <Badge variant="secondary" className="text-xs">
                  +{feature.distr.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}

      {/* General stats */}
      <StatBox
        label="Distinct Values"
        value={feature.distinct?.toString() ?? "—"}
      />
      <StatBox
        label="Missing Values"
        value={feature.missing?.toString() ?? "0"}
      />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background rounded-lg border p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-mono text-sm font-medium">{value}</p>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Gauge,
  Search,
  Loader2,
  List,
  Table2,
  Grid3x3,
  ArrowUp,
  ArrowDown,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entityColors } from "@/constants/entityColors";
import { Card, CardContent } from "@/components/ui/card";

interface Measure {
  quality_id?: number;
  proc_id?: number;
  eval_id?: number;
  name: string;
  description?: string;
  date?: string;
  min?: number;
  max?: number;
  unit?: string;
  higherIsBetter?: boolean;
  measure_type?: string;
}

interface MeasureSearchContainerProps {
  measureType: "evaluation_measure" | "estimation_procedure" | "data_quality";
}

const SORT_OPTIONS = [
  { id: "date_desc", label: "Most Recent", field: "date", dir: "desc" },
  { id: "date_asc", label: "Oldest First", field: "date", dir: "asc" },
];

export function MeasureSearchContainer({
  measureType,
}: MeasureSearchContainerProps) {
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list");
  const [sortId, setSortId] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(20);

  const fetchMeasures = useCallback(async () => {
    setLoading(true);
    try {
      const sortOpt = SORT_OPTIONS.find((s) => s.id === sortId) || SORT_OPTIONS[0];

      // Build ES query matching the original MeasureList pattern
      const esQuery: {
        query: {
          bool: {
            filter: Array<{ term: { [key: string]: string } }>;
            must?: {
              multi_match: {
                query: string;
                fields: string[];
                type: string;
              };
            };
          };
        };
        size: number;
        from: number;
        sort?: Array<{ [key: string]: { order: string} }>;
      } = {
        query: {
          bool: {
            // Use exact same format as original MeasureList (without .keyword)
            filter: [{ term: { measure_type: measureType } }],
          },
        },
        size: resultsPerPage,
        from: (currentPage - 1) * resultsPerPage,
      };

      // Add search if provided
      if (searchQuery) {
        esQuery.query.bool.must = {
          multi_match: {
            query: searchQuery,
            fields: ["name^2", "description"],
            type: "best_fields",
          },
        };
      }

      // Add sort (measure index only supports date sorting)
      if (sortOpt.field && sortOpt.dir) {
        esQuery.sort = [{ [sortOpt.field]: { order: sortOpt.dir } }];
      }

      console.log("[MeasureSearchContainer] ES Query:", JSON.stringify(esQuery, null, 2));

      // Use the /api/search proxy (now uses fetch instead of axios)
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indexName: "measure",
          esQuery,
        }),
      });

      console.log("[MeasureSearchContainer] Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("[MeasureSearchContainer] ES response:", {
          total: data.hits?.total,
          hitCount: data.hits?.hits?.length,
        });

        const measures = (data.hits?.hits || []).map(
          (hit: { _source: Record<string, unknown>; _id: string }) => ({
            ...hit._source,
            _id: hit._id,
          }),
        );

        console.log("[MeasureSearchContainer] Received measures:", measures.length);
        setMeasures(measures);

        // Set total count for pagination
        const totalValue = typeof data.hits?.total === 'object'
          ? data.hits.total.value
          : data.hits?.total || 0;
        setTotal(totalValue);
      } else {
        const responseText = await res.text();
        console.error("[MeasureSearchContainer] Error response status:", res.status);
        console.error("[MeasureSearchContainer] Error response text:", responseText);

        try {
          const errorData = JSON.parse(responseText);
          console.error("[MeasureSearchContainer] Error data parsed:", errorData);
        } catch (parseErr) {
          console.error("[MeasureSearchContainer] Could not parse error as JSON");
        }
      }
    } catch (err) {
      console.error("[MeasureSearchContainer] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [measureType, searchQuery, sortId, currentPage, resultsPerPage]);

  useEffect(() => {
    fetchMeasures();
  }, [fetchMeasures]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 on new search
    setSearchQuery(searchInput);
  };

  const handleSortChange = (newSortId: string) => {
    setCurrentPage(1); // Reset to page 1 on sort change
    setSortId(newSortId);
  };

  const getMeasureId = (measure: Measure) => {
    return measure.eval_id || measure.proc_id || measure.quality_id;
  };

  const renderListView = () => (
    <div className="space-y-3">
      {measures.map((measure, index) => {
        const id = getMeasureId(measure);
        return (
          <Link
            key={id || index}
            href={`/measures/${id}`}
            className="block transition-transform hover:scale-[1.01]"
          >
            <Card className="hover:border-primary/30 transition-colors">
              <CardContent className="pb-4 pt-5">
                <div className="flex items-start gap-3">
                  <Gauge
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: entityColors.measures }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 font-semibold">{measure.name}</h3>
                    {measure.description && (
                      <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                        {measure.description}
                      </p>
                    )}
                    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      {measure.higherIsBetter !== undefined && (
                        <span className="flex items-center gap-1">
                          {measure.higherIsBetter ? (
                            <ArrowUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-red-500" />
                          )}
                          {measure.higherIsBetter
                            ? "Higher is better"
                            : "Lower is better"}
                        </span>
                      )}
                      {measure.min !== undefined && (
                        <span>Min: {measure.min}</span>
                      )}
                      {measure.max !== undefined && (
                        <span>Max: {measure.max}</span>
                      )}
                      {measure.unit && <span>Unit: {measure.unit}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-3 pl-0 text-left text-sm font-medium">Name</th>
            <th className="pb-3 text-left text-sm font-medium">Description</th>
            <th className="pb-3 text-left text-sm font-medium">Direction</th>
            <th className="pb-3 text-left text-sm font-medium">Range</th>
            <th className="pb-3 text-right text-sm font-medium">ID</th>
          </tr>
        </thead>
        <tbody>
          {measures.map((measure, index) => {
            const id = getMeasureId(measure);
            return (
              <tr key={id || index} className="border-b">
                <td className="py-3 pl-0">
                  <Link
                    href={`/measures/${id}`}
                    className="font-medium hover:underline"
                    style={{ color: entityColors.measures }}
                  >
                    {measure.name}
                  </Link>
                </td>
                <td className="text-muted-foreground py-3 text-sm">
                  {measure.description
                    ? measure.description.slice(0, 80) +
                      (measure.description.length > 80 ? "..." : "")
                    : "—"}
                </td>
                <td className="py-3">
                  {measure.higherIsBetter !== undefined ? (
                    <span className="flex items-center gap-1 text-sm">
                      {measure.higherIsBetter ? (
                        <ArrowUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      {measure.higherIsBetter ? "Higher" : "Lower"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="text-muted-foreground py-3 text-sm">
                  {measure.min !== undefined || measure.max !== undefined ? (
                    <>
                      {measure.min ?? "−∞"} – {measure.max ?? "+∞"}
                      {measure.unit && ` ${measure.unit}`}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 pr-0 text-right">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-0.5 text-xs"
                    style={{
                      backgroundColor: `${entityColors.measures}20`,
                      color: entityColors.measures,
                    }}
                  >
                    <Hash className="h-3 w-3" />
                    {id}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {measures.map((measure, index) => {
        const id = getMeasureId(measure);
        return (
          <Link
            key={id || index}
            href={`/measures/${id}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="hover:border-primary/30 h-full transition-colors">
              <CardContent className="pb-4 pt-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <Gauge
                    className="h-5 w-5 shrink-0"
                    style={{ color: entityColors.measures }}
                  />
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-0.5 text-xs"
                    style={{
                      backgroundColor: `${entityColors.measures}20`,
                      color: entityColors.measures,
                    }}
                  >
                    <Hash className="h-3 w-3" />
                    {id}
                  </Badge>
                </div>
                <h3 className="mb-2 line-clamp-2 font-semibold">
                  {measure.name}
                </h3>
                {measure.description && (
                  <p className="text-muted-foreground mb-3 line-clamp-3 text-sm">
                    {measure.description}
                  </p>
                )}
                <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                  {measure.higherIsBetter !== undefined && (
                    <span className="flex items-center gap-1">
                      {measure.higherIsBetter ? (
                        <ArrowUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      {measure.higherIsBetter ? "Higher" : "Lower"}
                    </span>
                  )}
                  {(measure.min !== undefined || measure.max !== undefined) && (
                    <span>
                      {measure.min ?? "−∞"} – {measure.max ?? "+∞"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: entityColors.measures }} />
      </div>
    );
  }

  if (measures.length === 0 && !searchQuery) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No measures found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-background mb-3 flex items-center justify-between gap-4 border-b px-3 py-2">
        {/* Left: Sort */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Sort:</span>
          <Select value={sortId} onValueChange={handleSortChange}>
            <SelectTrigger className="h-8 w-[180px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Center: View Toggle */}
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v)}
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
        </ToggleGroup>

        {/* Right: Search */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search measures..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-8 w-[200px] text-sm"
          />
          <Button
            onClick={handleSearch}
            size="sm"
            className="h-8"
            style={{ backgroundColor: entityColors.measures }}
          >
            <Search className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground text-sm">
            {total.toLocaleString()} {total === 1 ? "result" : "results"}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {measures.length === 0 && searchQuery && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-2">
            No measures match "{searchQuery}"
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchInput("");
              setSearchQuery("");
            }}
          >
            Clear search
          </Button>
        </div>
      )}

      {/* Results */}
      {measures.length > 0 && (
        <>
          {view === "list" && renderListView()}
          {view === "table" && renderTableView()}
          {view === "grid" && renderGridView()}
        </>
      )}

      {/* Pagination */}
      {total > resultsPerPage && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {(() => {
              const totalPages = Math.ceil(total / resultsPerPage);
              const pages = [];
              const maxVisible = 5;

              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              const endPage = Math.min(totalPages, startPage + maxVisible - 1);

              if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }

              if (startPage > 1) {
                pages.push(
                  <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    style={currentPage === 1 ? { backgroundColor: entityColors.measures } : undefined}
                  >
                    1
                  </Button>
                );
                if (startPage > 2) {
                  pages.push(<span key="start-ellipsis" className="px-2">...</span>);
                }
              }

              for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== totalPages) {
                  pages.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      style={currentPage === i ? { backgroundColor: entityColors.measures } : undefined}
                    >
                      {i}
                    </Button>
                  );
                }
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(<span key="end-ellipsis" className="px-2">...</span>);
                }
                pages.push(
                  <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    style={currentPage === totalPages ? { backgroundColor: entityColors.measures } : undefined}
                  >
                    {totalPages}
                  </Button>
                );
              }

              return pages;
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(total / resultsPerPage), p + 1))}
            disabled={currentPage >= Math.ceil(total / resultsPerPage)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

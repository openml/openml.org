"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Database,
  ChevronRight,
  ChevronLeft,
  Search,
  FlaskConical,
  Heart,
  CloudDownload,
  BarChart3,
  Clock,
  Hash,
  Loader2,
  List,
  Table2,
  Grid3x3,
  PanelLeftClose,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { entityColors } from "@/constants/entityColors";
import { truncateName } from "@/lib/utils";

interface DatasetResult {
  data_id: number;
  name: string;
  version?: number;
  description?: string;
  format?: string;
  date?: string;
  uploader?: string;
  qualities?: {
    NumberOfInstances?: number;
    NumberOfFeatures?: number;
    NumberOfClasses?: number;
  };
  runs?: number;
  nr_of_likes?: number;
  nr_of_downloads?: number;
}

interface CollectionDatasetsSectionProps {
  studyId: string;
  totalCount: number;
}

const SORT_OPTIONS = [
  { id: "runs", label: "Most Runs", field: "runs", dir: "desc" },
  { id: "recent", label: "Most Recent", field: "date", dir: "desc" },
  { id: "likes", label: "Most Likes", field: "nr_of_likes", dir: "desc" },
  {
    id: "downloads",
    label: "Most Downloads",
    field: "nr_of_downloads",
    dir: "desc",
  },
  {
    id: "instances",
    label: "Most Instances",
    field: "qualities.NumberOfInstances",
    dir: "desc",
  },
  {
    id: "features",
    label: "Most Features",
    field: "qualities.NumberOfFeatures",
    dir: "desc",
  },
];

const PAGE_SIZE = 20;

export function CollectionDatasetsSection({
  studyId,
  totalCount,
}: CollectionDatasetsSectionProps) {
  const [datasets, setDatasets] = useState<DatasetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalCount);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [view, setView] = useState("list");
  const [sortId, setSortId] = useState("runs");
  const [selectedDataset, setSelectedDataset] = useState<DatasetResult | null>(
    null,
  );

  const fetchPage = useCallback(
    async (p: number, q: string, sort: string) => {
      setLoading(true);
      try {
        const sortOpt =
          SORT_OPTIONS.find((s) => s.id === sort) || SORT_OPTIONS[0];
        const params = new URLSearchParams({
          page: p.toString(),
          limit: PAGE_SIZE.toString(),
          sort: sortOpt.field,
          dir: sortOpt.dir,
        });
        if (q) params.set("q", q);

        const res = await fetch(`/api/study/${studyId}/datasets?${params}`);
        if (res.ok) {
          const data = await res.json();
          setDatasets(data.results);
          setTotal(data.total);
        }
      } catch (err) {
        console.error("Failed to fetch datasets:", err);
      } finally {
        setLoading(false);
      }
    },
    [studyId],
  );

  useEffect(() => {
    fetchPage(page, searchQuery, sortId);
  }, [page, searchQuery, sortId, fetchPage]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput);
  };

  if (totalCount === 0) return null;

  const renderStats = (d: DatasetResult, size: "sm" | "xs" = "sm") => {
    const iconSize = size === "sm" ? "h-4 w-4" : "h-3 w-3";
    return (
      <div className={`flex flex-wrap gap-x-4 gap-y-1 text-${size}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1.5">
              <FlaskConical
                className={`${iconSize} fill-red-500 text-red-500`}
              />
              {Number(d.runs || 0).toLocaleString()}
            </span>
          </TooltipTrigger>
          <TooltipContent>Runs</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1.5">
              <Heart
                className={`${iconSize} fill-purple-500 text-purple-500`}
              />
              {Number(d.nr_of_likes || 0)}
            </span>
          </TooltipTrigger>
          <TooltipContent>Likes</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1.5">
              <CloudDownload className={`${iconSize} text-blue-500`} />
              {Number(d.nr_of_downloads || 0)}
            </span>
          </TooltipTrigger>
          <TooltipContent>Downloads</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1.5">
              <BarChart3 className={`${iconSize} text-gray-500`} />
              {d.qualities?.NumberOfInstances
                ? Number(d.qualities.NumberOfInstances).toLocaleString()
                : "N/A"}{" "}
              x{" "}
              {d.qualities?.NumberOfFeatures
                ? Number(d.qualities.NumberOfFeatures)
                : "N/A"}
            </span>
          </TooltipTrigger>
          <TooltipContent>Dimensions (rows x columns)</TooltipContent>
        </Tooltip>
        {d.date && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className={iconSize} />
                {new Date(d.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>Upload date</TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <CollapsibleSection
      id="datasets"
      title="Datasets"
      description="Datasets included in this collection"
      icon={
        <Database className="h-4 w-4" style={{ color: entityColors.data }} />
      }
      badge={totalCount}
      defaultOpen={true}
    >
      {/* Controls bar */}
      <div className="bg-background mb-3 flex items-center justify-between gap-4 border-b px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Sort:</span>
            <Select
              value={sortId}
              onValueChange={(v) => {
                setSortId(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[160px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v)}
            className="border"
          >
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="data-[state=on]:bg-accent"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="table"
              aria-label="Table view"
              className="data-[state=on]:bg-accent"
            >
              <Table2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="grid"
              aria-label="Grid view"
              className="data-[state=on]:bg-accent"
            >
              <Grid3x3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="split"
              aria-label="Split view"
              className="data-[state=on]:bg-accent"
            >
              <PanelLeftClose className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-48">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
            <Input
              placeholder="Search datasets..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-8 pl-8 text-sm"
            />
          </div>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {total.toLocaleString()} results
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          {/* LIST VIEW */}
          {view === "list" && (
            <div className="space-y-0">
              {datasets.length > 0 ? (
                datasets.map((d) => (
                  <div
                    key={d.data_id}
                    className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start gap-3">
                        <Database
                          className="mt-0.5 h-5 w-5 shrink-0"
                          style={{ color: entityColors.data }}
                        />
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-base font-semibold">
                            {truncateName(d.name)}
                          </h3>
                          <span className="text-primary text-xs">
                            v.{d.version || 1} ✓
                          </span>
                        </div>
                      </div>
                      {d.description && (
                        <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                          {d.description}
                        </p>
                      )}
                      {renderStats(d)}
                    </div>
                    <Badge
                      variant="openml"
                      className="relative z-10 flex items-center gap-0.75 px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: entityColors.data }}
                    >
                      <Hash className="h-3 w-3" />
                      {d.data_id}
                    </Badge>
                    <Link
                      href={`/datasets/${d.data_id}`}
                      className="absolute inset-0"
                      aria-label={`View ${d.name}`}
                    >
                      <span className="sr-only">View {d.name}</span>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground p-8 text-center">
                  {searchQuery
                    ? "No datasets match your search"
                    : "No datasets found"}
                </div>
              )}
            </div>
          )}

          {/* TABLE VIEW */}
          {view === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-3 py-2 text-left font-medium">ID</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Instances
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Features
                    </th>
                    <th className="px-3 py-2 text-right font-medium">Runs</th>
                    <th className="px-3 py-2 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.length > 0 ? (
                    datasets.map((d) => (
                      <tr
                        key={d.data_id}
                        className="hover:bg-accent border-b transition-colors"
                      >
                        <td className="px-3 py-2">
                          <Badge
                            variant="openml"
                            className="text-[10px] font-semibold text-white"
                            style={{ backgroundColor: entityColors.data }}
                          >
                            {d.data_id}
                          </Badge>
                        </td>
                        <td className="max-w-[300px] truncate px-3 py-2 font-medium">
                          <Link
                            href={`/datasets/${d.data_id}`}
                            className="hover:underline"
                          >
                            {truncateName(d.name)}
                          </Link>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {d.qualities?.NumberOfInstances
                            ? Number(
                                d.qualities.NumberOfInstances,
                              ).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {d.qualities?.NumberOfFeatures
                            ? Number(
                                d.qualities.NumberOfFeatures,
                              ).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {Number(d.runs || 0).toLocaleString()}
                        </td>
                        <td className="text-muted-foreground px-3 py-2">
                          {d.date
                            ? new Date(d.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-muted-foreground px-3 py-8 text-center"
                      >
                        No datasets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* GRID VIEW */}
          {view === "grid" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {datasets.length > 0 ? (
                datasets.map((d) => (
                  <Link
                    key={d.data_id}
                    href={`/datasets/${d.data_id}`}
                    className="hover:bg-accent group relative flex flex-col rounded-lg border p-4 transition-colors"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Database
                        className="h-5 w-5"
                        style={{ color: entityColors.data }}
                      />
                      <Badge
                        variant="openml"
                        className="text-[10px] font-semibold text-white"
                        style={{ backgroundColor: entityColors.data }}
                      >
                        <Hash className="h-2.5 w-2.5" />
                        {d.data_id}
                      </Badge>
                    </div>
                    <h4 className="mb-1 line-clamp-1 text-sm font-semibold">
                      {d.name}
                    </h4>
                    {d.description && (
                      <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">
                        {d.description}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      <span className="flex items-center gap-1">
                        <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                        {Number(d.runs || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3 text-gray-500" />
                        {d.qualities?.NumberOfInstances
                          ? Number(
                              d.qualities.NumberOfInstances,
                            ).toLocaleString()
                          : "?"}{" "}
                        x {d.qualities?.NumberOfFeatures || "?"}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-muted-foreground col-span-full p-8 text-center">
                  No datasets found
                </div>
              )}
            </div>
          )}

          {/* SPLIT VIEW */}
          {view === "split" && (
            <div className="flex gap-0">
              <div
                className="w-[380px] space-y-0 overflow-y-auto border-r"
                style={{ maxHeight: "600px" }}
              >
                {datasets.length > 0 ? (
                  (() => {
                    if (
                      !selectedDataset ||
                      !datasets.find(
                        (d) => d.data_id === selectedDataset.data_id,
                      )
                    ) {
                      setTimeout(() => setSelectedDataset(datasets[0]), 0);
                    }
                    return datasets.map((d) => (
                      <button
                        key={d.data_id}
                        onClick={() => setSelectedDataset(d)}
                        className={`hover:bg-accent block w-full cursor-pointer border-b p-3 text-left transition-colors ${selectedDataset?.data_id === d.data_id ? "bg-accent" : ""}`}
                      >
                        <div className="mb-1 flex items-start gap-2">
                          <Database
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: entityColors.data }}
                          />
                          <h4 className="line-clamp-1 text-sm font-semibold">
                            {truncateName(d.name)}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="flex items-center gap-1">
                            <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                            {Number(d.runs || 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3 text-gray-500" />
                            {d.qualities?.NumberOfInstances
                              ? Number(
                                  d.qualities.NumberOfInstances,
                                ).toLocaleString()
                              : "?"}{" "}
                            x {d.qualities?.NumberOfFeatures || "?"}
                          </span>
                        </div>
                      </button>
                    ));
                  })()
                ) : (
                  <div className="text-muted-foreground p-8 text-center">
                    No datasets found
                  </div>
                )}
              </div>
              <div
                className="flex-1 overflow-y-auto p-6"
                style={{ maxHeight: "600px" }}
              >
                {selectedDataset ? (
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Database
                          className="h-6 w-6"
                          style={{ color: entityColors.data }}
                        />
                        <h2 className="text-xl font-bold">
                          {selectedDataset.name}
                        </h2>
                        <span className="text-primary text-xs">
                          v.{selectedDataset.version || 1}
                        </span>
                      </div>
                      <Badge
                        variant="openml"
                        className="text-xs font-semibold text-white"
                        style={{ backgroundColor: entityColors.data }}
                      >
                        <Hash className="h-3 w-3" />
                        {selectedDataset.data_id}
                      </Badge>
                    </div>
                    {selectedDataset.description && (
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {selectedDataset.description}
                      </p>
                    )}
                    <div className="mb-4">{renderStats(selectedDataset)}</div>
                    <Link
                      href={`/datasets/${selectedDataset.data_id}`}
                      className="text-primary mt-2 inline-flex items-center gap-1 text-sm hover:underline"
                    >
                      View full details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center">
                    Select a dataset to view details
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-3">
              <p className="text-muted-foreground text-xs">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground px-2 text-xs">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-7 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </CollapsibleSection>
  );
}

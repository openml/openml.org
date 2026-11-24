"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Search,
  Flag,
  FlaskConical,
  Heart,
  Hash,
  Loader2,
  List,
  Table2,
  Grid3x3,
  PanelLeftClose,
  ArrowRight,
  Database,
  ChevronRight,
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

const TASK_TYPE_NAMES: Record<number, string> = {
  1: "Supervised Classification",
  2: "Supervised Regression",
  3: "Learning Curve",
  4: "Data Stream Classification",
  5: "Clustering",
  6: "ML Challenge",
  7: "Survival Analysis",
  8: "Subgroup Discovery",
};

interface TaskResult {
  task_id: number;
  task_type_id: number;
  task_type?: string;
  source_data?: {
    data_id?: number;
    name?: string;
  };
  estimation_procedure?: {
    type?: string;
    name?: string;
  };
  runs?: number;
  nr_of_likes?: number;
  nr_of_downloads?: number;
}

interface BenchmarkTasksSectionProps {
  studyId: string;
  totalCount: number;
}

const SORT_OPTIONS = [
  { id: "runs", label: "Most Runs", field: "runs", dir: "desc" },
  { id: "likes", label: "Most Likes", field: "nr_of_likes", dir: "desc" },
  {
    id: "task_id_asc",
    label: "Task ID (asc)",
    field: "task_id",
    dir: "asc",
  },
  {
    id: "task_id_desc",
    label: "Task ID (desc)",
    field: "task_id",
    dir: "desc",
  },
];

const PAGE_SIZE = 20;

export function BenchmarkTasksSection({
  studyId,
  totalCount,
}: BenchmarkTasksSectionProps) {
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalCount);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [view, setView] = useState("list");
  const [sortId, setSortId] = useState("runs");
  const [selectedTask, setSelectedTask] = useState<TaskResult | null>(null);

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

        const res = await fetch(`/api/study/${studyId}/tasks?${params}`);
        if (res.ok) {
          const data = await res.json();
          setTasks(data.results);
          setTotal(data.total);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
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

  const getTypeName = (t: TaskResult) =>
    TASK_TYPE_NAMES[t.task_type_id] || t.task_type || `Type ${t.task_type_id}`;

  return (
    <CollapsibleSection
      id="tasks"
      title="Tasks"
      description="Machine learning tasks in this benchmark"
      icon={<Flag className="h-4 w-4" style={{ color: entityColors.task }} />}
      badge={totalCount}
      defaultOpen={false}
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
              placeholder="Search tasks..."
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
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <div
                    key={t.task_id}
                    className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start gap-3">
                        <Flag
                          className="mt-0.5 h-5 w-5 shrink-0"
                          style={{ color: entityColors.task }}
                        />
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-base font-semibold">
                            Task #{t.task_id}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {getTypeName(t)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-muted-foreground mb-2 text-sm">
                        {t.source_data?.name && (
                          <span className="flex items-center gap-1.5">
                            <Database
                              className="h-3.5 w-3.5"
                              style={{ color: entityColors.data }}
                            />
                            Dataset: {t.source_data.name}
                          </span>
                        )}
                        {t.estimation_procedure?.name && (
                          <span className="text-xs">
                            {t.estimation_procedure.name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5">
                              <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                              {Number(t.runs || 0).toLocaleString()}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Runs</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5">
                              <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                              {Number(t.nr_of_likes || 0)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Likes</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <Badge
                      variant="openml"
                      className="relative z-10 flex items-center gap-0.75 px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: entityColors.task }}
                    >
                      <Hash className="h-3 w-3" />
                      {t.task_id}
                    </Badge>
                    <Link
                      href={`/tasks/${t.task_id}`}
                      className="absolute inset-0"
                      aria-label={`View task ${t.task_id}`}
                    >
                      <span className="sr-only">View task {t.task_id}</span>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground p-8 text-center">
                  {searchQuery
                    ? "No tasks match your search"
                    : "No tasks found"}
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
                    <th className="px-3 py-2 text-left font-medium">Type</th>
                    <th className="px-3 py-2 text-left font-medium">Dataset</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Procedure
                    </th>
                    <th className="px-3 py-2 text-right font-medium">Runs</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((t) => (
                      <tr
                        key={t.task_id}
                        className="hover:bg-accent border-b transition-colors"
                      >
                        <td className="px-3 py-2">
                          <Link
                            href={`/tasks/${t.task_id}`}
                            className="hover:underline"
                          >
                            <Badge
                              variant="openml"
                              className="text-[10px] font-semibold text-white"
                              style={{ backgroundColor: entityColors.task }}
                            >
                              {t.task_id}
                            </Badge>
                          </Link>
                        </td>
                        <td className="px-3 py-2">{getTypeName(t)}</td>
                        <td className="max-w-[200px] truncate px-3 py-2">
                          {t.source_data?.name || "-"}
                        </td>
                        <td className="text-muted-foreground max-w-[200px] truncate px-3 py-2">
                          {t.estimation_procedure?.name || "-"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {Number(t.runs || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-muted-foreground px-3 py-8 text-center"
                      >
                        No tasks found
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
              {tasks.length > 0 ? (
                tasks.map((t) => (
                  <Link
                    key={t.task_id}
                    href={`/tasks/${t.task_id}`}
                    className="hover:bg-accent group relative flex flex-col rounded-lg border p-4 transition-colors"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Flag
                        className="h-5 w-5"
                        style={{ color: entityColors.task }}
                      />
                      <Badge
                        variant="openml"
                        className="text-[10px] font-semibold text-white"
                        style={{ backgroundColor: entityColors.task }}
                      >
                        <Hash className="h-2.5 w-2.5" />
                        {t.task_id}
                      </Badge>
                    </div>
                    <h4 className="mb-1 text-sm font-semibold">
                      {getTypeName(t)}
                    </h4>
                    {t.source_data?.name && (
                      <p className="text-muted-foreground mb-3 line-clamp-1 text-xs">
                        <Database
                          className="mr-1 inline h-3 w-3"
                          style={{ color: entityColors.data }}
                        />
                        {t.source_data.name}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      <span className="flex items-center gap-1">
                        <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                        {Number(t.runs || 0).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-muted-foreground col-span-full p-8 text-center">
                  No tasks found
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
                {tasks.length > 0 ? (
                  (() => {
                    if (
                      !selectedTask ||
                      !tasks.find((t) => t.task_id === selectedTask.task_id)
                    ) {
                      setTimeout(() => setSelectedTask(tasks[0]), 0);
                    }
                    return tasks.map((t) => (
                      <button
                        key={t.task_id}
                        onClick={() => setSelectedTask(t)}
                        className={`hover:bg-accent block w-full cursor-pointer border-b p-3 text-left transition-colors ${selectedTask?.task_id === t.task_id ? "bg-accent" : ""}`}
                      >
                        <div className="mb-1 flex items-start gap-2">
                          <Flag
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: entityColors.task }}
                          />
                          <h4 className="line-clamp-1 text-sm font-semibold">
                            Task #{t.task_id}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="text-muted-foreground">
                            {getTypeName(t)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                            {Number(t.runs || 0).toLocaleString()}
                          </span>
                        </div>
                      </button>
                    ));
                  })()
                ) : (
                  <div className="text-muted-foreground p-8 text-center">
                    No tasks found
                  </div>
                )}
              </div>
              <div
                className="flex-1 overflow-y-auto p-6"
                style={{ maxHeight: "600px" }}
              >
                {selectedTask ? (
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Flag
                          className="h-6 w-6"
                          style={{ color: entityColors.task }}
                        />
                        <h2 className="text-xl font-bold">
                          Task #{selectedTask.task_id}
                        </h2>
                      </div>
                      <Badge
                        variant="openml"
                        className="text-xs font-semibold text-white"
                        style={{ backgroundColor: entityColors.task }}
                      >
                        <Hash className="h-3 w-3" />
                        {selectedTask.task_id}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <Badge variant="secondary">
                        {getTypeName(selectedTask)}
                      </Badge>
                    </div>
                    {selectedTask.source_data?.name && (
                      <p className="text-muted-foreground mb-2 text-sm">
                        <Database
                          className="mr-1 inline h-4 w-4"
                          style={{ color: entityColors.data }}
                        />
                        Dataset: {selectedTask.source_data.name}
                      </p>
                    )}
                    {selectedTask.estimation_procedure?.name && (
                      <p className="text-muted-foreground mb-4 text-sm">
                        {selectedTask.estimation_procedure.name}
                      </p>
                    )}
                    <div className="mb-4 flex gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                        {Number(selectedTask.runs || 0).toLocaleString()} runs
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                        {Number(selectedTask.nr_of_likes || 0)} likes
                      </span>
                    </div>
                    <Link
                      href={`/tasks/${selectedTask.task_id}`}
                      className="text-primary mt-2 inline-flex items-center gap-1 text-sm hover:underline"
                    >
                      View full details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center">
                    Select a task to view details
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

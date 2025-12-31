"use client";

import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Cog,
  GitBranch,
  Heart,
  CloudDownload,
  FlaskConical,
} from "lucide-react";
import { Sorting } from "@elastic/react-search-ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Flows Results Table Component - Sortable Columns
 */

interface FlowResult {
  flow_id?: { raw: string | number };
  name?: { raw: string; snippet?: string };
  status?: { raw: string };
  version?: { raw: string | number };
  uploader?: { raw: string };
  date?: { raw: string };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  runs?: { raw: number };
}

interface FlowsResultsTableProps {
  results?: FlowResult[];
}

// Sortable columns configuration for Flows
const sortableColumns = [
  { field: "flow_id", label: "ID", width: "w-20" },
  { field: "name", label: "Name", width: "w-96" }, // Increased width for truncated name
  {
    field: "version",
    label: <GitBranch className="h-4 w-4" />,
    tooltip: "Version",
    width: "w-16",
  },
  { field: "uploader", label: "Uploader", width: "w-40" },
  { field: "date", label: "Date", width: "w-32" },
  {
    field: "nr_of_likes",
    label: <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />,
    tooltip: "Likes",
    width: "w-16",
  },
  {
    field: "nr_of_downloads",
    label: <CloudDownload className="h-4 w-4 text-gray-400" />,
    tooltip: "Downloads",
    width: "w-16",
  },
  {
    field: "runs",
    label: <FlaskConical className="h-4 w-4 text-black dark:text-white" />,
    tooltip: "Runs",
    width: "w-16",
  },
];

// Convert columns to sortOptions format expected by Search UI
const sortOptions = sortableColumns.map((col) => ({
  name: typeof col.label === "string" ? col.label : col.tooltip || col.field,
  value: [{ field: col.field, direction: "desc" as const }],
}));

export function FlowsResultsTable({ results }: FlowsResultsTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center justify-center p-8 text-sm">
        No flows found
      </div>
    );
  }

  return (
    <Sorting
      sortOptions={sortOptions}
      view={({ value, onChange }) => {
        // value is an array of sort objects
        const currentSort =
          Array.isArray(value) && value.length > 0 ? value[0] : null;

        const handleSort = (field: string) => {
          if (!onChange || typeof onChange !== "function") return;

          try {
            if (currentSort?.field === field) {
              // Toggle direction
              const newDirection =
                currentSort.direction === "asc" ? "desc" : "asc";
              onChange([{ field, direction: newDirection }]);
            } else {
              // Set new field with desc as default
              onChange([{ field, direction: "desc" }]);
            }
          } catch (error) {
            console.error("Error in handleSort:", error);
          }
        };

        const getSortIcon = (field: string) => {
          if (currentSort?.field !== field) {
            return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
          }
          return currentSort.direction === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3" />
          ) : (
            <ArrowDown className="ml-1 h-3 w-3" />
          );
        };

        return (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {sortableColumns.map((column) => (
                    <TableHead
                      key={column.field}
                      className={`${column.width} hover:bg-muted/50 cursor-pointer select-none`}
                      onClick={() => handleSort(column.field)}
                      title={
                        column.tooltip ||
                        (typeof column.label === "string" ? column.label : "")
                      }
                    >
                      <div className="flex items-center">
                        <span className="text-xs font-semibold tracking-wider uppercase">
                          {column.label}
                        </span>
                        {getSortIcon(column.field)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => {
                  const flowId = result.flow_id?.raw;
                  return (
                    <TableRow key={flowId || `result-${index}`}>
                      <TableCell className="font-medium text-blue-600">
                        #{flowId}
                      </TableCell>
                      <TableCell className="min-w-0">
                        <Link
                          href={`/flows/${flowId}`}
                          className="flex items-center gap-2 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                          <Cog className="h-4 w-4 shrink-0 text-blue-500" />
                          <span className="line-clamp-2 break-all">
                            {result.name?.snippet ||
                              result.name?.raw ||
                              "Untitled"}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">
                          v.{result.version?.raw || "1"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {result.uploader?.raw || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-xs">
                          {result.date?.raw
                            ? new Date(result.date.raw).toLocaleDateString()
                            : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {result.nr_of_likes?.raw?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-600">
                        {result.nr_of_downloads?.raw?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        {result.runs?.raw?.toLocaleString() || "0"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      }}
    />
  );
}

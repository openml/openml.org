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
import { WithSearch } from "@elastic/react-search-ui";
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

// Column configuration for Flows
// sortable: false for text fields that can't be sorted in ES
const tableColumns = [
  { field: "flow_id", label: "ID", width: "w-20", sortable: true },
  { field: "exact_name", label: "Name", width: "w-96", sortable: true },
  {
    field: "version",
    label: <GitBranch className="h-4 w-4" />,
    tooltip: "Version",
    width: "w-16",
    sortable: true,
  },
  { field: "uploader", label: "Uploader", width: "w-40", sortable: false },
  { field: "date", label: "Date", width: "w-32", sortable: true },
  {
    field: "nr_of_likes",
    label: <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />,
    tooltip: "Likes",
    width: "w-16",
    sortable: true,
  },
  {
    field: "nr_of_downloads",
    label: <CloudDownload className="h-4 w-4 text-gray-400" />,
    tooltip: "Downloads",
    width: "w-16",
    sortable: true,
  },
  {
    field: "runs",
    label: <FlaskConical className="h-4 w-4 text-black dark:text-white" />,
    tooltip: "Runs",
    width: "w-16",
    sortable: true,
  },
];

export function FlowsResultsTable({ results }: FlowsResultsTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center justify-center p-8 text-sm">
        No flows found
      </div>
    );
  }

  return <SortableFlowsTable results={results} />;
}

// Separate component to handle sorting with WithSearch
function SortableFlowsTable({ results }: { results: FlowResult[] }) {
  return (
    <WithSearch
      mapContextToProps={({ sortList, setSort }) => ({ sortList, setSort })}
    >
      {(props) => {
        const sortList = props.sortList as
          | Array<{ field: string; direction: string }>
          | undefined;
        const setSort = props.setSort as
          | ((
              sort: Array<{ field: string; direction: string }>,
              dir: string,
            ) => void)
          | undefined;

        const currentSort =
          sortList && sortList.length > 0 ? sortList[0] : null;

        const handleSort = (field: string, sortable: boolean) => {
          if (!sortable || !setSort) return;
          if (currentSort?.field === field) {
            const newDirection =
              currentSort.direction === "asc" ? "desc" : "asc";
            setSort([{ field, direction: newDirection }], newDirection);
          } else {
            setSort([{ field, direction: "desc" }], "desc");
          }
        };

        const getSortIcon = (field: string, sortable: boolean) => {
          if (!sortable) return null;
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
                  {tableColumns.map((column) => (
                    <TableHead
                      key={column.field}
                      className={`${column.width} ${column.sortable ? "hover:bg-muted/50 cursor-pointer" : ""} select-none`}
                      onClick={() => handleSort(column.field, column.sortable)}
                      title={
                        column.tooltip ||
                        (typeof column.label === "string" ? column.label : "")
                      }
                    >
                      <div className="flex items-center">
                        <span className="text-xs font-semibold tracking-wider uppercase">
                          {column.label}
                        </span>
                        {getSortIcon(column.field, column.sortable)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => {
                  const flowId = result.flow_id?.raw;
                  return (
                    <TableRow
                      key={flowId || `result-${index}`}
                      className="transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/15"
                    >
                      <TableCell className="font-medium">#{flowId}</TableCell>
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
    </WithSearch>
  );
}

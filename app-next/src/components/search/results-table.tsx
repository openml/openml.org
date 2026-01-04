"use client";

import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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
 * Results Table Component - Sortable Columns
 *
 * TERMINOLOGY:
 * - "Sortable column": Column header that can be clicked to sort
 * - "Sort indicator": Icon showing sort direction (↑ ascending, ↓ descending)
 * - "Sort state": Current sort field and direction
 *
 * URL FORMAT (Backward Compatible):
 * Current: /datasets?sort[0][field]=runs&sort[0][direction]=desc
 * Future: /datasets?sortField=runs&sortDirection=desc (simpler, for SEO)
 *
 * Features:
 * - Clickable column headers
 * - Visual sort indicators
 * - URL synchronization for sort state
 */

interface Result {
  id?: { raw: string };
  data_id?: { raw: string };
  name?: { raw: string; snippet?: string };
  status?: { raw: string };
  version?: { raw: string };
  creator?: { raw: string };
  date?: { raw: string };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  runs?: { raw: number };
}

interface ResultsTableProps {
  result?: Result; // Single result (not used in table view)
  results?: Result[]; // Array of results
}

// Helper to remove surrounding quotes from strings
const removeQuotes = (str: string | undefined): string => {
  if (!str) return "-";
  return str.replace(/^"|"$/g, "").trim() || "-";
};

// Column configuration
// sortable: false for text fields that can't be sorted in ES
const tableColumns = [
  { field: "data_id", label: "ID", width: "w-20", sortable: true },
  { field: "exact_name", label: "Name", width: "w-64", sortable: true },
  { field: "version", label: "Version", width: "w-24", sortable: true },
  { field: "creator", label: "Creator", width: "w-40", sortable: false },
  { field: "date", label: "Date", width: "w-32", sortable: true },
  { field: "nr_of_likes", label: "Likes", width: "w-20", sortable: true },
  {
    field: "nr_of_downloads",
    label: "Downloads",
    width: "w-28",
    sortable: true,
  },
  { field: "runs", label: "Runs", width: "w-20", sortable: true },
];

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center justify-center p-8">
        No results found
      </div>
    );
  }

  return <SortableTable results={results} />;
}

// Separate component to handle sorting with WithSearch
function SortableTable({ results }: { results: Result[] }) {
  return (
    <WithSearch
      mapContextToProps={({ sortList, setSort }) => ({ sortList, setSort })}
    >
      {(props) => {
        // Type assertions for Search UI props
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
                    >
                      <div className="flex items-center">
                        {column.label}
                        {getSortIcon(column.field, column.sortable)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow
                    key={
                      result.id?.raw || result.data_id?.raw || `result-${index}`
                    }
                  >
                    <TableCell className="font-medium">
                      {result.data_id?.raw || result.id?.raw}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/datasets/${result.data_id?.raw || result.id?.raw}`}
                        className="line-clamp-3 font-semibold text-green-600 hover:underline dark:text-green-500"
                      >
                        {result.name?.snippet || result.name?.raw || "Untitled"}
                      </Link>
                    </TableCell>
                    <TableCell>{result.version?.raw || "-"}</TableCell>
                    <TableCell className="line-clamp-3">
                      {removeQuotes(result.creator?.raw)}
                    </TableCell>
                    <TableCell>
                      {result.date?.raw
                        ? new Date(result.date.raw).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {result.nr_of_likes?.raw?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell className="text-right">
                      {result.nr_of_downloads?.raw?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell className="text-right">
                      {result.runs?.raw?.toLocaleString() || "0"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      }}
    </WithSearch>
  );
}

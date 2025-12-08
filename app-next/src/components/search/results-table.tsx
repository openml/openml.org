"use client";

import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

// Sortable columns configuration
const sortableColumns = [
  { field: "data_id", label: "ID", width: "w-20" },
  { field: "name", label: "Name", width: "w-64" },
  { field: "status", label: "Status", width: "w-32" },
  { field: "version", label: "Version", width: "w-24" },
  { field: "creator", label: "Creator", width: "w-40" },
  { field: "date", label: "Date", width: "w-32" },
  { field: "nr_of_likes", label: "Likes", width: "w-20" },
  { field: "nr_of_downloads", label: "Downloads", width: "w-28" },
  { field: "runs", label: "Runs", width: "w-20" },
];

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center justify-center p-8">
        No results found
      </div>
    );
  }

  return (
    <Sorting
      sortOptions={[]} // Empty array since we handle sorting via column headers
      view={({ value, onChange }) => {
        // value is an array of sort objects
        const currentSort =
          Array.isArray(value) && value.length > 0 ? value[0] : null;

        const handleSort = (field: string) => {
          if (onChange && typeof onChange === "function") {
            if (currentSort?.field === field) {
              // Toggle direction
              const newDirection =
                currentSort.direction === "asc" ? "desc" : "asc";
              onChange([{ field, direction: newDirection }]);
            } else {
              // Set new field with desc as default
              onChange([{ field, direction: "desc" }]);
            }
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
                    >
                      <div className="flex items-center">
                        {column.label}
                        {getSortIcon(column.field)}
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
                        href={`/d/${result.data_id?.raw || result.id?.raw}`}
                        className="text-primary line-clamp-3 hover:underline"
                      >
                        {result.name?.snippet || result.name?.raw || "Untitled"}
                      </Link>
                    </TableCell>
                    <TableCell>{result.status?.raw || "-"}</TableCell>
                    <TableCell>{result.version?.raw || "-"}</TableCell>
                    <TableCell className="line-clamp-3">
                      {result.creator?.raw || "-"}
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
    />
  );
}

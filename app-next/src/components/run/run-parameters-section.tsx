"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ParameterSetting {
  name: string;
  value: string | number | boolean | null;
}

interface Run {
  parameter_setting?: ParameterSetting[];
}

interface RunParametersSectionProps {
  run: Run;
}

const ITEMS_PER_PAGE = 25;

export function RunParametersSection({ run }: RunParametersSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize parameters to prevent unnecessary re-renders
  const parameters = useMemo(
    () => run.parameter_setting || [],
    [run.parameter_setting],
  );

  // Filter parameters based on search term
  const filteredParameters = useMemo(() => {
    if (!searchTerm.trim()) return parameters;
    const term = searchTerm.toLowerCase();
    return parameters.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        String(p.value).toLowerCase().includes(term),
    );
  }, [parameters, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredParameters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedParameters = filteredParameters.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (parameters.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No parameters available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and pagination controls */}
      {parameters.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search parameters..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredParameters.length)}{" "}
              of {filteredParameters.length}
              {searchTerm && ` (filtered from ${parameters.length})`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parameters table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left text-sm font-medium">Parameter</th>
              <th className="p-3 text-left text-sm font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {paginatedParameters.map(
              (param: ParameterSetting, index: number) => (
                <tr key={index} className="hover:bg-muted/50 border-b">
                  <td className="p-3 font-mono text-sm">{param.name}</td>
                  <td className="max-w-md p-3 font-mono text-sm break-all">
                    {String(param.value)}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* No results message */}
      {filteredParameters.length === 0 && searchTerm && (
        <div className="text-muted-foreground p-4 text-center text-sm">
          No parameters matching &ldquo;{searchTerm}&rdquo;
        </div>
      )}
    </div>
  );
}
